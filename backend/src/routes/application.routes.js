import express from 'express';
import mongoose from 'mongoose';
import { Application } from '../models/application.model.js';
import { RentalRequest } from '../models/rentalRequest.model.js';
import { RentalContract } from '../models/rentalContract.model.js';
import { sendSuccess, sendError } from '../utils/response.util.js';

const router = express.Router();

// Fallback in-memory list if MongoDB is unavailable
let inMemoryApplications = [
  {
    _id: 'app-seed-001',
    id: 'app-seed-001',
    propertyId: 'prop-001',
    propertyTitle: 'The Peak Luxury Riverview Penthouse',
    applicantName: 'Sophie Taylor',
    tenantName: 'Sophie Taylor',
    email: 'sophie.taylor@example.com',
    phone: '+855 12 345 678',
    employment: 'Lead UI/UX Designer @ TechCorp',
    annualIncome: '$45,000 / yr',
    creditScore: 780,
    status: 'Pending',
    documents: ['Government_ID.pdf', 'Proof_Of_Income.pdf'],
    message: 'I would love to rent this beautiful penthouse for a 12-month lease starting next month.',
    submittedAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    _id: 'app-seed-002',
    id: 'app-seed-002',
    propertyId: 'prop-002',
    propertyTitle: 'Modern Loft near BKK1 Central',
    applicantName: 'Michael Chang',
    tenantName: 'Michael Chang',
    email: 'michael.c@example.com',
    phone: '+855 98 765 432',
    employment: 'Software Architect',
    annualIncome: '$58,000 / yr',
    creditScore: 810,
    status: 'Approved',
    documents: ['Passport_Scan.pdf', 'Employment_Letter.pdf'],
    message: 'Relocating to Phnom Penh for a regional engineering project.',
    submittedAt: new Date(Date.now() - 3600000 * 48).toISOString()
  }
];

// GET /api/applications
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const apps = await Application.find().sort({ createdAt: -1 });
      if (apps.length > 0) {
        return sendSuccess(res, 'Applications retrieved successfully', apps);
      }
    }
    return sendSuccess(res, 'Applications retrieved', inMemoryApplications);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
});

// POST /api/applications
router.post('/', async (req, res) => {
  try {
    const payload = {
      propertyId: req.body.propertyId || 'prop-default',
      propertyTitle: req.body.propertyTitle || 'Luxury Rental Property',
      tenantName: req.body.tenantName || req.body.applicantName || 'Tenant Applicant',
      email: req.body.email || 'tenant@renteasy.com',
      phone: req.body.phone || '',
      employment: req.body.employment || '',
      annualIncome: req.body.annualIncome || '',
      creditScore: Number(req.body.creditScore) || 750,
      moveInDate: req.body.moveInDate || '',
      status: req.body.status || 'Pending',
      documents: req.body.documents || ['Government_ID.pdf', 'Proof_Of_Income.pdf'],
      message: req.body.message || '',
      submittedAt: new Date()
    };

    let savedApp = { _id: `app-${Date.now()}`, id: `app-${Date.now()}`, ...payload };

    if (mongoose.connection.readyState === 1) {
      const app = new Application(payload);
      savedApp = await app.save();
    } else {
      inMemoryApplications.unshift(savedApp);
    }

    return sendSuccess(res, 'Rental application submitted successfully', savedApp, 201);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
});

// PUT /api/applications/:id/status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      const app = await Application.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
      if (app) {
        return sendSuccess(res, `Application status updated to ${status}`, app);
      }
    }

    // In-memory fallback
    const match = inMemoryApplications.find(a => a._id === id || a.id === id);
    if (match) {
      match.status = status;
      return sendSuccess(res, `Application status updated to ${status}`, match);
    }

    return sendSuccess(res, `Application status updated to ${status}`, { _id: id, status });
  } catch (error) {
    return sendError(res, error.message, 400);
  }
});

export default router;
