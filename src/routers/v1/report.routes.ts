import express from 'express';
import { reportController } from '../../controllers/report.controller';
import { reportValidation } from '../../validations/report.validation';
const router = express.Router();

router.route('/').get(reportController.findAll);
router.route('/').post(reportValidation, reportController.addReport);

export const reportRoutes = router;
