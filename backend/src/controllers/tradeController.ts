import { Request, Response } from 'express';
import { Trade } from '../models/Trade';
import { Book } from '../models/Book';

// @desc    Create a new trade request
// @route   POST /api/trades
// @access  Private
export const createTrade = async (req: Request, res: Response) => {
  try {
    const { bookOffered, bookRequested, message } = req.body;
    const requestedBook = await Book.findById(bookRequested);

    if (!requestedBook) {
      return res.status(404).json({ message: 'Requested book not found' });
    }

    const trade = await Trade.create({
      initiator: req.user._id,
      receiver: requestedBook.owner,
      bookOffered,
      bookRequested,
      message,
      isSeen: false // New trade is initially unseen by the receiver
    });

    await trade.populate([
      { path: 'bookOffered', select: 'title author' },
      { path: 'bookRequested', select: 'title author' },
      { path: 'initiator', select: 'username' },
      { path: 'receiver', select: 'username' }
    ]);

    res.status(201).json(trade);
  } catch (error) {
    res.status(500).json({ message: 'Error creating trade request' });
  }
};

// @desc    Get user's trades (both initiated and received)
// @route   GET /api/trades
// @access  Private
export const getUserTrades = async (req: Request, res: Response) => {
  try {
    const trades = await Trade.find({
      $or: [
        { initiator: req.user._id },
        { receiver: req.user._id }
      ]
    }).populate([
      { path: 'bookOffered', select: 'title author' },
      { path: 'bookRequested', select: 'title author' },
      { path: 'initiator', select: 'username' },
      { path: 'receiver', select: 'username' }
    ]).sort('-createdAt');

    res.json(trades);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trades' });
  }
};

// @desc    Mark all user's received trades as seen
// @route   PUT /api/trades/mark-seen
// @access  Private
export const markTradesAsSeen = async (req: Request, res: Response) => {
  try {
    await Trade.updateMany(
      { 
        receiver: req.user._id,
        isSeen: false
      }, 
      { isSeen: true }
    );

    res.json({ message: 'Trades marked as seen successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking trades as seen' });
  }
};

// @desc    Update trade status
// @route   PUT /api/trades/:id
// @access  Private
export const updateTradeStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const trade = await Trade.findById(req.params.id);

    if (!trade) {
      return res.status(404).json({ message: 'Trade not found' });
    }

    if (trade.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this trade' });
    }

    if (status === 'accepted') {
      // Update books availability
      await Promise.all([
        Book.findByIdAndUpdate(trade.bookOffered, { isAvailable: false }),
        Book.findByIdAndUpdate(trade.bookRequested, { isAvailable: false })
      ]);
    }

    trade.status = status;
    trade.isSeen = true; // Mark as seen when status is updated
    await trade.save();

    await trade.populate([
      { path: 'bookOffered', select: 'title author' },
      { path: 'bookRequested', select: 'title author' },
      { path: 'initiator', select: 'username' },
      { path: 'receiver', select: 'username' }
    ]);

    res.json(trade);
  } catch (error) {
    res.status(500).json({ message: 'Error updating trade status' });
  }
};

// @desc    Complete a trade
// @route   PUT /api/trades/:id/complete
// @access  Private
export const completeTrade = async (req: Request, res: Response) => {
  try {
    const trade = await Trade.findById(req.params.id);

    if (!trade) {
      return res.status(404).json({ message: 'Trade not found' });
    }

    if (![trade.initiator.toString(), trade.receiver.toString()].includes(req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized to complete this trade' });
    }

    if (trade.status !== 'accepted') {
      return res.status(400).json({ message: 'Trade must be accepted before completion' });
    }

    trade.status = 'completed';
    await trade.save();

    // Swap book ownership
    await Promise.all([
      Book.findByIdAndUpdate(trade.bookOffered, { 
        owner: trade.receiver,
        isAvailable: true
      }),
      Book.findByIdAndUpdate(trade.bookRequested, { 
        owner: trade.initiator,
        isAvailable: true
      })
    ]);

    res.json({ message: 'Trade completed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error completing trade' });
  }
};