import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

interface TokenPayload {
  userId: number;
  role: 'CLIENT' | 'ADMIN';
}

 /**
 * Generates a JWT token.
 * @param payload Object containing userId and role
 * @returns JWT string
 */
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

/**
 * Verifies a JWT token and returns its payload.
 * Retourne null si token  invalid or expiré.
 * @param token JWT token string
 * @returns Decoded payload or null
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}
