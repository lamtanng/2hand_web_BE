import { OrderStage } from '../types/enum/orderStage.enum';
import { NotificationType } from '../types/model/notification.type';

export const NOTIFICATION_CONTENT: Record<
  NotificationType,
  Record<string, { title: string; content: any }>
> = {
  [NotificationType.Order]: {
    [OrderStage.Confirmating]: {
      title: 'Đơn hàng mới',
      content: (orderCode: string) =>
        `<div><p>Đơn hàng <strong>${orderCode}</strong> của bạn đã được tạo thành công.</p><p>Vui lòng chờ người bán xác nhận đơn hàng.</p></div>`,
    },
    [OrderStage.Picking]: {
      title: 'Đơn hàng đang được chuẩn bị',
      content: (orderCode: string) =>
        `<div><p>Đơn hàng <strong>${orderCode}</strong> đang được người bán chuẩn bị.</p><p>Chúng tôi sẽ thông báo khi đơn hàng được giao cho đơn vị vận chuyển.</p></div>`,
    },
    [OrderStage.Delivering]: {
      title: 'Đơn hàng đang giao',
      content: (orderCode: string) =>
        `<div><p>Đơn hàng <strong>${orderCode}</strong> đang được giao đến bạn.</p></div>`,
    },
    [OrderStage.Delivered]: {
      title: 'Đơn hàng đã giao thành công',
      content: (orderCode: string) =>
        `<div><p>Đơn hàng <strong>${orderCode}</strong> đã được giao thành công.</p><p>Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi!</p></div>`,
    },
    [OrderStage.Cancelled]: {
      title: 'Đơn hàng đã hủy',
      content: (orderCode: string) =>
        `<div><p>Đơn hàng <strong>${orderCode}</strong> đã bị hủy.</p></div>`,
    },
    [OrderStage.Returned]: {
      title: 'Đơn hàng hoàn trả',
      content: (orderCode: string) =>
        `<div><p>Đơn hàng <strong>${orderCode}</strong> đã được hoàn trả.</p></div>`,
    },
  },
  [NotificationType.Finance]: {
    payment_success: {
      title: 'Thanh toán thành công',
      content:
        '<div><p>Thanh toán cho đơn hàng <strong>{orderCode}</strong> đã thành công.</p><p>Số tiền: <strong>{amount}</strong></p></div>',
    },
    payment_failed: {
      title: 'Thanh toán thất bại',
      content:
        '<div><p>Thanh toán cho đơn hàng <strong>{orderCode}</strong> không thành công.</p><p>Vui lòng thử lại sau.</p></div>',
    },
    refund: {
      title: 'Hoàn tiền thành công',
      content:
        '<div><p>Hoàn tiền cho đơn hàng <strong>{orderCode}</strong> đã thành công.</p><p>Số tiền hoàn: <strong>{amount}</strong></p></div>',
    },
  },
  [NotificationType.System]: {
    maintenance: {
      title: 'Thông báo bảo trì hệ thống',
      content:
        '<div><p>Hệ thống sẽ tạm ngưng hoạt động để bảo trì.</p><p>Thời gian: <strong>{startTime}</strong> - <strong>{endTime}</strong></p></div>',
    },
    promotion: {
      title: 'Chương trình khuyến mãi',
      content:
        '<div><p>{promotionName}</p><p>Thời gian: <strong>{startDate}</strong> - <strong>{endDate}</strong></p><p>Chi tiết: {description}</p></div>',
    },
  },
  [NotificationType.Product]: {},
  [NotificationType.User]: {},
};

export const NOTIFICATION_CONTENT_SELLER: Record<
  NotificationType,
  Record<string, { title: string; content: any }>
> = {
  [NotificationType.Order]: {
    [OrderStage.Confirmating]: {
      title: 'Bạn có đơn hàng mới',
      content: (orderCode: string) =>
        `<div><p>Bạn có đơn hàng mới: <strong>${orderCode}</strong>.</p><p>Vui lòng xác nhận đơn hàng trong thời gian sớm nhất.</p></div>`,
    },
    [OrderStage.Picking]: {
      title: 'Đơn hàng đang được chuẩn bị',
      content: (orderCode: string) =>
        `<div><p>Đơn hàng <strong>${orderCode}</strong> đang được chuẩn bị.</p></div>`,
    },
    [OrderStage.Delivering]: {
      title: 'Đơn hàng đã được giao cho đơn vị vận chuyển',
      content: (orderCode: string) =>
        `<div><p>Đơn hàng <strong>${orderCode}</strong> đã được giao cho đơn vị vận chuyển.</p></div>`,
    },
    [OrderStage.Delivered]: {
      title: 'Đơn hàng đã giao thành công',
      content: (orderCode: string) =>
        `<div><p>Đơn hàng <strong>${orderCode}</strong> đã được giao thành công.</p></div>`,
    },
    [OrderStage.Cancelled]: {
      title: 'Đơn hàng đã hủy',
      content: (orderCode: string) =>
        `<div><p>Đơn hàng <strong>${orderCode}</strong> đã bị hủy.</p></div>`,
    },
    [OrderStage.Returned]: {
      title: 'Đơn hàng hoàn trả',
      content: (orderCode: string) =>
        `<div><p>Đơn hàng <strong>${orderCode}</strong> đã được hoàn trả.</p></div>`,
    },
    // Thêm trạng thái mới cho đơn hàng bán thành công
    order_success: {
      title: 'Đơn hàng bán thành công',
      content: (orderCode: string, amount: string) =>
        `<div>
          <p>Đơn hàng <strong>${orderCode}</strong> đã được bán thành công!</p>
          <p>Số tiền: <strong>${amount}</strong></p>
          <p>Tiền sẽ được chuyển vào tài khoản của bạn sau khi hoàn tất kiểm tra.</p>
        </div>`,
    },
  },
  [NotificationType.Finance]: {
    payment_received: {
      title: 'Đã nhận thanh toán',
      content: (orderCode: string, amount: string) =>
        `<div>
          <p>Bạn đã nhận thanh toán cho đơn hàng <strong>${orderCode}</strong>.</p>
          <p>Số tiền: <strong>${amount}</strong></p>
        </div>`,
    },
    withdrawal_success: {
      title: 'Rút tiền thành công',
      content: (amount: string) =>
        `<div>
          <p>Yêu cầu rút tiền của bạn đã thành công.</p>
          <p>Số tiền: <strong>${amount}</strong></p>
        </div>`,
    },
  },
  [NotificationType.System]: {
    // ...giữ nguyên như NOTIFICATION_CONTENT
  },
  [NotificationType.Product]: {
    low_stock: {
      title: 'Sản phẩm sắp hết hàng',
      content: (productName: string) =>
        `<div>
          <p>Sản phẩm <strong>${productName}</strong> sắp hết hàng.</p>
          <p>Vui lòng bổ sung hàng tồn kho.</p>
        </div>`,
    },
    out_of_stock: {
      title: 'Sản phẩm đã hết hàng',
      content: (productName: string) =>
        `<div>
          <p>Sản phẩm <strong>${productName}</strong> đã hết hàng.</p>
          <p>Vui lòng bổ sung hàng tồn kho để tiếp tục bán.</p>
        </div>`,
    },
  },
  [NotificationType.User]: {
    new_review: {
      title: 'Có đánh giá mới',
      content: (productName: string) =>
        `<div>
          <p>Sản phẩm <strong>${productName}</strong> có đánh giá mới.</p>
        </div>`,
    },
  },
};
