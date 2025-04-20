import express, { Router } from 'express';
import { loginUser } from '../controllers/authController';
import { asyncHandler } from '../middleware/asyncHandler';

const router: Router = express.Router();

router.post('/login', asyncHandler(loginUser));

export default router;