import express from 'express';
import { orderStageStatusController } from '../../../controllers/orderStageStatus.controller';
import { orderStageStatusValidation } from '../../../validations/orderStageStatus.validation';
const router = express.Router();

const { createOne } = orderStageStatusController;
const { createValidation } = orderStageStatusValidation;
router.route('/').get();
router.route('/').post(createValidation, createOne);

export const orderStageStatusRoutes = router;
