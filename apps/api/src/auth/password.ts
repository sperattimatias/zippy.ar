import bcrypt from 'bcrypt';

const PASSWORD_SALT_ROUNDS = 12;

export const hashPassword = (password: string): Promise<string> => bcrypt.hash(password, PASSWORD_SALT_ROUNDS);

export const verifyPassword = (password: string, storedHash: string): Promise<boolean> =>
  bcrypt.compare(password, storedHash);
