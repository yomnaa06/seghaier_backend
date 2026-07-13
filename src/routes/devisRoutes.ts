import { Router } from 'express';
import { DevisController } from '../controllers/devisController';
import { authenticateToken, requireClient, requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

// Client routes
router.post('/', authenticateToken, requireClient, DevisController.create);
router.get('/my', authenticateToken, requireClient, DevisController.getClientHistory);

// Admin routes
router.get('/admin', authenticateToken, requireAdmin, DevisController.listAll);
router.put('/admin/:id/validate', authenticateToken, requireAdmin, DevisController.validate);
router.put('/admin/:id/refuse', authenticateToken, requireAdmin, DevisController.refuse);

export default router;