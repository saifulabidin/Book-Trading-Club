import mongoose from 'mongoose';

/**
 * Trade status type definition
 */
export type TradeStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';

/**
 * Trade document interface
 * Represents a book trade between two users
 */
export interface ITrade {
  /** User who initiated the trade request */
  initiator: mongoose.Types.ObjectId;
  /** User who received the trade request */
  receiver: mongoose.Types.ObjectId;
  /** Book offered by the initiator */
  bookOffered: mongoose.Types.ObjectId;
  /** Book requested by the initiator */
  bookRequested: mongoose.Types.ObjectId;
  /** Current status of the trade */
  status: TradeStatus;
  /** Optional message from the initiator */
  message?: string;
  /** Whether the trade has been seen by the receiver */
  isSeen: boolean;
}

const tradeSchema = new mongoose.Schema<ITrade>({
  initiator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookOffered: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  bookRequested: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  message: {
    type: String,
    trim: true
  },
  isSeen: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

/**
 * Middleware to validate book availability before creating a new trade
 * Prevents trades involving unavailable books
 */
tradeSchema.pre('save', async function(next) {
  // Only run this validation for new trade documents
  if (!this.isNew) {
    return next();
  }
  
  try {
    const Book = mongoose.model('Book');
    
    // Fetch both books concurrently for better performance
    const [offeredBook, requestedBook] = await Promise.all([
      Book.findById(this.bookOffered),
      Book.findById(this.bookRequested)
    ]);

    // Validate that both books exist and are available
    if (!offeredBook || !requestedBook) {
      throw new Error('One or both books not found');
    }
    
    if (!offeredBook.isAvailable || !requestedBook.isAvailable) {
      throw new Error('One or both books are not available for trade');
    }
    
    next();
  } catch (error) {
    next(error as Error);
  }
});

export const Trade = mongoose.model<ITrade>('Trade', tradeSchema);