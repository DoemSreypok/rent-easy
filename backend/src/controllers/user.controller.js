import { UserService } from '../services/user.service.js';
import { sendSuccess, sendError } from '../utils/response.util.js';

export class UserController {
  static async getUsers(req, res) {
    try {
      const { search, role, status, page, limit } = req.query;
      const result = await UserService.getUsers({ search, role, status, page, limit });
      return sendSuccess(res, 'Users retrieved successfully.', result);
    } catch (error) {
      return sendError(res, error.message, [error.message], 500);
    }
  }

  static async getUserById(req, res) {
    try {
      const user = await UserService.getUserById(req.params.id);
      return sendSuccess(res, 'User retrieved successfully.', { user });
    } catch (error) {
      return sendError(res, error.message, [error.message], 404);
    }
  }

  static async createUser(req, res) {
    try {
      const user = await UserService.createUser(req.body);
      return sendSuccess(res, 'User created successfully.', { user }, 201);
    } catch (error) {
      return sendError(res, error.message, [error.message], 400);
    }
  }

  static async updateUser(req, res) {
    try {
      const user = await UserService.updateUser(req.params.id, req.body);
      return sendSuccess(res, 'User updated successfully.', { user });
    } catch (error) {
      return sendError(res, error.message, [error.message], 400);
    }
  }

  static async deleteUser(req, res) {
    try {
      const user = await UserService.deleteUser(req.params.id);
      return sendSuccess(res, 'User deleted successfully.', { user });
    } catch (error) {
      return sendError(res, error.message, [error.message], 400);
    }
  }

  static async toggleStatus(req, res) {
    try {
      const user = await UserService.toggleUserStatus(req.params.id);
      return sendSuccess(res, `User status updated to ${user.status}.`, { user });
    } catch (error) {
      return sendError(res, error.message, [error.message], 400);
    }
  }
}
