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
    throttleLimit: Number(process.env.THROTTLE_LIMIT ?? 100),
    databaseUrl: process.env.DATABASE_URL ?? 'postgresql://zippy:zippy@localhost:5432/zippy',
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET ?? 'dev-access-secret',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret',
    jwtAccessExpiresInSeconds: Number(process.env.JWT_ACCESS_EXPIRES_IN_SECONDS ?? 900),
    jwtRefreshExpiresInSeconds: Number(process.env.JWT_REFRESH_EXPIRES_IN_SECONDS ?? 604800),
    googleMapsServerKey: process.env.GOOGLE_MAPS_SERVER_KEY,
    googleMapsWebKey: process.env.GOOGLE_MAPS_WEB_KEY,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD
  };
});
