import express from 'express';
import mongoose from 'mongoose';
import { User } from '../models/user.model.js';
import { Item } from '../models/item.model.js';
import { Property } from '../models/property.model.js';
import { Application } from '../models/application.model.js';
import { Booking } from '../models/booking.model.js';
import { Maintenance } from '../models/maintenance.model.js';
import { Message } from '../models/message.model.js';
import { seedDatabase } from '../scripts/seed.js';
import flowchartRoutes from './flowchart.routes.js';
import authRoutes from './auth.routes.js';

const router = express.Router();

// Mount Authentication & Flowchart APIs
router.use('/auth', authRoutes);
router.use('/flowchart', flowchartRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'success',
    message: 'RentEasy API is running smoothly on Port 5001',
    database: dbStatus,
    timestamp: new Date().toISOString(),
    endpoints: {
      seed: 'POST /api/seed',
      authRegister: 'POST /api/auth/register',
      authLogin: 'POST /api/auth/login',
      users: 'GET /api/users',
      properties: 'GET /api/properties',
      applications: 'GET /api/applications',
      bookings: 'GET /api/bookings',
      maintenance: 'GET /api/maintenance',
      messages: 'GET /api/messages'
    }
  });
});

// Users List Endpoint (from MongoDB User Collection)
router.get('/users', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      return res.status(200).json({
        status: 'success',
        count: users.length,
        data: users
      });
    }
    res.status(200).json({ status: 'success', count: 0, data: [] });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Delete user endpoint
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ status: 'success', message: 'User deleted from database' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Seed MongoDB Endpoint
router.post('/seed', async (req, res) => {
  try {
    const result = await seedDatabase();
    res.status(200).json({
      status: 'success',
      message: 'MongoDB RentEasy database seeded successfully!',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Properties API
router.get('/properties', async (req, res) => {
  try {
    const { search, type, maxPrice } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }
    if (type && type !== 'All') {
      query.type = type;
    }
    if (maxPrice) {
      query.price = { $lte: Number(maxPrice) };
    }

    // Try MongoDB query first
    if (mongoose.connection.readyState === 1) {
      const properties = await Property.find(query).sort({ featured: -1, createdAt: -1 });
      if (properties.length > 0) {
        return res.status(200).json({ status: 'success', count: properties.length, data: properties });
      }
    }

    // Fallback if empty
    res.status(200).json({ status: 'success', count: 0, data: [] });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let property = null;
    if (mongoose.connection.readyState === 1) {
      if (mongoose.isValidObjectId(id)) {
        property = await Property.findById(id);
      } else {
        property = await Property.findOne({ $or: [{ _id: id }, { id: id }] });
      }
    }
    if (!property) {
      return res.status(404).json({ status: 'fail', message: 'Property not found' });
    }
    res.status(200).json({ status: 'success', data: property });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post('/properties', async (req, res) => {
  try {
    const { title, type, location, price, image } = req.body;
    
    if (!title || !title.trim()) {
      return res.status(400).json({ status: 'fail', message: 'Property title is required.' });
    }
    if (!location || !location.trim()) {
      return res.status(400).json({ status: 'fail', message: 'Property location is required.' });
    }
    if (!price || Number(price) <= 0) {
      return res.status(400).json({ status: 'fail', message: 'A valid monthly rent price is required.' });
    }
    if (!image) {
      return res.status(400).json({ status: 'fail', message: 'Property photo is required.' });
    }

    const newProperty = await Property.create({
      ...req.body,
      deposit: req.body.deposit || price,
      bedrooms: req.body.bedrooms || 1,
      bathrooms: req.body.bathrooms || 1,
      sqft: req.body.sqft || 800,
      status: 'Available'
    });

    res.status(201).json({ 
      status: 'success', 
      message: `Property "${newProperty.title}" listed successfully and saved to MongoDB!`, 
      data: newProperty 
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
});

// Applications API
router.get('/applications', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const apps = await Application.find().sort({ submittedAt: -1 });
      return res.status(200).json({ status: 'success', count: apps.length, data: apps });
    }
    res.status(200).json({ status: 'success', count: 0, data: [] });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post('/applications', async (req, res) => {
  try {
    const newApp = await Application.create(req.body);
    res.status(201).json({ status: 'success', message: 'Application submitted successfully', data: newApp });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
});

router.patch('/applications/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    let app = null;
    if (mongoose.isValidObjectId(id)) {
      app = await Application.findByIdAndUpdate(id, { status }, { new: true });
    } else {
      app = await Application.findOneAndUpdate({ id }, { status }, { new: true });
    }
    if (!app) {
      return res.status(404).json({ status: 'fail', message: 'Application not found' });
    }
    res.status(200).json({ status: 'success', message: `Application status updated to ${status}`, data: app });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
});

// Bookings API
router.get('/bookings', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const bookings = await Booking.find().sort({ createdAt: -1 });
      return res.status(200).json({ status: 'success', count: bookings.length, data: bookings });
    }
    res.status(200).json({ status: 'success', count: 0, data: [] });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post('/bookings', async (req, res) => {
  try {
    const newBooking = await Booking.create(req.body);
    res.status(201).json({ status: 'success', message: 'Viewing booked successfully', data: newBooking });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
});

// Maintenance API
router.get('/maintenance', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const tickets = await Maintenance.find().sort({ reportedAt: -1 });
      return res.status(200).json({ status: 'success', count: tickets.length, data: tickets });
    }
    res.status(200).json({ status: 'success', count: 0, data: [] });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post('/maintenance', async (req, res) => {
  try {
    const newTicket = await Maintenance.create(req.body);
    res.status(201).json({ status: 'success', message: 'Maintenance ticket created', data: newTicket });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
});

// Messages API
router.get('/messages', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const messages = await Message.find().sort({ createdAt: 1 });
      return res.status(200).json({ status: 'success', count: messages.length, data: messages });
    }
    res.status(200).json({ status: 'success', count: 0, data: [] });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post('/messages', async (req, res) => {
  try {
    const newMsg = await Message.create(req.body);
    res.status(201).json({ status: 'success', data: newMsg });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
});

// Generic MongoDB Items API
router.get('/items', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post('/items', async (req, res) => {
  try {
    const { title, description, category, price } = req.body;
    const newItem = await Item.create({ title, description, category, price });
    res.status(201).json({ status: 'success', data: newItem });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
});

router.delete('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Item.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ status: 'fail', message: 'Item not found' });
    }
    res.status(200).json({ status: 'success', message: 'Item deleted successfully', data: deletedItem });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
});

export default router;
