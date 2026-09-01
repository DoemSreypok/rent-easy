import { AdminService } from '../services/admin.service.js';
import { sendSuccess, sendError } from '../utils/response.util.js';

export class AdminController {
  static async getDashboardStats(req, res) {
    try {
      const stats = await AdminService.getDashboardStats();
      return sendSuccess(res, 'Admin dashboard statistics retrieved.', stats);
    } catch (error) {
      return sendError(res, error.message, [error.message], 500);
    }
  }

  static async getReports(req, res) {
    try {
      const reports = await AdminService.getReports(req.query.type);
      return sendSuccess(res, 'Reports generated successfully.', reports);
    } catch (error) {
      return sendError(res, error.message, [error.message], 500);
    }
  }
}
