import { User } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user: User;  // Set a proper type instead of any
    }
  }
}
