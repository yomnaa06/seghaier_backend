import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hashes password using bcryptjs.
 * @param password mot de passe normal
 * @returns mot de passe hashé
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compaison d'un mot de passe avec un autre hashé
 * @param password mot de passe normal
 * @param hash mot de passe hashé
 * @returns True if they match, false sinon
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
