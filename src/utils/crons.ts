import cron from 'node-cron';
import { ProductModel } from '../models/product';
import { PromisePool } from '@supercharge/promise-pool';
import { openaiService } from '../services/openai.service';

const MAX_CONCURRENT_API_CALLS = 5;
const BATCH_SIZE = 100;
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

  global.socketIO.emit(EVENT_NAME, notificationData);

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

    console.time('CRON Processing Time');

    do {
      const query: any = {
        createdAt: { $lte: cutoffTime },
        isApproved: false,
      };

      if (lastProcessedId) {
        query._id = { $gt: lastProcessedId };
      }

      const products = await ProductModel.find(query, {
        name: 1,
        description: 1,
        image: 1,
        createdAt: 1,
        storeID: 1,
      })
        .sort({ _id: 1 })
        .limit(BATCH_SIZE)
        .lean();

      if (products.length === 0) break;

      lastProcessedId = products[products.length - 1]._id.toString();
      processedCount += products.length;

      const bulkUpdateOps: any[] = [];

      const { results, errors } = await PromisePool.withConcurrency(MAX_CONCURRENT_API_CALLS)
        .for(products)
        .process(async (product) => {
          try {
            emitProductApprovalNotification(product._id, product.storeID, 'processing');

            const content = [product.name, product.description];
            const checkViolation = await openaiService.checkCommunityViolation(
              content,
              product.image,
            );
            if (!checkViolation.status) {
              bulkUpdateOps.push({
                updateOne: {
                  filter: { _id: product._id },
                  update: { $set: { isApproved: true } },
                },
              });
              approvedCount++;
            }

            setTimeout(() => {
              emitProductApprovalNotification(product._id, product.storeID, 'done');
            }, 3000);

            return true;
          } catch (err) {
            console.error(`❌ Lỗi xử lý sản phẩm ${product._id}:`, err);
            return false;
          }
        });

      if (bulkUpdateOps.length > 0) {
        await ProductModel.bulkWrite(bulkUpdateOps);
      }

      if (errors.length > 0) {
        console.warn(`⚠️ Có ${errors.length} lỗi xảy ra khi xử lý batch sản phẩm.`);
      }
    } while (true);

    console.timeEnd('CRON Processing Time');
    console.log(`🟢 Đã xử lý ${processedCount} sản phẩm | Đã duyệt: ${approvedCount}`);
  } catch (error) {
    console.error('❌ Lỗi CRON job:', error);
  }
};

export const startApprovalCron = () => {
  cron.schedule('1 3 * * *', autoApproveProducts, {
    timezone: 'Asia/Ho_Chi_Minh',
  });
};
