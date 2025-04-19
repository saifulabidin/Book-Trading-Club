import express from 'express';
import { createTrade, getUserTrades, updateTradeStatus, completeTrade } from '../controllers/tradeController';
import { protect } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';

const router = express.Router();

router.use(protect); // All trade routes require authentication

router.route('/')
  .get(asyncHandler(getUserTrades))
  .post(asyncHandler(createTrade));

router.route('/:id')
  .put(asyncHandler(updateTradeStatus));

router.route('/:id/complete')
  .put(asyncHandler(completeTrade));

export default router;