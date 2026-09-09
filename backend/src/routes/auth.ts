import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User, DEFAULT_ROLE_PERMISSIONS } from '../models/User';
import { sendSuccess, sendError } from '../utils/response';
import { getJwtSecret, authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum([
    'USER', 'STUDENT', 'COUNSELOR', 'INSTITUTION_STAFF', 'INSTITUTION_ADMIN', 
    'student', 'counselor', 'institution', 'admin'
  ]).optional()
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

router.post('/register', async (req, res, next) => {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'Invalid registration parameters', parseResult.error.flatten().fieldErrors);
    }

    const { name, email, password, role } = parseResult.data;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return sendError(res, 409, 'EMAIL_EXISTS', 'An account with this email already exists.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userRole = (role || 'STUDENT').toUpperCase();
    const permissions = DEFAULT_ROLE_PERMISSIONS[userRole] || DEFAULT_ROLE_PERMISSIONS['STUDENT'];

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      passwordHash: hashedPassword,
      role: userRole,
      permissions
    });

    await newUser.save();

    const secret = getJwtSecret();
    const tokenPayload = {
      userId: newUser._id.toString(),
      role: newUser.role,
      permissions: newUser.permissions,
      tenantId: newUser.tenantId?.toString(),
      institutionId: newUser.institutionId?.toString()
    };

    const token = jwt.sign(tokenPayload, secret, { expiresIn: '7d' });

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return sendSuccess(res, {
      token,
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        permissions: newUser.permissions,
        tenantId: newUser.tenantId?.toString(),
        institutionId: newUser.institutionId?.toString()
      }
    }, 'User registered successfully', 201);
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'Invalid login parameters', parseResult.error.flatten().fieldErrors);
    }

    const { email, password } = parseResult.data;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return sendError(res, 401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    if (user.accountStatus === 'SUSPENDED') {
      return sendError(res, 403, 'ACCOUNT_SUSPENDED', 'Your account has been suspended. Please contact support.');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return sendError(res, 401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    user.lastLoginAt = new Date();
    await user.save();

    const userRole = user.role?.toUpperCase() || 'STUDENT';
    const permissions = user.permissions && user.permissions.length > 0 
      ? user.permissions 
      : DEFAULT_ROLE_PERMISSIONS[userRole] || DEFAULT_ROLE_PERMISSIONS['STUDENT'];

    const secret = getJwtSecret();
    const tokenPayload = {
      userId: user._id.toString(),
      role: user.role,
      permissions,
      tenantId: user.tenantId?.toString(),
      institutionId: user.institutionId?.toString()
    };

    const token = jwt.sign(tokenPayload, secret, { expiresIn: '7d' });

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return sendSuccess(res, {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        permissions,
        tenantId: user.tenantId?.toString(),
        institutionId: user.institutionId?.toString()
      }
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
});

router.post('/logout', (_req, res) => {
  res.clearCookie('access_token');
  return sendSuccess(res, null, 'Logged out successfully');
});

router.get('/me', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const user = await User.findById(req.user?.userId).select('-passwordHash');
    if (!user) {
      return sendError(res, 404, 'USER_NOT_FOUND', 'User account not found');
    }

    return sendSuccess(res, {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      tenantId: user.tenantId?.toString(),
      institutionId: user.institutionId?.toString(),
      accountStatus: user.accountStatus,
      createdAt: user.createdAt
    });
  } catch (error) {
    next(error);
  }
});

export default router;
