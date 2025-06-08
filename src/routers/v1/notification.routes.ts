import express from 'express';
import { notificationController } from '../../controllers/notification.controller';
import { NOTIFICATION_ROUTE } from '../../constants/routes';

const router = express.Router();

router.post(NOTIFICATION_ROUTE, notificationController.createNotification);
router.get(NOTIFICATION_ROUTE, notificationController.getNotifications);
router.get(`${NOTIFICATION_ROUTE}/:id`, notificationController.getNotificationById);
router.post(`${NOTIFICATION_ROUTE}/mark-as-read`, notificationController.markAsRead);
router.put(NOTIFICATION_ROUTE, notificationController.updateNotification);
router.delete(`${NOTIFICATION_ROUTE}/:id`, notificationController.deleteNotification);
router.get(`${NOTIFICATION_ROUTE}-count`, notificationController.countNotification);
router.delete(`${NOTIFICATION_ROUTE}/receiver/:id`, notificationController.deleteAllByReceiver);
router.put(`${NOTIFICATION_ROUTE}/receiver/:id`, notificationController.markAllAsReadByReceiver);

export default router;
