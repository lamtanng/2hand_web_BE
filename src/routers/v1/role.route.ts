import express from 'express';
import { roleController } from '../../controllers/role.controller';
import { roleValidation } from '../../validations/role.validation';
const router = express.Router();

router.route('/').get(roleController.findAll);
router.route('/').post(roleValidation, roleController.addRole);

export const roleRoutes = router;
