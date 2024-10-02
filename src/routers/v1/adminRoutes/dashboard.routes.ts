import express from 'express';
import { dashboardController } from '../../../controllers/adminControllers/dashboard.controller';
const router = express.Router();

router.route('/').get(dashboardController.access);

export const dashboardRouter = router;
