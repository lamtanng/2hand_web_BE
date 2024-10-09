import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  ADMIN_ROUTE,
  AUTH_ROUTE,
  ORDER_ROUTE,
  ORDERDETAIL_ROUTE,
  ORDERREQUEST_ROUTE,
  ORDERSTATUS_ROUTE,
  PAYMENTMETHOD_ROUTE,
  REASON_ROUTE,
  REPORT_ROUTE,
  REVIEW_ROUTE,
  ROLE_ROUTE,
  SELLER_ROUTE,
  USER_ROUTE,
} from '../../constants/routes';
import { adminRouter } from './adminRoutes';
import { authRouter } from './auth.routes';
import { customerRouter } from './customerRoutes';
import { roleRoutes } from './role.route';
import { userRoutes } from './user.route';
import { reviewRoutes } from './review.route';
import { orderStatusRoutes } from './orderStatus.route';
import { paymentMethodRoutes } from './paymentMethod.route';
import { reasonRoutes } from './reason.routes';
import { orderRoutes } from './customerRoutes/order.routes';
import { orderDetailRoutes } from './orderDetail.routes';
import { orderRequestRoutes } from './orderRequest.routes';
import { reportRoutes } from './report.routes';
import { sellerRouter } from './sellerRoutes';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).send('V1 APIs are already to use !');
});

// Children routes
router.use(AUTH_ROUTE, authRouter);
router.use(ADMIN_ROUTE, adminRouter);
router.use(SELLER_ROUTE, sellerRouter);
router.use('/', customerRouter);

router.use(ROLE_ROUTE, roleRoutes);
router.use(USER_ROUTE, userRoutes);

router.use(REVIEW_ROUTE, reviewRoutes);
router.use(ORDERSTATUS_ROUTE, orderStatusRoutes);
router.use(PAYMENTMETHOD_ROUTE, paymentMethodRoutes);

router.use(REASON_ROUTE, reasonRoutes);
router.use(ORDER_ROUTE, orderRoutes);
router.use(ORDERDETAIL_ROUTE, orderDetailRoutes);
router.use(ORDERREQUEST_ROUTE, orderRequestRoutes);
router.use(REPORT_ROUTE, reportRoutes);

export const APIs_V1 = router;
