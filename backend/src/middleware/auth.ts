import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendError } from '../utils/response';

export interface AuthenticatedUser {
  userId: string;
  role: string;
  permissions?: string[];
  tenantId?: string;
  institutionId?: string;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
  requestId?: string;
}

export const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'test') {
      return 'test_jwt_secret_key_minimum_32_characters_long_for_security';
    }
    throw new Error('FATAL SECURITY ERROR: JWT_SECRET environment variable is missing!');
  }
  return secret;
};

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const bearerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  const cookieToken = req.cookies?.access_token;
  
  const token = bearerToken || cookieToken;

  if (!token) {
    return sendError(res, 401, 'UNAUTHORIZED', 'Authentication token required');
  }

  try {
    const secret = getJwtSecret();
    const decoded = jwt.verify(token, secret) as AuthenticatedUser;
    
    req.user = decoded;
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 401, 'TOKEN_EXPIRED', 'Session token has expired. Please log in again.');
    }
    return sendError(res, 403, 'FORBIDDEN', 'Invalid authentication token');
  }
};
