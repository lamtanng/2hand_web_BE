import express from 'express';
import { ActionPermission } from '../../../constants/actionPermission';
import { userController } from '../../../controllers/user.controller';
import { checkRolePermission } from '../../../middlewares/auth.middleware';
import { userValidation } from '../../../validations/user.validation';
const router = express.Router();

const { findAll, addUser } = userController;
const { Read, Create } = ActionPermission.User;

router.route('/').get(checkRolePermission(Read), findAll);
router.route('/').post(checkRolePermission(Create), userValidation, addUser);

export const userRoutes = router;
