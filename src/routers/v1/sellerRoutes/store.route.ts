import express from 'express';
import { storeController } from '../../../controllers/store.controller';
import { storeValidation } from '../../../validations/store.validation';
const router = express.Router();
const { addStore, findAll } = storeController;
router.route('/').get(storeController.findAll);
router.route('/').post(storeValidation, storeController.addStore);

export const storeRoutes = router;
