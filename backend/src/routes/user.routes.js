import express from 'express';
import { UserController } from '../controllers/user.controller.js';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

// Allow reading users for authenticated users or public explore
router.get('/', UserController.getUsers);
router.get('/:id', UserController.getUserById);

// Admin-only user management
router.post('/', authenticateJWT, authorizeRoles('ADMIN'), UserController.createUser);
router.put('/:id', authenticateJWT, UserController.updateUser);
router.delete('/:id', authenticateJWT, authorizeRoles('ADMIN'), UserController.deleteUser);
router.patch('/:id/toggle-status', authenticateJWT, authorizeRoles('ADMIN'), UserController.toggleStatus);

export default router;
