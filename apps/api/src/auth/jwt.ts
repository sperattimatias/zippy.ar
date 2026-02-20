import { createHmac, timingSafeEqual } from 'node:crypto';

const encoder = new TextEncoder();

type JwtPayload = Record<string, string | number>;

const b64url = (input: string) => Buffer.from(input).toString('base64url');
const b64urlJson = (value: object) => b64url(JSON.stringify(value));

export const signJwt = (payload: JwtPayload, secret: string): string => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = b64urlJson(header);
  const encodedPayload = b64urlJson(payload);
  const body = `${encodedHeader}.${encodedPayload}`;

  const signature = createHmac('sha256', secret).update(body).digest('base64url');
  return `${body}.${signature}`;
};

export const verifyJwt = <T extends JwtPayload>(token: string, secret: string): T => {
  const [header, payload, signature] = token.split('.');

  if (!header || !payload || !signature) {
    throw new Error('Malformed token');
  }

  const body = `${header}.${payload}`;
  const expected = createHmac('sha256', secret).update(body).digest('base64url');

  const expectedBytes = encoder.encode(expected);
  const signatureBytes = encoder.encode(signature);

  if (expectedBytes.length !== signatureBytes.length || !timingSafeEqual(expectedBytes, signatureBytes)) {
    throw new Error('Invalid signature');
  }

  const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as T;

  if (typeof decoded.exp === 'number' && Date.now() / 1000 > decoded.exp) {
    throw new Error('Token expired');
  }

  return decoded;
};
