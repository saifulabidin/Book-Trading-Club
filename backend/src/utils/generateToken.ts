import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export const generateToken = (userId: string | Types.ObjectId): string => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET as string,
    { expiresIn: '30d' }
  );
};