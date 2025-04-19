import express from 'express';
import { getBooks, getBook, createBook, updateBook, deleteBook } from '../controllers/bookController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.route('/')
  .get(getBooks)
  .post(protect, createBook);

router.route('/:id')
  .get(getBook)
  .put(protect, updateBook)
  .delete(protect, deleteBook);

export default router;