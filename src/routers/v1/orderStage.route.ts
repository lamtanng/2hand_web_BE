import express from 'express';
import { orderStageValidation } from '../../validations/orderStage.validation';
import { orderStageController } from '../../controllers/orderStage.controller';
const router = express.Router();

router.route('/').get(orderStageController.findAll);
router.route('/').post(orderStageValidation, orderStageController.addStatus);

export const orderStageRoutes = router;
