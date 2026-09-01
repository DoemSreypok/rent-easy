import { RentalRequestService } from '../services/rentalRequest.service.js';
import { sendSuccess, sendError } from '../utils/response.util.js';

export class RentalRequestController {
  static async getRequests(req, res) {
    try {
      const requests = await RentalRequestService.getRequests({ user: req.user, status: req.query.status });
      return sendSuccess(res, 'Rental requests retrieved successfully.', requests);
    } catch (error) {
      return sendError(res, error.message, [error.message], 500);
    }
  }

  static async getRequestById(req, res) {
    try {
      const request = await RentalRequestService.getRequestById(req.params.id);
      return sendSuccess(res, 'Rental request retrieved successfully.', { request });
    } catch (error) {
      return sendError(res, error.message, [error.message], 404);
    }
  }

  static async createRequest(req, res) {
    try {
      const { propertyId, roomId, message } = req.body;
      if (!propertyId) {
        return sendError(res, 'Property ID is required.', [], 400);
      }

      const request = await RentalRequestService.createRequest({
        tenantId: req.user._id,
        propertyId,
        roomId,
        message
      });

      return sendSuccess(res, 'Rental request submitted successfully.', { request }, 201);
    } catch (error) {
      return sendError(res, error.message, [error.message], 400);
    }
  }

  static async acceptRequest(req, res) {
    try {
      const result = await RentalRequestService.acceptRequest(req.params.id, req.user);
      return sendSuccess(res, 'Rental request accepted and contract created.', result);
    } catch (error) {
      return sendError(res, error.message, [error.message], 400);
    }
  }

  static async rejectRequest(req, res) {
    try {
      const request = await RentalRequestService.rejectRequest(req.params.id, req.user);
      return sendSuccess(res, 'Rental request rejected.', { request });
    } catch (error) {
      return sendError(res, error.message, [error.message], 400);
    }
  }

  static async cancelRequest(req, res) {
    try {
      const request = await RentalRequestService.cancelRequest(req.params.id, req.user);
      return sendSuccess(res, 'Rental request cancelled.', { request });
    } catch (error) {
      return sendError(res, error.message, [error.message], 400);
    }
  }
}
