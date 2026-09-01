import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { sendError } from '../utils/response.util.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'rent_easy_super_secret_jwt_key_2026_secure';

export const authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Authentication required. No token provided.', [], 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return sendError(res, 'User session expired or user no longer exists.', [], 401);
    }

    if (user.status === 'INACTIVE') {
      return sendError(res, 'Account is deactivated. Please contact admin.', [], 403);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 'Token has expired. Please log in again.', [], 401);
    }
    return sendError(res, 'Invalid authentication token.', [error.message], 401);
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Authentication required.', [], 401);
    }

    const userRole = (req.user.role || '').toUpperCase();
    const formattedRoles = roles.map(r => r.toUpperCase());

    if (!formattedRoles.includes(userRole)) {
      return sendError(
        res,
        `Access denied. Requires one of the following roles: [${roles.join(', ')}].`,
        [],
        403
      );
    }

    next();
  };
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user && user.status === 'ACTIVE') {
        req.user = user;
      }
    }
  } catch {}
  next();
};
