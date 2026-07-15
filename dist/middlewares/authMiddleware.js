"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
exports.requireClient = requireClient;
exports.requireAdmin = requireAdmin;
const auth_1 = require("../utils/auth");
/**
 * Middleware to authenticate JWT tokens from HTTP headers.
 * Expects header format: Authorization: Bearer <JWT_TOKEN>
 */
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
    if (!token) {
        return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
    }
    const payload = (0, auth_1.verifyToken)(token);
    if (!payload) {
        return res.status(403).json({ message: 'Token invalide ou expiré.' });
    }
    req.user = payload;
    return next();
}
/**
 * Middleware to restrict access to CLIENT users only.
 */
function requireClient(req, res, next) {
    if (!req.user || req.user.role !== 'CLIENT') {
        return res.status(403).json({ message: 'Accès interdit. Réservé aux clients.' });
    }
    return next();
}
/**
 * Middleware to restrict access to ADMIN users only.
 */
function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Accès interdit. Réservé aux administrateurs.' });
    }
    return next();
}
