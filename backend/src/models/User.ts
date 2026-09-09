import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 
  | 'USER' 
  | 'STUDENT' 
  | 'COUNSELOR' 
  | 'INSTITUTION_STAFF' 
  | 'INSTITUTION_ADMIN' 
  | 'MODERATOR' 
  | 'SUPPORT' 
  | 'ADMIN' 
  | 'SUPER_ADMIN'
  // Legacy backward compatibility aliases
  | 'student' 
  | 'counselor' 
  | 'institution' 
  | 'admin';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  permissions: string[];
  tenantId?: mongoose.Types.ObjectId;
  institutionId?: mongoose.Types.ObjectId;
  organizationId?: mongoose.Types.ObjectId;
  accountStatus: 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
  preferences?: Map<string, string>;
  supportNeeds?: string[];
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  USER: ['resources.read', 'assessments.read'],
  STUDENT: ['resources.read', 'assessments.read'],
  COUNSELOR: ['resources.read', 'assessments.read', 'counselors.read', 'appointments.manage'],
  INSTITUTION_STAFF: ['resources.read', 'students.read', 'institution.analytics.read'],
  INSTITUTION_ADMIN: ['resources.read', 'students.read', 'students.analytics', 'institution.analytics.read', 'institution.manage', 'users.read'],
  MODERATOR: ['resources.read', 'community.moderate', 'users.read'],
  SUPPORT: ['resources.read', 'users.read'],
  ADMIN: [
    'users.read', 'users.update', 'users.delete',
    'students.read', 'students.analytics',
    'assessments.read', 'assessments.manage',
    'resources.read', 'resources.create', 'resources.update', 'resources.delete',
    'community.moderate', 'counselors.read', 'counselors.manage',
    'appointments.manage', 'institution.analytics.read', 'institution.manage',
    'billing.read', 'billing.manage', 'system.manage'
  ],
  SUPER_ADMIN: ['*']
};

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true },
  role: { 
    type: String, 
    enum: [
      'USER', 'STUDENT', 'COUNSELOR', 'INSTITUTION_STAFF', 'INSTITUTION_ADMIN', 
      'MODERATOR', 'SUPPORT', 'ADMIN', 'SUPER_ADMIN',
      'student', 'counselor', 'institution', 'admin'
    ], 
    default: 'STUDENT',
    index: true 
  },
  permissions: [{ type: String }],
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', index: true },
  institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true },
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', index: true },
  accountStatus: { 
    type: String, 
    enum: ['ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION'], 
    default: 'ACTIVE' 
  },
  preferences: { type: Map, of: String, default: {} },
  supportNeeds: [{ type: String }],
  lastLoginAt: { type: Date }
}, { timestamps: true });

userSchema.index({ tenantId: 1, role: 1 });
userSchema.index({ institutionId: 1, role: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
