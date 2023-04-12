import express from 'express';
import { queryPinecone, deleteItem, uploadNote } from '../controllers/pineController.js';

const router = express.Router();

router.route('/').post(queryPinecone);
router.route('/:id').delete(deleteItem);
router.route('/upload').post(uploadNote);

export default router;
