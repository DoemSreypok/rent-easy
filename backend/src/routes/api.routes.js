import express from 'express';
import mongoose from 'mongoose';
import { Item } from '../models/item.model.js';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'success',
    message: 'Backend server is running smoothly!',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// GET all rental items
router.get('/items', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: 'success',
      count: items.length,
      data: items
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// POST a new rental item
router.post('/items', async (req, res) => {
  try {
    const { title, description, category, price } = req.body;
    const newItem = await Item.create({
      title,
      description,
      category,
      price
    });
    res.status(201).json({
      status: 'success',
      data: newItem
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
});

// DELETE a rental item by ID
router.delete('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Item.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({
        status: 'fail',
        message: 'Item not found'
      });
    }
    res.status(200).json({
      status: 'success',
      message: 'Item deleted successfully',
      data: deletedItem
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
});

export default router;
