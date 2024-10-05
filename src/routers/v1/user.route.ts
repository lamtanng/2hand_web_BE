import express from 'express';
import { userController } from '../../controllers/user.controller';
const router = express.Router();

router.route('/').get(userController.findAll);
router.route('/').post(userController.addUser);

export const userRoutes = router;
