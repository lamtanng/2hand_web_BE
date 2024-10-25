import express from 'express';

import {
  CATEGORY_ROUTE,
  DASHBOARD_ROUTE,
  ORDER_ROUTE,
  ROLE_ROUTE,
} from '../../../constants/routes';
import { isAuthorized } from '../../../middlewares/auth.middleware';
import { dashboardRouter } from './dashboard.routes';
import { orderRoutes } from './order.routes';
import { roleRoutes } from './role.route';

const router = express.Router();

// Children routes
router.use(ROLE_ROUTE, isAuthorized, roleRoutes);
router.use(DASHBOARD_ROUTE, isAuthorized, dashboardRouter);
router.use(ORDER_ROUTE, isAuthorized, orderRoutes);

export const adminRouter = router;
