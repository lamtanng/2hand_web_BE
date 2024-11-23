import express from 'express';

import {
  DASHBOARD_ROUTE,
  ORDER_ROUTE,
  ORDER_STAGE_STATUS_ROUTE,
  ROLE_ROUTE,
} from '../../../constants/routes';
import { isAuthorized } from '../../../middlewares/auth.middleware';
import { dashboardRouter } from './dashboard.routes';
import { orderRoutes } from './order.routes';
import { roleRoutes } from './role.route';
import { orderStageStatusRoutes } from './orderStageStatus.routes';

const router = express.Router();

// Children routes
router.use(ROLE_ROUTE, isAuthorized, roleRoutes);
router.use(DASHBOARD_ROUTE, isAuthorized, dashboardRouter);
router.use(ORDER_ROUTE, isAuthorized, orderRoutes);
router.use(ORDER_STAGE_STATUS_ROUTE, isAuthorized, orderStageStatusRoutes);

export const adminRouter = router;
