import { ActionPermission } from '../../../constants/actionPermission';
import { userController } from '../../../controllers/user.controller';
import { checkAdminPermission } from '../../../middlewares/auth.middleware';
import express from 'express';

const router = express.Router();

const { Read } = ActionPermission.User;
const { findAll } = userController;
router.route('/').get(checkAdminPermission(Read), findAll);
