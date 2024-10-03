import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ADMIN_ROUTE, AUTH_ROUTE } from '../../constants/routes';
import { adminRouter } from './adminRoutes';
import { authRouter } from './auth.routes';
import { roleRoutes } from './role.route';
import { userRoutes } from './user.route';
import { storeRoutes } from './store.route';
import { categoryRoutes } from './category.route';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).send('V1 APIs are already to use !');
});

// Children routes
router.use(AUTH_ROUTE, authRouter);
router.use(ADMIN_ROUTE, adminRouter);
router.use('/role', roleRoutes);
router.use('/user', userRoutes);
router.use('/store', storeRoutes);
router.use('/category', categoryRoutes);

export const APIs_V1 = router;
