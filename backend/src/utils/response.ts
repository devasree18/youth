import { Response } from 'express';

export interface ApiResponseMeta {
  requestId?: string;
  page?: number;
  limit?: number;
  total?: number;
  [key: string]: any;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message: string = 'Operation completed successfully',
  statusCode: number = 200,
  meta?: ApiResponseMeta
) {
  const requestId = (res.req as any)?.requestId;
  return res.status(statusCode).json({
    success: true,
    data,
    message,
    meta: {
      ...(requestId ? { requestId } : {}),
      ...meta
    }
  });
}

export function sendError(
  res: Response,
  statusCode: number = 500,
  code: string = 'INTERNAL_ERROR',
  message: string = 'An unexpected error occurred',
  details: any = null
) {
  const requestId = (res.req as any)?.requestId;
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details
    },
    meta: {
      ...(requestId ? { requestId } : {})
    }
  });
}
