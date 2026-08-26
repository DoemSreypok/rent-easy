import express from 'express';
import { User } from '../models/user.model.js';

const router = express.Router();

// Register new user (Tenant or Owner)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, employment, annualIncome } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Name, email, and password are required'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'A user with this email address already exists'
      });
    }

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password, // In real prod with bcrypt, here clean stored for development
      role: role || 'tenant',
      phone: phone || '',
      employment: employment || '',
      annualIncome: annualIncome || '',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
    });

    res.status(201).json({
      status: 'success',
      message: 'Account created successfully',
      data: {
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone,
          avatar: newUser.avatar,
          employment: newUser.employment,
          annualIncome: newUser.annualIncome,
          creditScore: newUser.creditScore
        },
        token: `jwt_token_${newUser._id}_${Date.now()}`
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || user.password !== password) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Logged in successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
          employment: user.employment,
          annualIncome: user.annualIncome,
          creditScore: user.creditScore
        },
        token: `jwt_token_${user._id}_${Date.now()}`
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get current user profile
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ status: 'fail', message: 'Not authenticated' });
    }
    const tokenParts = authHeader.split('_');
    const userId = tokenParts[2];
    if (!userId) {
      return res.status(401).json({ status: 'fail', message: 'Invalid token' });
    }
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }
    res.status(200).json({ status: 'success', data: { user } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;
