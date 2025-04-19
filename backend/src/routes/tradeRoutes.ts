import express from 'express';
import { createTrade, getUserTrades, updateTradeStatus, completeTrade } from '../controllers/tradeController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect); // All trade routes require authentication

router.route('/')
  .get(getUserTrades)
  .post(createTrade);

router.route('/:id')
  .put(updateTradeStatus);

router.route('/:id/complete')
  .put(completeTrade);

export default router;