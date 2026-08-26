import express from 'express';
import mongoose from 'mongoose';
import { User } from '../models/user.model.js';

const router = express.Router();

// In-memory fallback user registry for offline development
const memoryUsers = new Map();

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

    const cleanEmail = email.toLowerCase().trim();

    // 1. If MongoDB is connected, use MongoDB
    if (mongoose.connection.readyState === 1) {
      try {
        const existingUser = await User.findOne({ email: cleanEmail });
        if (existingUser) {
          return res.status(400).json({
            status: 'fail',
            message: 'A user with this email address already exists'
          });
        }

        const newUser = await User.create({
          name,
          email: cleanEmail,
          password,
          role: role || 'tenant',
          phone: phone || '',
          employment: employment || '',
          annualIncome: annualIncome || '',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
        });

        return res.status(201).json({
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
      } catch (dbErr) {
        console.warn('MongoDB error during registration, falling back to memory store:', dbErr.message);
      }
    }

    // 2. In-memory registration fallback (prevents ECONNREFUSED)
    if (memoryUsers.has(cleanEmail)) {
      return res.status(400).json({
        status: 'fail',
        message: 'A user with this email address already exists'
      });
    }

    const mockId = 'usr_' + Date.now();
    const newUserObj = {
      id: mockId,
      name,
      email: cleanEmail,
      password,
      role: role || 'tenant',
      phone: phone || '',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      employment: employment || '',
      annualIncome: annualIncome || '',
      creditScore: 750
    };
    memoryUsers.set(cleanEmail, newUserObj);

    res.status(201).json({
      status: 'success',
      message: 'Account created successfully (Memory Store)',
      data: {
        user: { ...newUserObj },
        token: `jwt_token_${mockId}_${Date.now()}`
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Login user (Instant execution)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. If MongoDB is connected, query MongoDB
    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findOne({ email: cleanEmail });
        if (user && user.password === password) {
          return res.status(200).json({
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
        }
      } catch (dbErr) {
        console.warn('MongoDB query error, falling back to instant auth check:', dbErr.message);
      }
    }

    // 2. Demo User Instant Authentication
    if (cleanEmail === 'pinky@renteasy.com' && password === 'password123') {
      return res.status(200).json({
        status: 'success',
        message: 'Logged in successfully as Sophie Taylor',
        data: {
          user: {
            id: '67b3c220f123456789abcdef',
            name: 'Sophie Taylor',
            email: 'pinky@renteasy.com',
            role: 'tenant',
            phone: '+855 12 890 123',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            employment: 'Senior Software Architect',
            annualIncome: '$95,000 / yr',
            creditScore: 785
          },
          token: `jwt_token_demo_tenant_${Date.now()}`
        }
      });
    }

    if (cleanEmail === 'lyden@renteasy.com' && password === 'password123') {
      return res.status(200).json({
        status: 'success',
        message: 'Logged in successfully as Alexander Sterling',
        data: {
          user: {
            id: '67b3c220f123456789abcde0',
            name: 'Alexander Sterling',
            email: 'lyden@renteasy.com',
            role: 'owner',
            phone: '+855 23 456 789',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
            employment: 'Real Estate Developer & Landlord',
            annualIncome: '$280,000 / yr',
            creditScore: 820
          },
          token: `jwt_token_demo_owner_${Date.now()}`
        }
      });
    }

    return res.status(401).json({
      status: 'fail',
      message: 'Invalid email or password'
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
