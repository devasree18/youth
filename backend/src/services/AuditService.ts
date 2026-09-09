import mongoose from 'mongoose';
import { AuditLog } from '../models/AuditLog';

export class AuditService {
  public static async logAction(
    action: string,
    resource: string,
    userId?: string,
    tenantId?: string,
    resourceId?: string,
    ipAddress?: string,
    userAgent?: string,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    // Sanitize metadata to prevent sensitive leak
    const sanitizedMeta = { ...metadata };
    delete sanitizedMeta.password;
    delete sanitizedMeta.passwordHash;
    delete sanitizedMeta.token;
    delete sanitizedMeta.secret;

    if (mongoose.connection.readyState !== 1) {
      console.log(`[AUDIT LOG] ${action} on ${resource} by user ${userId || 'anonymous'}`);
      return;
    }

    try {
      const log = new AuditLog({
        action,
        resource,
        userId: userId ? new mongoose.Types.ObjectId(userId) : undefined,
        tenantId: tenantId ? new mongoose.Types.ObjectId(tenantId) : undefined,
        resourceId,
        ipAddress,
        userAgent,
        metadata: sanitizedMeta
      });
      await log.save();
    } catch (err) {
      console.error('Failed to persist audit log:', err);
    }
  }
}
