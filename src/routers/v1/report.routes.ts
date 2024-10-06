import express from 'express';
import { reportController } from '../../controllers/report.controller';
const router = express.Router();

router.route('/').get(reportController.findAll);
router.route('/').post(reportController.addReport);

export const reportRoutes = router;
