import { Router } from 'express';
import { DevisController } from '../controllers/devisController';
import { authenticateToken, requireClient, requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

// Client routes
router.post('/', authenticateToken, requireClient, DevisController.create);
router.get('/my', authenticateToken, requireClient, DevisController.getClientHistory);
router.get('/:id', authenticateToken, requireClient, DevisController.getOne);

// Admin routes 
router.get('/admin', authenticateToken, requireAdmin, DevisController.listAll);
router.get('/admin/stats', authenticateToken, requireAdmin, DevisController.getStats);
router.put('/admin/:id/validate', authenticateToken, requireAdmin, DevisController.validate);
router.put('/admin/:id/refuse', authenticateToken, requireAdmin, DevisController.refuse);
router.delete('/admin/:id', authenticateToken, requireAdmin, DevisController.delete);

export default router;


