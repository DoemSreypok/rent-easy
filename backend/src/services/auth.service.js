import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { JWT_SECRET } from '../middleware/auth.middleware.js';

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export class AuthService {
  static generateToken(user) {
    return jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  static async register({ fullName, email, phone, password, role = 'TENANT', employment, annualIncome }) {
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      throw new Error('An account with this email address already exists.');
    }

    const validRole = ['ADMIN', 'LANDLORD', 'TENANT'].includes((role || '').toUpperCase())
      ? role.toUpperCase()
      : 'TENANT';

    const user = new User({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim(),
      password,
      role: validRole,
      employment: employment?.trim(),
      annualIncome: annualIncome?.trim()
    });

    await user.save();
    const token = this.generateToken(user);
    return { user, token };
  }

  static async login(email, password) {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    if (user.status === 'INACTIVE') {
      throw new Error('This account has been deactivated. Please contact an administrator.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  static async forgotPassword(email) {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // Do not reveal user existence
      return { message: 'If an account exists with this email, password reset instructions have been sent.' };
    }

    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    return {
      message: 'Password reset token generated successfully.',
      resetToken // In production, email this; here returned for mock dev flow
    };
  }

  static async resetPassword(resetToken, newPassword) {
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw new Error('Password reset token is invalid or has expired.');
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const token = this.generateToken(user);
    return { user, token };
  }

  static async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found.');
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new Error('Incorrect current password.');
    }

    user.password = newPassword;
    await user.save();
    return { message: 'Password changed successfully.' };
  }

  static async getCurrentUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found.');
    }
    return user;
  }
}
