import { NotificationService } from '../services/notification.service.js';
import { sendSuccess, sendError } from '../utils/response.util.js';

export class NotificationController {
  static async getNotifications(req, res) {
    try {
      const result = await NotificationService.getNotifications(req.user._id);
      return sendSuccess(res, 'Notifications retrieved successfully.', result);
    } catch (error) {
      return sendError(res, error.message, [error.message], 500);
    }
  }

  static async markAsRead(req, res) {
    try {
      const notification = await NotificationService.markAsRead(req.params.id, req.user._id);
      return sendSuccess(res, 'Notification marked as read.', { notification });
    } catch (error) {
      return sendError(res, error.message, [error.message], 400);
    }
  }

  static async markAllAsRead(req, res) {
    try {
      const result = await NotificationService.markAllAsRead(req.user._id);
      return sendSuccess(res, result.message);
    } catch (error) {
      return sendError(res, error.message, [error.message], 400);
    }
  }
}
