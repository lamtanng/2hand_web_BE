import express from 'express';

import { DASHBOARD_ROUTE, ORDER_ROUTE, ROLE_ROUTE, USER_ROUTE } from '../../../constants/routes';
import { isAuthorized } from '../../../middlewares/auth.middleware';
import { dashboardRouter } from './dashboard.routes';
import { orderRoutes } from './order.routes';
import { roleRoutes } from './role.route';
import { userRoutes } from './user.routes';

const router = express.Router();

// Children routes
router.use(ROLE_ROUTE, isAuthorized, roleRoutes);
router.use(DASHBOARD_ROUTE, isAuthorized, dashboardRouter);
router.use(ORDER_ROUTE, isAuthorized, orderRoutes);
router.use(USER_ROUTE, isAuthorized, userRoutes);

export const adminRouter = router;
