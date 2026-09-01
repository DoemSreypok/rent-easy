import express from 'express';
import mongoose from 'mongoose';
import { Message } from '../models/message.model.js';
import { sendSuccess, sendError } from '../utils/response.util.js';

const router = express.Router();

let inMemoryMessages = [
  {
    _id: 'msg-001',
    id: 'msg-001',
    sender: 'Alexander Sterling (Landlord)',
    role: 'owner',
    text: 'Hello Sophie! The 3-bedroom unit is available for viewings tomorrow afternoon. Would 2:30 PM work for you?',
    timestamp: '10:15 AM'
  },
  {
    _id: 'msg-002',
    id: 'msg-002',
    sender: 'Sophie Taylor (Tenant)',
    role: 'tenant',
    text: 'Yes, 2:30 PM is perfect. Looking forward to touring the penthouse!',
    timestamp: '10:20 AM'
  }
];

// GET /api/messages
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const messages = await Message.find().sort({ createdAt: 1 });
      if (messages.length > 0) {
        return sendSuccess(res, 'Messages retrieved successfully', messages);
      }
    }
    return sendSuccess(res, 'Messages retrieved', inMemoryMessages);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
});

// POST /api/messages
router.post('/', async (req, res) => {
  try {
    const payload = {
      sender: req.body.sender || 'User',
      role: req.body.role || 'tenant',
      text: req.body.text || '',
      timestamp: req.body.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    let savedMsg = { _id: `msg-${Date.now()}`, id: `msg-${Date.now()}`, ...payload };

    if (mongoose.connection.readyState === 1) {
      const message = new Message(payload);
      savedMsg = await message.save();
    } else {
      inMemoryMessages.push(savedMsg);
    }

    return sendSuccess(res, 'Message sent successfully', savedMsg, 201);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
});

export default router;
