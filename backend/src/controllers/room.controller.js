import { RoomService } from '../services/room.service.js';
import { sendSuccess, sendError } from '../utils/response.util.js';

export class RoomController {
  static async getRooms(req, res) {
    try {
      const { propertyId, status, minPrice, maxPrice } = req.query;
      const rooms = await RoomService.getRooms({ propertyId, status, minPrice, maxPrice });
      return sendSuccess(res, 'Rooms retrieved successfully.', rooms);
    } catch (error) {
      return sendError(res, error.message, [error.message], 500);
    }
  }

  static async getRoomById(req, res) {
    try {
      const room = await RoomService.getRoomById(req.params.id);
      return sendSuccess(res, 'Room retrieved successfully.', { room });
    } catch (error) {
      return sendError(res, error.message, [error.message], 404);
    }
  }

  static async createRoom(req, res) {
    try {
      const room = await RoomService.createRoom(req.body);
      return sendSuccess(res, 'Room created successfully.', { room }, 201);
    } catch (error) {
      return sendError(res, error.message, [error.message], 400);
    }
  }

  static async updateRoom(req, res) {
    try {
      const room = await RoomService.updateRoom(req.params.id, req.body);
      return sendSuccess(res, 'Room updated successfully.', { room });
    } catch (error) {
      return sendError(res, error.message, [error.message], 400);
    }
  }

  static async deleteRoom(req, res) {
    try {
      const room = await RoomService.deleteRoom(req.params.id);
      return sendSuccess(res, 'Room deleted successfully.', { room });
    } catch (error) {
      return sendError(res, error.message, [error.message], 400);
    }
  }

  static async updateStatus(req, res) {
    try {
      const room = await RoomService.updateStatus(req.params.id, req.body.status);
      return sendSuccess(res, `Room status updated to ${room.status}.`, { room });
    } catch (error) {
      return sendError(res, error.message, [error.message], 400);
    }
  }
}
