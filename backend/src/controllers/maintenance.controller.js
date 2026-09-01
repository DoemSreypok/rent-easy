import { MaintenanceService } from '../services/maintenance.service.js';
import { sendSuccess, sendError } from '../utils/response.util.js';

export class MaintenanceController {
  static async getRequests(req, res) {
    try {
      const requests = await MaintenanceService.getRequests({
        user: req.user,
        status: req.query.status,
        urgency: req.query.urgency
      });
      return sendSuccess(res, 'Maintenance requests retrieved successfully.', requests);
    } catch (error) {
      return sendError(res, error.message, [error.message], 500);
    }
  }

  static async getRequestById(req, res) {
    try {
      const request = await MaintenanceService.getRequestById(req.params.id);
      return sendSuccess(res, 'Maintenance request retrieved successfully.', { request });
    } catch (error) {
      return sendError(res, error.message, [error.message], 404);
    }
  }

  static async createRequest(req, res) {
    try {
      const { propertyId, roomId, title, description, imageUrl, urgency } = req.body;
      if (!title || !description) {
        return sendError(res, 'Title and description are required.', [], 400);
      }

      const request = await MaintenanceService.createRequest({
        tenantId: req.user._id,
        propertyId,
        roomId,
        title,
        description,
        imageUrl,
        urgency
      });

      return sendSuccess(res, 'Maintenance request submitted successfully.', { request }, 201);
    } catch (error) {
      return sendError(res, error.message, [error.message], 400);
    }
  }

  static async updateStatus(req, res) {
    try {
      const request = await MaintenanceService.updateStatus(req.params.id, req.body, req.user);
      return sendSuccess(res, 'Maintenance request updated successfully.', { request });
    } catch (error) {
      return sendError(res, error.message, [error.message], 400);
    }
  }
}
