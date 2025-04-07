import express from 'express';
import { openaiController } from '../../controllers/openai.controller';
const router = express.Router();

router.route('/').post(openaiController.promptAI);

export const openaiRoutes = router;
