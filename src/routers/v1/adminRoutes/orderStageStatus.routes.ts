import express from 'express';
import { ORDER_STAGE_STATUS_ROUTE } from '../../../constants/routes';
import { orderStageStatusController } from '../../../controllers/orderStageStatus.controller';
const router = express.Router();

const { createOne } = orderStageStatusController;

router.route('/').get();
router.route('/').post(createOne);

export const orderStageStatusRoutes = router;
