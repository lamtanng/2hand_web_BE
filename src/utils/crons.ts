import { ProductModel } from '../models/product';
import { openaiService } from '../services/openai.service';
import cron from 'node-cron';

const MAX_CONCURRENT_API_CALLS = 5; // Giới hạn request đồng thời tới OpenAI
const BATCH_SIZE = 100; // Số lượng sản phẩm xử lý mỗi batch
const EVENT_NAME = 'cron:product_approval';

const emitProductApprovalNotification = (
  productId: any,
  storeId: any,
  status: 'processing' | 'done',
) => {
  if (!global.socketIO) return;

  const notificationData = {
    _id: productId.toString(),
    status,
  };

  // Broadcast cho tất cả client
  global.socketIO.emit(EVENT_NAME, notificationData);

  // Nếu có storeID, gửi thông báo tới store room
  if (storeId) {
    global.socketIO.to(storeId.toString()).emit(EVENT_NAME, notificationData);
  }
};

const autoApproveProducts = async () => {
  try {
    const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
    let processedCount = 0;
    let approvedCount = 0;
    let lastProcessedId: string | null = null;

    const { default: pLimit } = await import('p-limit');

    // Tạo giới hạn đồng thời cho API calls
    const limit = pLimit(MAX_CONCURRENT_API_CALLS);

    // Danh sách các thao tác bulk cập nhật
    const bulkUpdateOps: any[] = [];

    console.time('CRON Processing Time');

    do {
      // Tạo query với batch size và sử dụng con trỏ
      const query: any = {
        // isApproved: false,
        createdAt: { $lte: cutoffTime },
      };

      if (lastProcessedId) {
        query._id = { $gt: lastProcessedId };
      }

      // Lấy batch sản phẩm
      const products = await ProductModel.find(query, {
        name: 1,
        description: 1,
        image: 1,
        createdAt: 1,
        storeID: 1, // Lấy storeID để gửi thông báo
      })
        .sort({ _id: 1 })
        .limit(BATCH_SIZE)
        .lean();

      if (products.length === 0) break;

      // Cập nhật ID cuối cùng
      lastProcessedId = products[products.length - 1]._id.toString();
      processedCount += products.length;

      // Tạo các promise cho việc kiểm tra OpenAI
      const checkPromises = products.map((product) =>
        limit(async () => {
          try {
            // Thông báo bắt đầu xử lý sản phẩm
            emitProductApprovalNotification(product._id, product.storeID, 'processing');

            const content = [product.name, product.description];
            const checkViolation = await openaiService.checkCommunityViolation(
              content,
              product.image,
            );
            console.log('checkViolation', product.name, checkViolation.status);
            if (!checkViolation.status) {
              // Thêm vào bulk operations thay vì save từng cái
              bulkUpdateOps.push({
                updateOne: {
                  filter: { _id: product._id },
                  update: { $set: { isApproved: true } },
                },
              });
              approvedCount++;

              // Thông báo hoàn tất xét duyệt sản phẩm
              emitProductApprovalNotification(product._id, product.storeID, 'done');
            }
            return true;
          } catch (error) {
            console.error(`Error processing product ${product._id}:`, error);
            return false;
          }
        }),
      );

      // Chờ tất cả các promise trong batch hoàn thành
      await Promise.all(checkPromises);

      // Thực hiện bulk write nếu có operations
      if (bulkUpdateOps.length > 0) {
        await ProductModel.bulkWrite(bulkUpdateOps);
        bulkUpdateOps.length = 0; // Reset mảng
      }
    } while (true);

    console.timeEnd('CRON Processing Time');
    console.log(`🟢 Đã xử lý ${processedCount} sản phẩm | Đã duyệt: ${approvedCount}`);
  } catch (error) {
    console.error('❌ Lỗi CRON job:', error);
  }
};

export const startApprovalCron = () => {
  cron.schedule('43 9 * * *', autoApproveProducts, {
    timezone: 'Asia/Ho_Chi_Minh',
  });
};
