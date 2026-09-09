import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public details: any;

  constructor(message: string, statusCode: number = 400, code: string = 'BAD_REQUEST', details: any = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    return sendError(res, err.statusCode, err.code, err.message, err.details);
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors || {}).map((e: any) => ({
      field: e.path,
      message: e.message
    }));
    return sendError(res, 400, 'VALIDATION_ERROR', 'Database validation failed', details);
  }

  // Handle Mongoose Cast Error (Invalid ObjectID)
  if (err.name === 'CastError') {
    return sendError(res, 400, 'INVALID_ID', `Invalid identifier format: ${err.value}`);
  }

  // Handle Duplicate Key Error (E11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return sendError(res, 409, 'DUPLICATE_ENTRY', `Resource with this ${field} already exists.`);
  }

  // Handle JWT Errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 401, 'INVALID_TOKEN', 'Invalid authentication token');
  }
  if (err.name === 'TokenExpiredError') {
    return sendError(res, 401, 'TOKEN_EXPIRED', 'Authentication token has expired');
  }

  console.error('Unhandled Server Error:', err);

  const message = process.env.NODE_ENV === 'production' 
    ? 'An internal server error occurred' 
    : err.message || 'Internal server error';

  return sendError(res, err.status || 500, 'INTERNAL_SERVER_ERROR', message);
};
