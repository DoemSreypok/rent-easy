import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import propertyRoutes from './property.routes.js';
import roomRoutes from './room.routes.js';
import rentalRequestRoutes from './rentalRequest.routes.js';
import applicationRoutes from './application.routes.js';
import bookingRoutes from './booking.routes.js';
import messageRoutes from './message.routes.js';
import contractRoutes from './contract.routes.js';
import paymentRoutes from './payment.routes.js';
import maintenanceRoutes from './maintenance.routes.js';
import notificationRoutes from './notification.routes.js';
import adminRoutes from './admin.routes.js';
import flowchartRoutes from './flowchart.routes.js';
import { seedDatabase } from '../scripts/seed.js';
import { Item } from '../models/item.model.js';

const router = express.Router();

// Mount Feature Routers
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/properties', propertyRoutes);
router.use('/rooms', roomRoutes);
router.use('/rental-requests', rentalRequestRoutes);
router.use('/applications', applicationRoutes);
router.use('/bookings', bookingRoutes);
router.use('/messages', messageRoutes);
router.use('/contracts', contractRoutes);
router.use('/payments', paymentRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);
router.use('/flowchart', flowchartRoutes);

// Health Check Endpoint
router.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'success',
    success: true,
    message: 'RentEasy Multi-Role API is running on Port 5001',
    database: dbStatus,
    timestamp: new Date().toISOString(),
    roles: ['ADMIN', 'LANDLORD', 'TENANT'],
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      properties: '/api/properties',
      rooms: '/api/rooms',
      rentalRequests: '/api/rental-requests',
      contracts: '/api/contracts',
      payments: '/api/payments',
      maintenance: '/api/maintenance',
      notifications: '/api/notifications',
      admin: '/api/admin',
      seed: '/api/seed'
    }
  });
});

// Database Seed Endpoint
router.post('/seed', async (req, res) => {
  try {
    const result = await seedDatabase();
    res.status(200).json({
      status: 'success',
      success: true,
      message: 'MongoDB database successfully seeded with multi-role accounts, properties, rooms, requests, contracts, payments & maintenance!',
      data: result
    });
  } catch (error) {
    res.status(500).json({ status: 'error', success: false, message: error.message });
  }
});

// Generic Test Items (For DB status checks)
router.get('/items', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const items = await Item.find().sort({ createdAt: -1 });
      return res.status(200).json({ status: 'success', success: true, count: items.length, data: items });
    }
    res.status(200).json({ status: 'success', success: true, count: 0, data: [] });
  } catch (error) {
    res.status(500).json({ status: 'error', success: false, message: error.message });
  }
});

router.post('/items', async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();
    res.status(201).json({ status: 'success', success: true, data: item });
  } catch (error) {
    res.status(400).json({ status: 'error', success: false, message: error.message });
  }
});

router.delete('/items/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: 'success', success: true, data: item });
  } catch (error) {
    res.status(400).json({ status: 'error', success: false, message: error.message });
  }
});

export default router;
