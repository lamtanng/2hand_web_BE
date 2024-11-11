import express from 'express';
import { storeController } from '../../../controllers/store.controller';
import { isAuthorized } from '../../../middlewares/auth.middleware';
import { STORE_BY_ID_ROUTE, STORE_BY_USER_ROUTE } from '../../../constants/routes';
import { storeValidation } from '../../../validations/store.validation';

const router = express.Router();

const { createStoreValidation } = storeValidation;
const { addStore, findAll, findOneById, findOneByUserId } = storeController;
router.route('/').get(findAll);
router.route('/').post(createStoreValidation, addStore);
router.route(STORE_BY_ID_ROUTE).get(findOneById);
router.route(STORE_BY_USER_ROUTE).get(findOneByUserId);

export const storeRoutes = router;
