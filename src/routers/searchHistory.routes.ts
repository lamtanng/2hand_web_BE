import express from 'express';
import { searchHistoryController } from '../controllers/searchHistory.controller';

const router = express.Router();

router.route('/').get(searchHistoryController.findAllByUserId);
router.route('/search').get(searchHistoryController.findBySearchText);
router.route('/trending').get(searchHistoryController.getTrendingRecommendations);
router.route('/init-data').post(searchHistoryController.initData);
router.route('/').post(searchHistoryController.create);

export const searchHistoryRouter = router;
