import express from 'express';
import { roleController } from '../../controllers/role.controller';
const router = express.Router();

router.route('/').get(roleController.findAll);
router.route('/').post(roleController.addRole);

export const roleRoutes = router;
