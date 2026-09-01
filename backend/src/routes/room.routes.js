import express from 'express';
import { RoomController } from '../controllers/room.controller.js';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', RoomController.getRooms);
router.get('/:id', RoomController.getRoomById);

router.post('/', authenticateJWT, authorizeRoles('LANDLORD', 'ADMIN'), RoomController.createRoom);
router.put('/:id', authenticateJWT, authorizeRoles('LANDLORD', 'ADMIN'), RoomController.updateRoom);
router.delete('/:id', authenticateJWT, authorizeRoles('LANDLORD', 'ADMIN'), RoomController.deleteRoom);
router.patch('/:id/status', authenticateJWT, authorizeRoles('LANDLORD', 'ADMIN'), RoomController.updateStatus);

export default router;
