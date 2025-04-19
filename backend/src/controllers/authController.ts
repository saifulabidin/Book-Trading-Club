import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateToken } from '../utils/generateToken';
import { auth } from '../config/firebase';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, location, fullName } = req.body;

    const userExists = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (userExists) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    const user = await User.create({
      username,
      email,
      password,
      location,
      fullName
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      location: user.location,
      fullName: user.fullName,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error during registration' 
    });
  }
};

// @desc    Login user with GitHub
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { token, email, displayName, photoURL } = req.body;

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify the Firebase token
    const decodedToken = await auth.verifyIdToken(token);
    
    // Find user by GitHub ID or email
    let user = await User.findOne({
      $or: [
        { githubId: decodedToken.uid },
        { email: decodedToken.email || email }
      ]
    });

    if (!user) {
      // Generate a unique username from email
      const baseUsername = (decodedToken.email || email)?.split('@')[0] || 'user';
      let username = baseUsername;
      let counter = 1;
      
      while (await User.findOne({ username })) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      // Create new user
      user = await User.create({
        email: decodedToken.email || email,
        username,
        fullName: displayName || 'GitHub User',
        githubPhotoUrl: photoURL,
        githubId: decodedToken.uid
      });
    } else {
      // Update existing user's GitHub info if needed
      if (!user.githubId || !user.githubPhotoUrl || !user.fullName) {
        user.githubId = decodedToken.uid;
        user.githubPhotoUrl = photoURL || user.githubPhotoUrl;
        user.fullName = displayName || user.fullName || 'GitHub User';
        await user.save();
      }
    }

    // Generate JWT token
    const jwtToken = generateToken(user._id);

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      location: user.location,
      githubPhotoUrl: user.githubPhotoUrl,
      token: jwtToken
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ 
      message: 'Invalid or expired token'
    });
  }
};