import express from 'express';
import { signupValidation } from '../../validations/signup.validation';
import { signupController } from '../../controllers/signup.controller';
const router = express.Router();

router.route('/').post(signupValidation.signup, signupController.signup);

export const signupRoutes = router;
