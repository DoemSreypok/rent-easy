import { PropertyService } from '../services/property.service.js';
import { sendSuccess, sendError } from '../utils/response.util.js';

export class PropertyController {
  static async getProperties(req, res) {
    try {
      const { search, type, city, district, minPrice, maxPrice, status, sort, order, page, limit, landlordId } = req.query;
      const result = await PropertyService.getProperties({
        search,
        type,
        city,
        district,
        minPrice,
        maxPrice,
        status,
        sort,
        order,
        page,
        limit,
        landlordId
      });
      return sendSuccess(res, 'Properties retrieved successfully.', result.properties || result);
    } catch (error) {
      return sendError(res, error.message, [error.message], 500);
    }
  }

  static async getPropertyById(req, res) {
    try {
      const result = await PropertyService.getPropertyById(req.params.id);
      return sendSuccess(res, 'Property details retrieved.', result.property || result);
    } catch (error) {
      return sendError(res, error.message, [error.message], 404);
    }
  }

  static async createProperty(req, res) {
    try {
      const landlordId = req.user._id;
      const property = await PropertyService.createProperty(req.body, landlordId);
      return sendSuccess(res, 'Property created successfully.', { property }, 201);
    } catch (error) {
      return sendError(res, error.message, [error.message], 400);
    }
  }

  static async updateProperty(req, res) {
    try {
      const property = await PropertyService.updateProperty(req.params.id, req.body, req.user);
      return sendSuccess(res, 'Property updated successfully.', { property });
    } catch (error) {
      return sendError(res, error.message, [error.message], 400);
    }
  }

  static async deleteProperty(req, res) {
    try {
      const property = await PropertyService.deleteProperty(req.params.id, req.user);
      return sendSuccess(res, 'Property deleted successfully.', { property });
    } catch (error) {
      return sendError(res, error.message, [error.message], 400);
    }
  }

  static async approveProperty(req, res) {
    try {
      const property = await PropertyService.updateStatus(req.params.id, 'APPROVED');
      return sendSuccess(res, 'Property has been approved.', { property });
    } catch (error) {
      return sendError(res, error.message, [error.message], 400);
    }
  }

  static async rejectProperty(req, res) {
    try {
      const property = await PropertyService.updateStatus(req.params.id, 'REJECTED');
      return sendSuccess(res, 'Property has been rejected.', { property });
    } catch (error) {
      return sendError(res, error.message, [error.message], 400);
    }
  }
}
