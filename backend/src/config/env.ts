import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters long'),
  MONGODB_USERNAME: z.string().optional(),
  MONGODB_PASSWORD: z.string().optional(),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  ALLOWED_ORIGINS: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional()
});

let parsedEnv: z.infer<typeof envSchema>;

try {
  if (process.env.NODE_ENV === 'test' && !process.env.JWT_SECRET) {
    process.env.JWT_SECRET = 'e876c2f2e6e90267c518edae5bf5eb4e7e15a4fc75f778cfe8318e94c6e415788f61aac6b1060e1649c25823711c14aac7f468a2e127aa5d3ebda1dfa77fc3c9';
  }

  if (process.env.NODE_ENV === 'test' && !process.env.MONGODB_URI) {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/youth_test_db';
  }

  parsedEnv = envSchema.parse(process.env);
} catch (error: any) {
  if (error instanceof z.ZodError) {
    console.error('❌ FATAL ENVIRONMENT CONFIGURATION ERROR:');
    error.issues.forEach((err: any) => {
      console.error(`  - ${err.path.join('.')}: ${err.message}`);
    });
  } else {
    console.error('❌ Unknown Environment Initialization Error:', error);
  }

  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }

  parsedEnv = {
    NODE_ENV: (process.env.NODE_ENV as any) || 'development',
    PORT: 5000,
    JWT_SECRET: process.env.JWT_SECRET || 'e876c2f2e6e90267c518edae5bf5eb4e7e15a4fc75f778cfe8318e94c6e415788f61aac6b1060e1649c25823711c14aac7f468a2e127aa5d3ebda1dfa77fc3c9',
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/youth_db',
    MONGODB_USERNAME: process.env.MONGODB_USERNAME,
    MONGODB_PASSWORD: process.env.MONGODB_PASSWORD,
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY
  };
}

export const envConfig = parsedEnv;
