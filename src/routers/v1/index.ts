import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ADMIN_ROUTE, AUTH_ROUTE } from '../../constants/routes';
import { adminRouter } from './adminRoutes';
import { authRouter } from './auth.routes';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).send('V1 APIs are already to use !');
});

// Children routes
router.use(AUTH_ROUTE, authRouter);
router.use(ADMIN_ROUTE, adminRouter);

export const APIs_V1 = router;
