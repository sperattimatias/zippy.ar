import { registerAs } from '@nestjs/config';

const splitOrigins = (value: string | undefined): string[] =>
  value
    ? value
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
    : [];

export const envConfig = registerAs('env', () => {
  const directOrigins = [process.env.WEB_ORIGIN, process.env.ADMIN_ORIGIN].filter(
    (value): value is string => Boolean(value)
  );

  const csvOrigins = splitOrigins(process.env.CORS_ALLOWED_ORIGINS);

  return {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: Number(process.env.PORT ?? 4000),
    allowedOrigins: Array.from(new Set([...directOrigins, ...csvOrigins])),
    throttleTtl: Number(process.env.THROTTLE_TTL ?? 60),
    throttleLimit: Number(process.env.THROTTLE_LIMIT ?? 100)
  };
});
