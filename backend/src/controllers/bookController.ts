import { Request, Response } from 'express';
import { Book } from '../models/Book';
import { User } from '../models/User';

// @desc    Get all available books
// @route   GET /api/books
// @access  Public
export const getBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const books = await Book.find({ isAvailable: true })
      .populate('owner', 'username location')
      .sort('-createdAt');
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books' });
  }
};

// @desc    Get a single book
// @route   GET /api/books/:id
// @access  Public
export const getBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('owner', 'username location');
    
    if (!book) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }
    
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book' });
  }
};

// @desc    Create a new book
// @route   POST /api/books
// @access  Private
export const createBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const book = await Book.create({
      ...req.body,
      owner: req.user._id
    });

    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { books: book._id } }
    );

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error creating book' });
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private
export const updateBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }

    if (book.owner.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: 'Not authorized to update this book' });
      return;
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: 'Error updating book' });
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this book' });
    }

    await Book.findByIdAndDelete(req.params.id);
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { books: req.params.id } }
    );

    res.json({ message: 'Book removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting book' });
  }
};