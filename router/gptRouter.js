import express from 'express';
import { sendQuestion, summarize } from '../controllers/gptController.js';

const router = express.Router();

router.route('/').post(sendQuestion);
router.route('/summary').post(summarize);

export default router;
