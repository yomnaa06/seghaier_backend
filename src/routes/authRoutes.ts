import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken, requireClient } from '../middlewares/authMiddleware';

const router = Router();

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);

// Protected client routes
router.get('/profile', authenticateToken, requireClient, AuthController.getProfile);
router.put('/profile', authenticateToken, requireClient, AuthController.updateProfile);

export default router;