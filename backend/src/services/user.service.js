import { User } from '../models/user.model.js';

export class UserService {
  static async getUsers({ search, role, status, page = 1, limit = 20 }) {
    const query = {};

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ fullName: regex }, { name: regex }, { email: regex }, { phone: regex }];
    }

    if (role && role !== 'ALL') {
      query.role = role.toUpperCase();
    }

    if (status && status !== 'ALL') {
      query.status = status.toUpperCase();
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return {
      users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    };
  }

  static async getUserById(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found.');
    }
    return user;
  }

  static async createUser(payload) {
    const existing = await User.findOne({ email: payload.email.toLowerCase().trim() });
    if (existing) {
      throw new Error('User with this email already exists.');
    }
    const user = new User(payload);
    await user.save();
    return user;
  }

  static async updateUser(id, payload) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found.');
    }

    if (payload.fullName) user.fullName = payload.fullName;
    if (payload.name) user.name = payload.name;
    if (payload.phone) user.phone = payload.phone;
    if (payload.role) user.role = payload.role.toUpperCase();
    if (payload.status) user.status = payload.status.toUpperCase();
    if (payload.employment) user.employment = payload.employment;
    if (payload.annualIncome) user.annualIncome = payload.annualIncome;
    if (payload.creditScore) user.creditScore = payload.creditScore;
    if (payload.avatar) user.avatar = payload.avatar;

    if (payload.password) {
      user.password = payload.password;
    }

    await user.save();
    return user;
  }

  static async deleteUser(id) {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new Error('User not found.');
    }
    return user;
  }

  static async toggleUserStatus(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found.');
    }
    user.status = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await user.save();
    return user;
  }
}
