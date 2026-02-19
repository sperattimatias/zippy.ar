import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().port().default(4000),
  WEB_ORIGIN: Joi.string().uri({ scheme: ['http', 'https'] }).required(),
  ADMIN_ORIGIN: Joi.string().uri({ scheme: ['http', 'https'] }).required(),
  CORS_ALLOWED_ORIGINS: Joi.string().allow('').optional(),
  THROTTLE_TTL: Joi.number().integer().min(1).default(60),
  THROTTLE_LIMIT: Joi.number().integer().min(1).default(100),
  DATABASE_URL: Joi.string().required(),
  JWT_ACCESS_SECRET: Joi.string().min(16).required(),
  JWT_REFRESH_SECRET: Joi.string().min(16).required(),
  JWT_ACCESS_EXPIRES_IN_SECONDS: Joi.number().integer().min(60).default(900),
  JWT_REFRESH_EXPIRES_IN_SECONDS: Joi.number().integer().min(300).default(604800)
});
