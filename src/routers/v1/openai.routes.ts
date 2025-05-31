import express from 'express';
import { openaiController } from '../../controllers/openai.controller';
import { openaiValidation } from '../../validations/openai.validation';
const router = express.Router();

router.route('/').post(openaiValidation.promptAIValidation, openaiController.promptAI);
router
  .route('/check-violation')
  .post(openaiValidation.checkViolationValidation, openaiController.checkViolationRequest);
export const openaiRoutes = router;
