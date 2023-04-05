import express from 'express';
import { queryPinecone, deleteItem } from '../controllers/pineController.js';

const router = express.Router();

router.route('/').post(queryPinecone);
router.route('/:id').delete(deleteItem);

export default router;
