import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { AdminService } from '../services/adminService';
import { DevisService } from '../services/devisService';
import { ReclamationService } from '../services/reclamationService';

export class AdminController {
  /**
   * Admin: Retrieves the list of all clients.
   * GET /api/admin/clients
   */
  static async getClients(_req: AuthRequest, res: Response) {
    try {
      const clients = await AdminService.getClientsList();
      return res.status(200).json({
        success: true,
        data: clients,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Erreur de récupération des clients.',
      });
    }
  }

  /**
   * Admin: Retrieves aggregated dashboard statistics.
   * GET /api/admin/stats
   */
  static async getStats(_req: AuthRequest, res: Response) {
    try {
      const stats = await AdminService.getDashboardStats();
      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Erreur de récupération des statistiques.',
      });
    }
  }

  /**
   * Admin: Get complete dashboard with notifications (pending items)
   * GET /api/admin/dashboard
   */
  static async getDashboard(_req: AuthRequest, res: Response) {
    try {
      const statsData = await AdminService.getDashboardStats();
      const pendingDevis = await DevisService.getPendingDevis();
      const pendingReclamations = await ReclamationService.getPendingReclamations();

      return res.status(200).json({
        success: true,
        data: {
          stats: statsData.stats,
          notifications: {
            pendingDevis: {
              count: pendingDevis.length,
              items: pendingDevis.slice(0, 10), // Limit for performance
            },
            pendingReclamations: {
              count: pendingReclamations.length,
              items: pendingReclamations.slice(0, 10),
            },
            totalPending: pendingDevis.length + pendingReclamations.length,
          },
          lastUpdated: new Date().toISOString(),
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Erreur de récupération du tableau de bord.',
      });
    }
  }

  /**
   * Admin: Get notification summary (for badge count)
   * GET /api/admin/notifications
   */
  static async getNotifications(_req: AuthRequest, res: Response) {
    try {
      const pendingDevis = await DevisService.getPendingDevis();
      const pendingReclamations = await ReclamationService.getPendingReclamations();

      return res.status(200).json({
        success: true,
        data: {
          notifications: {
            devis: {
              pending: pendingDevis.length,
              items: pendingDevis.slice(0, 5),
            },
            reclamations: {
              pending: pendingReclamations.length,
              items: pendingReclamations.slice(0, 5),
            },
            total: pendingDevis.length + pendingReclamations.length,
          },
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Erreur de récupération des notifications.',
      });
    }
  }

  /**
   * Admin: Validate a devis
   * PUT /api/admin/devis/:id/validate
   */
  static async validateDevis(req: AuthRequest, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'ID de devis invalide.' });
      }

      const result = await DevisService.validateDevis(id);
      return res.status(200).json({
        success: true,
        message: 'Devis validé avec succès !',
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de la validation du devis.',
      });
    }
  }

  /**
   * Admin: Refuse a devis with reason
   * PUT /api/admin/devis/:id/refuse
   */
  static async refuseDevis(req: AuthRequest, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { motifRefus } = req.body;

      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'ID de devis invalide.' });
      }
      if (!motifRefus) {
        return res.status(400).json({ success: false, message: 'Le motif de refus est requis.' });
      }

      const result = await DevisService.refuseDevis(id, motifRefus);
      return res.status(200).json({
        success: true,
        message: 'Devis refusé avec succès !',
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors du refus du devis.',
      });
    }
  }

  /**
   * Admin: Process a reclamation
   * PUT /api/admin/reclamations/:id/process
   */
  static async processReclamation(req: AuthRequest, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { reponseAdmin } = req.body;

      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'ID de réclamation invalide.' });
      }
      if (!reponseAdmin) {
        return res.status(400).json({ success: false, message: 'La réponse admin est requise.' });
      }

      const result = await ReclamationService.processReclamation(id, {
        statut: 'TRAITE',
        reponseAdmin,
      });

      return res.status(200).json({
        success: true,
        message: 'Réclamation traitée avec succès !',
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors du traitement de la réclamation.',
      });
    }
  }
}