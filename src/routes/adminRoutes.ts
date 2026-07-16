import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

// Admin Dashboard et Management
router.get('/clients', authenticateToken, requireAdmin, AdminController.getClients);
router.get('/stats', authenticateToken, requireAdmin, AdminController.getStats);
router.get('/dashboard', authenticateToken, requireAdmin, AdminController.getDashboard);
router.get('/notifications', authenticateToken, requireAdmin, AdminController.getNotifications);

// Devis Management
router.put('/devis/:id/validate', authenticateToken, requireAdmin, AdminController.validateDevis);
router.put('/devis/:id/refuse', authenticateToken, requireAdmin, AdminController.refuseDevis);

// Reclamation Management
router.put('/reclamations/:id/process', authenticateToken, requireAdmin, AdminController.processReclamation);

export default router;