import express, { Router } from 'express';
import { getCurrentUserProfile, updateUserProfile, getUserBooks } from '../controllers/userController';
import { protect } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';

const router: Router = express.Router();

// Public routes
router.get('/:username/books', asyncHandler(getUserBooks));

// Protected routes - require authentication
router.use(protect);
router.get('/profile', asyncHandler(getCurrentUserProfile));
router.put('/profile', asyncHandler(updateUserProfile));

export default router;