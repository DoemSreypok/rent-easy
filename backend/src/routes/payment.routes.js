import express from 'express';
import { PaymentController } from '../controllers/payment.controller.js';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateJWT);

router.get('/', PaymentController.getPayments);
router.get('/:id', PaymentController.getPaymentById);

router.post('/', authorizeRoles('TENANT', 'ADMIN'), PaymentController.submitPayment);
router.put('/:id/confirm', authorizeRoles('LANDLORD', 'ADMIN'), PaymentController.confirmPayment);
router.put('/:id/reject', authorizeRoles('LANDLORD', 'ADMIN'), PaymentController.rejectPayment);

export default router;
