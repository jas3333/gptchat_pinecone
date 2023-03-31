import express from 'express';
import { queryPinecone } from '../controllers/pineController.js';

const router = express.Router();

router.route('/').post(queryPinecone);

export default router;
