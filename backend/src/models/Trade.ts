import mongoose from 'mongoose';

export interface ITrade {
  initiator: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  bookOffered: mongoose.Types.ObjectId;
  bookRequested: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  message?: string;
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
  }
}, {
  timestamps: true
});

// Ensure books are available before creating a trade
tradeSchema.pre('save', async function(next) {
  if (this.isNew) {
    const Book = mongoose.model('Book');
    
    try {
      const [offeredBook, requestedBook] = await Promise.all([
        Book.findById(this.bookOffered),
        Book.findById(this.bookRequested)
      ]);

      if (!offeredBook?.isAvailable || !requestedBook?.isAvailable) {
        throw new Error('One or both books are not available for trade');
      }
      
      next();
    } catch (error) {
      next(error as Error);
    }
  } else {
    next();
  }
});

export const Trade = mongoose.model<ITrade>('Trade', tradeSchema);