import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';

// Extend Express Request interface to include authentication payload
export interface AuthRequest extends Request {
  user?: {
    userId: number;
    role: 'CLIENT' | 'ADMIN';
  };
}

/**
 * Middleware to authenticate JWT tokens from HTTP headers.
 * Expects header format: Authorization: Bearer <JWT_TOKEN>
 */
export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(403).json({ message: 'Token invalide ou expiré.' });
  }

  req.user = payload;
  return next();
}

/**
 * Middleware to restrict access to CLIENT users only.
 */
export function requireClient(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'CLIENT') {
    return res.status(403).json({ message: 'Accès interdit. Réservé aux clients.' });
  }
  return next();
}

/**
 * Middleware to restrict access to ADMIN users only.
 */
export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Accès interdit. Réservé aux administrateurs.' });
  }
  return next();
}
