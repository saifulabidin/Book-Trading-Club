import mongoose from 'mongoose';

export interface IBook {
  title: string;
  author: string;
  description: string;
  condition: 'New' | 'Like New' | 'Very Good' | 'Good' | 'Fair' | 'Poor';
  owner: mongoose.Types.ObjectId;
  isAvailable: boolean;
  image?: string;
  isbn?: string;
  genre?: string[];
  publishedYear?: number;
}

const bookSchema = new mongoose.Schema<IBook>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  condition: {
    type: String,
    required: true,
    enum: ['New', 'Like New', 'Very Good', 'Good', 'Fair', 'Poor']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  image: {
    type: String
  },
  isbn: {
    type: String,
    trim: true
  },
  genre: [{
    type: String,
    trim: true
  }],
  publishedYear: {
    type: Number
  }
}, {
  timestamps: true
});

export const Book = mongoose.model<IBook>('Book', bookSchema);