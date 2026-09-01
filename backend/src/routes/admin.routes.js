import express from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateJWT);
router.use(authorizeRoles('ADMIN'));

router.get('/dashboard', AdminController.getDashboardStats);
router.get('/reports', AdminController.getReports);

export default router;
