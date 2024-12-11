import express from 'express';
import { reasonController } from '../../controllers/reason.controller';
import { addReasonValidation, updateReasonValidation } from '../../validations/reason.validation';
const router = express.Router();

router.route('/').get(reasonController.findAll);
router.route('/').post(addReasonValidation, reasonController.createReason);
router.route('/').put(updateReasonValidation, reasonController.updateReason);

export const reasonRoutes = router;
