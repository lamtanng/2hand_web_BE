import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { loginRoutes } from './login.routes';
import { signupRoutes } from './signup.routes';
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '../../constants/routes';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).send('V1 APIs are already to use !');
});

// Children routes
router.use(LOGIN_ROUTE, loginRoutes);
router.use(SIGNUP_ROUTE, signupRoutes);

export const APIs_V1 = router;
