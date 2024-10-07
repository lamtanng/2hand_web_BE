import express from 'express';
import { userController } from '../../controllers/user.controller';
import { userValidation } from '../../validations/user.validation';
const router = express.Router();

router.route('/').get(userController.findAll);
router.route('/').post(userValidation ,userController.addUser);

export const userRoutes = router;
