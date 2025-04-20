import mongoose from 'mongoose';

export interface IUser {
  username: string;
  email: string;
  location?: string;
  fullName?: string;
  books: mongoose.Types.ObjectId[];
  githubId?: string;
  githubPhotoUrl?: string;
}

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  location: {
    type: String,
    trim: true
  },
  fullName: {
    type: String,
    trim: true
  },
  githubId: {
    type: String,
    unique: true,
    sparse: true
  },
  githubPhotoUrl: String,
  books: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  }]
}, {
  timestamps: true
});

export const User = mongoose.model<IUser>('User', userSchema);