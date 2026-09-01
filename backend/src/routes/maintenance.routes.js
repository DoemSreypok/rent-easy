import express from 'express';
import { MaintenanceController } from '../controllers/maintenance.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateJWT);

router.get('/', MaintenanceController.getRequests);
router.get('/:id', MaintenanceController.getRequestById);
router.post('/', MaintenanceController.createRequest);
router.put('/:id/status', MaintenanceController.updateStatus);

export default router;
