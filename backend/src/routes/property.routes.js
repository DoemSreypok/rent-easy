import express from 'express';
import { PropertyController } from '../controllers/property.controller.js';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public property browsing
router.get('/', PropertyController.getProperties);
router.get('/:id', PropertyController.getPropertyById);

// Landlord / Admin creation & updates
router.post('/', authenticateJWT, authorizeRoles('LANDLORD', 'ADMIN'), PropertyController.createProperty);
router.put('/:id', authenticateJWT, authorizeRoles('LANDLORD', 'ADMIN'), PropertyController.updateProperty);
router.delete('/:id', authenticateJWT, authorizeRoles('LANDLORD', 'ADMIN'), PropertyController.deleteProperty);

// Admin-only property approval
router.put('/:id/approve', authenticateJWT, authorizeRoles('ADMIN'), PropertyController.approveProperty);
router.put('/:id/reject', authenticateJWT, authorizeRoles('ADMIN'), PropertyController.rejectProperty);

export default router;
