import express from 'express';
import { getBooks, getBook, createBook, updateBook, deleteBook } from '../controllers/bookController';
import { protect } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';

const router = express.Router();

router.route('/')
  .get(asyncHandler(getBooks))
  .post(protect, asyncHandler(createBook));

router.route('/:id')
  .get(asyncHandler(getBook))
  .put(protect, asyncHandler(updateBook))
  .delete(protect, asyncHandler(deleteBook));

export default router;