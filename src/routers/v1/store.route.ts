import express from 'express';
import { storeController } from '../../controllers/store.controller';
const router = express.Router();

router.route('/').get(storeController.findAll);
router.route('/').post(storeController.addStore);

export const storeRoutes = router;
