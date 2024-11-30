import express from 'express';
import { orderStageStatusController } from '../../../controllers/orderStageStatus.controller';
import { orderStageStatusValidation } from '../../../validations/orderStageStatus.validation';
const router = express.Router();

const { createOne, updateDate } = orderStageStatusController;
const { createValidation, updateDateValidation } = orderStageStatusValidation;
router.route('/').get();
router.route('/').post(createValidation, createOne);
router.route('/').patch(updateDateValidation, updateDate);

export const orderStageStatusRoutes = router;
