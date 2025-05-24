import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  ADMIN_ROUTE,
  AUTH_ROUTE,
  NOTIFICATION_ROUTE,
  ORDERDETAIL_ROUTE,
  ORDERREQUEST_ROUTE,
  ORDERSTAGE_ROUTE,
  PAYMENTMETHOD_ROUTE,
  REASON_ROUTE,
  REPORT_ROUTE,
  REVIEW_ROUTE,
  SELLER_ROUTE,
} from '../../constants/routes';
import { adminRouter } from './adminRoutes';
import { authRouter } from './auth.routes';
import { customerRouter } from './customerRoutes';
import { orderDetailRoutes } from './orderDetail.routes';
import { orderRequestRoutes } from './orderRequest.routes';
import { orderStageRoutes } from './customerRoutes/orderStage.routes';
import { paymentMethodRoutes } from './paymentMethod.route';
import { reasonRoutes } from './reason.routes';
import { reportRoutes } from './report.routes';
import { reviewRoutes } from './customerRoutes/review.routes';
import { sellerRouter } from './sellerRoutes';
import notificationRoutes from './notification.routes';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).send('V1 APIs are already to use !');
});

// Children routes
router.use(AUTH_ROUTE, authRouter);
router.use(ADMIN_ROUTE, adminRouter);
router.use(SELLER_ROUTE, sellerRouter);
router.use('/', customerRouter);

router.use(PAYMENTMETHOD_ROUTE, paymentMethodRoutes);

router.use(REASON_ROUTE, reasonRoutes);

router.use(ORDERDETAIL_ROUTE, orderDetailRoutes);
router.use(REPORT_ROUTE, reportRoutes);
router.use(NOTIFICATION_ROUTE, notificationRoutes);

export const APIs_V1 = router;
