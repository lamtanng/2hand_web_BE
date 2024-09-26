import express from 'express';
import { loginValidation } from '../../validations/login.validation';
import { loginController } from '../../controllers/login.controller';
const router = express.Router();

router
  .route('/')
  .post(loginValidation.login, loginController.login);

export const loginRoutes = router;
