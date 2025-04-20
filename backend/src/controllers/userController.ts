import { Request, Response } from 'express';
import { User } from '../models/User';
import { Book } from '../models/Book';

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
export const getCurrentUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('books');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    if (req.body.username) user.username = req.body.username;
    if (req.body.fullName) user.fullName = req.body.fullName;
    if (req.body.location) user.location = req.body.location;
    
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      fullName: updatedUser.fullName,
      location: updatedUser.location,
      createdAt: updatedUser.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user profile' });
  }
};

// @desc    Get books by username
// @route   GET /api/users/:username/books
// @access  Public
export const getUserBooks = async (req: Request, res: Response) => {
  try {
    // Find the user by username
    const user = await User.findOne({ username: req.params.username });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Find all books owned by this user
    const books = await Book.find({ owner: user._id })
      .sort('-createdAt');
    
    res.json({
      user: {
        _id: user._id,
        username: user.username,
        location: user.location
      },
      books
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user books' });
  }
};