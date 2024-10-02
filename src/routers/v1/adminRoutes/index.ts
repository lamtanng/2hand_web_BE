import express from 'express';

import { DASHBOARD_ROUTE } from '../../../constants/routes';
import { dashboardRouter } from './dashboard.routes';
import { isAuthorized } from '../../../middlewares/auth.middleware';

const router = express.Router();

// Children routes
router.use(DASHBOARD_ROUTE, isAuthorized, dashboardRouter);

export const adminRouter = router;
