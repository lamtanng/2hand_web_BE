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
