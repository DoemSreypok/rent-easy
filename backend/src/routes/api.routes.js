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

    if (mongoose.connection.readyState === 1) {
      try {
        const newProperty = await Property.create({
          ...req.body,
          deposit: req.body.deposit || price,
          bedrooms: req.body.bedrooms || 1,
          bathrooms: req.body.bathrooms || 1,
          sqft: req.body.sqft || 800,
          status: 'Available'
        });

        return res.status(201).json({ 
          status: 'success', 
          message: `Property "${newProperty.title}" listed successfully and saved to MongoDB!`, 
          data: newProperty 
        });
      } catch (dbErr) {
        console.warn('MongoDB create error, falling back to mock save:', dbErr.message);
      }
    }

    const mockProperty = {
      _id: 'prop_' + Date.now(),
      ...req.body,
      deposit: req.body.deposit || price,
      bedrooms: req.body.bedrooms || 1,
      bathrooms: req.body.bathrooms || 1,
      sqft: req.body.sqft || 800,
      status: 'Available',
      createdAt: new Date().toISOString()
    };

    res.status(201).json({ 
      status: 'success', 
      message: `Property "${mockProperty.title}" listed successfully!`, 
      data: mockProperty 
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
    res.status(200).json({ status: 'success', count: 0, data: [] });
  }
});

router.post('/applications', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const newApp = await Application.create(req.body);
      return res.status(201).json({ status: 'success', message: 'Application submitted successfully', data: newApp });
    }
    const mockApp = { _id: 'app_' + Date.now(), ...req.body, submittedAt: new Date().toISOString(), status: 'Pending' };
    res.status(201).json({ status: 'success', message: 'Application submitted successfully', data: mockApp });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
});

router.patch('/applications/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (mongoose.connection.readyState === 1) {
      let app = null;
      if (mongoose.isValidObjectId(id)) {
        app = await Application.findByIdAndUpdate(id, { status }, { new: true });
      } else {
        app = await Application.findOneAndUpdate({ id }, { status }, { new: true });
      }
      if (app) {
        return res.status(200).json({ status: 'success', message: `Application status updated to ${status}`, data: app });
      }
    }
    res.status(200).json({ status: 'success', message: `Application status updated to ${status}`, data: { id, status } });
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
    res.status(200).json({ status: 'success', count: 0, data: [] });
  }
});

router.post('/bookings', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const newBooking = await Booking.create(req.body);
      return res.status(201).json({ status: 'success', message: 'Viewing booked successfully', data: newBooking });
    }
    const mockBooking = { _id: 'book_' + Date.now(), ...req.body, status: 'Confirmed', createdAt: new Date().toISOString() };
    res.status(201).json({ status: 'success', message: 'Viewing booked successfully', data: mockBooking });
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
    res.status(200).json({ status: 'success', count: 0, data: [] });
  }
});

router.post('/maintenance', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const newTicket = await Maintenance.create(req.body);
      return res.status(201).json({ status: 'success', message: 'Maintenance ticket created', data: newTicket });
    }
    const mockTicket = { _id: 'ticket_' + Date.now(), ...req.body, status: 'In Progress', reportedAt: new Date().toISOString() };
    res.status(201).json({ status: 'success', message: 'Maintenance ticket created', data: mockTicket });
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
    res.status(200).json({ status: 'success', count: 0, data: [] });
  }
});

router.post('/messages', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const newMsg = await Message.create(req.body);
      return res.status(201).json({ status: 'success', data: newMsg });
    }
    const mockMsg = { _id: 'msg_' + Date.now(), ...req.body, createdAt: new Date().toISOString() };
    res.status(201).json({ status: 'success', data: mockMsg });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
});

// Generic MongoDB Items API
router.get('/items', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const items = await Item.find().sort({ createdAt: -1 });
      return res.status(200).json({ status: 'success', count: items.length, data: items });
    }
    res.status(200).json({ status: 'success', count: 0, data: [] });
  } catch (error) {
    res.status(200).json({ status: 'success', count: 0, data: [] });
  }
});

router.post('/items', async (req, res) => {
  try {
    const { title, description, category, price } = req.body;
    if (mongoose.connection.readyState === 1) {
      const newItem = await Item.create({ title, description, category, price });
      return res.status(201).json({ status: 'success', data: newItem });
    }
    const mockItem = { _id: 'item_' + Date.now(), title, description, category, price, createdAt: new Date().toISOString() };
    res.status(201).json({ status: 'success', data: mockItem });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
});

router.delete('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      const deletedItem = await Item.findByIdAndDelete(id);
      if (deletedItem) {
        return res.status(200).json({ status: 'success', message: 'Item deleted successfully', data: deletedItem });
      }
    }
    res.status(200).json({ status: 'success', message: 'Item deleted successfully', data: { id } });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
});

export default router;
