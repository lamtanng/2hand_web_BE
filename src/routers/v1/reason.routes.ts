import express from 'express';
import { reasonController } from '../../controllers/reason.controller';
import { reasonValidation } from '../../validations/reason.validation';
const router = express.Router();

router.route('/').get(reasonController.findAll);
router.route('/').post(reasonValidation, reasonController.createReason);

export const reasonRoutes = router;
