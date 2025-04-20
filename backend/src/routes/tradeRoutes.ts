import express from 'express';
import { 
  createTrade, 
  getUserTrades, 
  updateTradeStatus, 
  completeTrade, 
  markTradesAsSeen 
} from '../controllers/tradeController';
import { protect } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';

/**
 * Trade routes handler
 * Manages all endpoints related to book trades
 */
const router = express.Router();

// Apply authentication middleware to all trade routes
router.use(protect);

/**
 * Base trade routes
 * GET: Fetch all trades for current user
 * POST: Create a new trade request
 */
router.route('/')
  .get(asyncHandler(getUserTrades))
  .post(asyncHandler(createTrade));

/**
 * Mark trades as seen route
 * PUT: Update all unseen trades as seen for the current user
 */
router.route('/mark-seen')
  .put(asyncHandler(markTradesAsSeen));

/**
 * Trade management routes
 * PUT /:id - Update status of a specific trade (accept/reject)
 */
router.route('/:id')
  .put(asyncHandler(updateTradeStatus));

/**
 * Trade completion route
 * PUT /:id/complete - Complete an accepted trade and transfer ownership
 */
router.route('/:id/complete')
  .put(asyncHandler(completeTrade));

export default router;