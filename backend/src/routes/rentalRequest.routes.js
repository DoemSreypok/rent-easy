import express from 'express';
import { RentalRequestController } from '../controllers/rentalRequest.controller.js';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateJWT);

router.get('/', RentalRequestController.getRequests);
router.get('/:id', RentalRequestController.getRequestById);
router.post('/', authorizeRoles('TENANT', 'ADMIN'), RentalRequestController.createRequest);

router.put('/:id/accept', authorizeRoles('LANDLORD', 'ADMIN'), RentalRequestController.acceptRequest);
router.put('/:id/reject', authorizeRoles('LANDLORD', 'ADMIN'), RentalRequestController.rejectRequest);
router.put('/:id/cancel', authorizeRoles('TENANT', 'ADMIN'), RentalRequestController.cancelRequest);

export default router;
