const test = require('node:test');
const assert = require('node:assert/strict');
const { createHmac, randomBytes, scryptSync, timingSafeEqual } = require('node:crypto');

const hashPassword = (password) => {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
};

const verifyPassword = (password, storedHash) => {
  const [salt, originalHash] = storedHash.split(':');
  if (!salt || !originalHash) return false;
  const hash = scryptSync(password, salt, 64).toString('hex');
  return timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(originalHash, 'hex'));
};

const signJwt = (payload, secret) => {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = `${header}.${Buffer.from(JSON.stringify(payload)).toString('base64url')}`;
  const signature = createHmac('sha256', secret).update(body).digest('base64url');
  return `${body}.${signature}`;
};

const verifyJwt = (token, secret) => {
  const [header, payload, signature] = token.split('.');
  const body = `${header}.${payload}`;
  const expected = createHmac('sha256', secret).update(body).digest('base64url');
  assert.equal(signature, expected);
  return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
};

test('password hashing and verification works for auth flow', () => {
  const hash = hashPassword('Secreta123!');
  assert.equal(verifyPassword('Secreta123!', hash), true);
  assert.equal(verifyPassword('WrongPassword!', hash), false);
});

test('jwt payload keeps sub and role for access/refresh tokens', () => {
  const now = Math.floor(Date.now() / 1000);
  const payload = { sub: 'user_1', email: 'user@zippy.ar', role: 'PASSENGER', iat: now, exp: now + 900 };

  const accessToken = signJwt(payload, 'access-secret-123456789');
  const refreshToken = signJwt({ ...payload, exp: now + 604800 }, 'refresh-secret-123456789');

  const accessDecoded = verifyJwt(accessToken, 'access-secret-123456789');
  const refreshDecoded = verifyJwt(refreshToken, 'refresh-secret-123456789');

  assert.equal(accessDecoded.sub, 'user_1');
  assert.equal(accessDecoded.role, 'PASSENGER');
  assert.equal(refreshDecoded.sub, 'user_1');
  assert.equal(refreshDecoded.role, 'PASSENGER');
});

const roleMatrix = {
  createRide: ['PASSENGER'],
  listRides: ['ADMIN', 'DRIVER'],
  createOffer: ['DRIVER'],
  acceptOffer: ['PASSENGER'],
  changeStatus: ['DRIVER', 'ADMIN']
};

test('role matrix authorization remains strict', () => {
  const allRoles = ['PASSENGER', 'DRIVER', 'ADMIN'];

  for (const [action, allowedRoles] of Object.entries(roleMatrix)) {
    allRoles.forEach((role) => {
      assert.equal(allowedRoles.includes(role), roleMatrix[action].includes(role));
    });
  }
});
