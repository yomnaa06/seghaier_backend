import { Router } from 'express';
import { ReclamationController } from '../controllers/reclamationController';
import { authenticateToken, requireClient, requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

// Client routes
router.post('/', authenticateToken, requireClient, ReclamationController.create);
router.get('/my', authenticateToken, requireClient, ReclamationController.getClientHistory);

// Admin routes
router.get('/admin', authenticateToken, requireAdmin, ReclamationController.listAll);
router.get('/admin/pending', authenticateToken, requireAdmin, ReclamationController.listPending);
router.put('/admin/:id/process', authenticateToken, requireAdmin, ReclamationController.process);

export default router;