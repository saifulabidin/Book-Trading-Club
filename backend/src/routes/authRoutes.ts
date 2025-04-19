import express, { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import { asyncHandler } from '../middleware/asyncHandler';

const router: Router = express.Router();

router.post('/register', asyncHandler(registerUser));
router.post('/login', asyncHandler(loginUser));

export default router;