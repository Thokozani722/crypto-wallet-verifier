const dotenv = require('dotenv');

dotenv.config();

const PLAN_LIMITS = {
  free: 2,
  pro: 10,
  enterprise: Infinity,
};

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  email: {
    from: process.env.EMAIL_FROM || 'alerts@cryptoguard.dev',
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
  },
  webhookUrl: process.env.NOTIFICATION_WEBHOOK || '',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  reportsDir: process.env.REPORTS_DIR || 'reports',
  planLimits: PLAN_LIMITS,
  magicLinkTtl: Number(process.env.MAGIC_LINK_TTL || 10) * 60 * 1000,
};
