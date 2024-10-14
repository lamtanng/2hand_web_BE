import express from 'express';
import { userController } from '../../../controllers/user.controller';
import { userValidation } from '../../../validations/user.validation';
const router = express.Router();

const { findAll, addUser } = userController;
router.route('/').get(findAll);
router.route('/').post(userValidation, addUser);

export const userRoutes = router;
