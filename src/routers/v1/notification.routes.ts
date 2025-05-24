import express from 'express';
import { notificationController } from '../../controllers/notification.controller';

const router = express.Router();

router.post('/', notificationController.createNotification);
router.get('/', notificationController.getNotifications);
router.get('/:id', notificationController.getNotificationById);
router.post('/mark-as-read', notificationController.markAsRead);
router.put('/', notificationController.updateNotification);
router.delete('/:id', notificationController.deleteNotification);

export default router;
