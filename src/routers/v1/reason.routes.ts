import express from 'express';
import { reasonController } from '../../controllers/reason.controller';
const router = express.Router();

router.route('/').get(reasonController.findAll);
router.route('/').post(reasonController.addReason);

export const reasonRoutes = router;
