import { AuthService } from '../services/auth.service.js';
import { sendSuccess, sendError } from '../utils/response.util.js';

export class AuthController {
  static async register(req, res) {
    try {
      const { fullName, name, email, phone, password, confirmPassword, role, employment, annualIncome } = req.body;
      const actualName = fullName || name;

      if (!actualName || !email || !password) {
        return sendError(res, 'Full name, email, and password are required.', [], 400);
      }

      if (confirmPassword && password !== confirmPassword) {
        return sendError(res, 'Password and confirmation password do not match.', [], 400);
      }

      const result = await AuthService.register({
        fullName: actualName,
        email,
        phone,
        password,
        role,
        employment,
        annualIncome
      });

      return sendSuccess(res, 'Account registered successfully.', result, 201);
    } catch (error) {
      return sendError(res, error.message, [error.message], 400);
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return sendError(res, 'Email and password are required.', [], 400);
      }

      const result = await AuthService.login(email, password);
      return sendSuccess(res, 'Login successful.', result);
    } catch (error) {
      return sendError(res, error.message, [error.message], 401);
    }
  }

  static async logout(req, res) {
    return sendSuccess(res, 'Logged out successfully.');
  }

  static async getMe(req, res) {
    try {
      const user = await AuthService.getCurrentUser(req.user._id);
      return sendSuccess(res, 'Current user profile fetched.', { user });
    } catch (error) {
      return sendError(res, error.message, [error.message], 404);
    }
  }

  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        return sendError(res, 'Email is required.', [], 400);
      }
      const result = await AuthService.forgotPassword(email);
      return sendSuccess(res, result.message, result);
    } catch (error) {
      return sendError(res, error.message, [error.message], 400);
    }
  }

  static async resetPassword(req, res) {
    try {
      const { token, newPassword, confirmPassword } = req.body;
      if (!token || !newPassword) {
        return sendError(res, 'Token and new password are required.', [], 400);
      }
      if (confirmPassword && newPassword !== confirmPassword) {
        return sendError(res, 'Passwords do not match.', [], 400);
      }

      const result = await AuthService.resetPassword(token, newPassword);
      return sendSuccess(res, 'Password has been reset successfully.', result);
    } catch (error) {
      return sendError(res, error.message, [error.message], 400);
    }
  }

  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return sendError(res, 'Current and new password are required.', [], 400);
      }

      const result = await AuthService.changePassword(req.user._id, currentPassword, newPassword);
      return sendSuccess(res, result.message);
    } catch (error) {
      return sendError(res, error.message, [error.message], 400);
    }
  }
}
