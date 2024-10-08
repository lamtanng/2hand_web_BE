import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ADMIN_ROUTE, AUTH_ROUTE } from '../../constants/routes';
import { adminRouter } from './adminRoutes';
import { authRouter } from './auth.routes';
import { customerRouter } from './customerRoutes';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).send('V1 APIs are already to use !');
});

// Children routes
router.use(AUTH_ROUTE, authRouter);
router.use(ADMIN_ROUTE, adminRouter);
router.use('/', customerRouter);
// router.use(ROLE_ROUTE, roleRoutes);
// router.use(USER_ROUTE, userRoutes);
// router.use(STORE_ROUTE, storeRoutes);
// router.use(CATEGORY_ROUTE, categoryRoutes);
// router.use(REVIEW_ROUTE, reviewRoutes);
// router.use(ORDERSTATUS_ROUTE, orderStatusRoutes);
// router.use(PAYMENTMETHOD_ROUTE, paymentMethodRoutes);
// router.use(CART_ROUTE, cartRoutes);
// router.use(REASON_ROUTE, reasonRoutes);
// router.use(ORDER_ROUTE, orderRoutes);
// router.use(ORDERDETAIL_ROUTE, orderDetailRoutes);
// router.use(ORDERREQUEST_ROUTE, orderRequestRoutes);
// router.use(REPORT_ROUTE, reportRoutes);
  
export const APIs_V1 = router;
