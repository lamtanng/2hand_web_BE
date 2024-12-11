import express from 'express';
import { dashboardController } from '../../../controllers/adminControllers/dashboard.controller';
import { STORE_STATISTIC_ROUTE } from '../../../constants/routes';
const router = express.Router();

router.route(STORE_STATISTIC_ROUTE).get(dashboardController.statistics);

export const dashboardRouter = router;
