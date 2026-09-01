import express from 'express';
import mongoose from 'mongoose';
import { Booking } from '../models/booking.model.js';
import { sendSuccess, sendError } from '../utils/response.util.js';

const router = express.Router();

let inMemoryBookings = [
  {
    _id: 'bk-001',
    id: 'bk-001',
    propertyId: 'prop-001',
    propertyTitle: 'The Peak Luxury Riverview Penthouse',
    tenantName: 'Sophie Taylor',
    date: 'Tomorrow',
    timeSlot: '2:30 PM - 3:15 PM',
    type: 'In-Person Tour',
    status: 'Confirmed',
    landlordName: 'Alexander Sterling'
  }
];

// GET /api/bookings
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const bookings = await Booking.find().sort({ createdAt: -1 });
      if (bookings.length > 0) {
        return sendSuccess(res, 'Bookings retrieved successfully', bookings);
      }
    }
    return sendSuccess(res, 'Bookings retrieved', inMemoryBookings);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
});

// POST /api/bookings
router.post('/', async (req, res) => {
  try {
    const payload = {
      propertyId: req.body.propertyId || 'prop-default',
      propertyTitle: req.body.propertyTitle || 'Luxury Rental Property',
      tenantName: req.body.tenantName || 'Tenant Applicant',
      date: req.body.date || 'Tomorrow',
      timeSlot: req.body.timeSlot || '2:00 PM',
      type: req.body.type || 'In-Person Tour',
      status: req.body.status || 'Confirmed'
    };

    let savedBooking = { _id: `bk-${Date.now()}`, id: `bk-${Date.now()}`, ...payload };

    if (mongoose.connection.readyState === 1) {
      const booking = new Booking(payload);
      savedBooking = await booking.save();
    } else {
      inMemoryBookings.unshift(savedBooking);
    }

    return sendSuccess(res, 'Viewing appointment confirmed successfully', savedBooking, 201);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
});

export default router;
