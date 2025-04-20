import { Request, Response } from 'express';
import { Trade } from '../models/Trade';
import { Book } from '../models/Book';

/**
 * Standard fields to populate in trade queries
 */
const TRADE_POPULATION_FIELDS = [
  { path: 'bookOffered', select: 'title author' },
  { path: 'bookRequested', select: 'title author' },
  { path: 'initiator', select: 'username' },
  { path: 'receiver', select: 'username' }
];

/**
 * @desc    Create a new trade request between users
 * @route   POST /api/trades
 * @access  Private
 */
export const createTrade = async (req: Request, res: Response) => {
  try {
    const { bookOffered, bookRequested, message } = req.body;
    
    // Input validation
    if (!bookOffered || !bookRequested) {
      return res.status(400).json({ 
        message: 'Both bookOffered and bookRequested are required'
      });
    }

    // Find the requested book to get its owner
    const requestedBook = await Book.findById(bookRequested);
    if (!requestedBook) {
      return res.status(404).json({ message: 'Requested book not found' });
    }

    // Create the trade document
    const newTrade = await Trade.create({
      initiator: req.user._id,
      receiver: requestedBook.owner,
      bookOffered,
      bookRequested,
      message,
      isSeen: false
    });

    // Populate trade with related data
    await newTrade.populate(TRADE_POPULATION_FIELDS);

    res.status(201).json(newTrade);
  } catch (error: any) {
    const statusCode = error.name === 'ValidationError' ? 400 : 500;
    res.status(statusCode).json({ 
      message: error.message || 'Error creating trade request'
    });
  }
};

/**
 * @desc    Get all trades for the current user (both initiated and received)
 * @route   GET /api/trades
 * @access  Private
 */
export const getUserTrades = async (req: Request, res: Response) => {
  try {
    const userTrades = await Trade.find({
      $or: [
        { initiator: req.user._id },
        { receiver: req.user._id }
      ]
    })
    .populate(TRADE_POPULATION_FIELDS)
    .sort('-createdAt');

    res.json(userTrades);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching trades' });
  }
};

/**
 * @desc    Mark all trades received by current user as seen
 * @route   PUT /api/trades/mark-seen
 * @access  Private
 */
export const markTradesAsSeen = async (req: Request, res: Response) => {
  try {
    const result = await Trade.updateMany(
      { 
        receiver: req.user._id,
        isSeen: false
      }, 
      { isSeen: true }
    );

    res.json({ 
      message: 'Trades marked as seen successfully',
      updatedCount: result.modifiedCount
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error marking trades as seen' });
  }
};

/**
 * @desc    Update the status of a trade (accept or reject)
 * @route   PUT /api/trades/:id
 * @access  Private
 */
export const updateTradeStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate the requested status
    const validStatuses = ['accepted', 'rejected', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    const trade = await Trade.findById(id);

    // Validate trade exists
    if (!trade) {
      return res.status(404).json({ message: 'Trade not found' });
    }

    // Validate user is authorized to update this trade
    if (trade.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this trade' });
    }

    // If accepting the trade, update book availability
    if (status === 'accepted') {
      await Promise.all([
        Book.findByIdAndUpdate(trade.bookOffered, { isAvailable: false }),
        Book.findByIdAndUpdate(trade.bookRequested, { isAvailable: false })
      ]);
    }

    // Update trade status and mark as seen
    trade.status = status;
    trade.isSeen = true;
    await trade.save();

    // Return the updated trade with populated fields
    await trade.populate(TRADE_POPULATION_FIELDS);

    res.json(trade);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error updating trade status' });
  }
};

/**
 * @desc    Complete an accepted trade and transfer book ownership
 * @route   PUT /api/trades/:id/complete
 * @access  Private
 */
export const completeTrade = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const trade = await Trade.findById(id);

    // Validate trade exists
    if (!trade) {
      return res.status(404).json({ message: 'Trade not found' });
    }

    // Verify user is part of this trade
    const isTradeParticipant = [
      trade.initiator.toString(), 
      trade.receiver.toString()
    ].includes(req.user._id.toString());
    
    if (!isTradeParticipant) {
      return res.status(403).json({ message: 'Not authorized to complete this trade' });
    }

    // Trade must be in accepted status
    if (trade.status !== 'accepted') {
      return res.status(400).json({ message: 'Trade must be accepted before completion' });
    }

    // Update trade status to completed
    trade.status = 'completed';
    await trade.save();

    // Transfer book ownership
    await Promise.all([
      Book.findByIdAndUpdate(trade.bookOffered, { 
        owner: trade.receiver,
        isAvailable: true  // Book becomes available with new owner
      }),
      Book.findByIdAndUpdate(trade.bookRequested, { 
        owner: trade.initiator,
        isAvailable: true  // Book becomes available with new owner
      })
    ]);

    res.json({ 
      message: 'Trade completed successfully',
      tradeId: trade._id
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error completing trade' });
  }
};