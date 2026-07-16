import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { DevisService } from '../services/devisService';

export class DevisController {
  // Client: Creation d'une nouvelle demande de devis
  // POST /api/devis
  static async create(req: AuthRequest, res: Response) {
    try {
      const clientId = req.user?.userId;
      if (!clientId) {
        return res.status(401).json({ success: false, message: 'Non authentifié.' });
      }

      const { brancheContact, produitDesire, description } = req.body;

      if (!brancheContact || !produitDesire || !description) {
        return res.status(400).json({
          success: false,
          message: 'Les champs brancheContact, produitDesire et description sont obligatoires.',
        });
      }

      const devis = await DevisService.createDevis(clientId, {
        brancheContact,
        produitDesire,
        description,
      });

      return res.status(201).json({
        success: true,
        message: 'Demande de devis créée avec succès.',
        data: devis,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de la création du devis.',
      });
    }
  }

  // Client: récupération de l'historique de leurs devis 
  //GET /api/devis/my
  static async getClientHistory(req: AuthRequest, res: Response) {
    try {
      const clientId = req.user?.userId;
      if (!clientId) {
        return res.status(401).json({ success: false, message: 'Non authentifié.' });
      }

      const devisList = await DevisService.getClientDevis(clientId);
      return res.status(200).json({ success: true, data: devisList });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Erreur de récupération de l’historique.',
      });
    }
  }

 // Client: Get a specific devis by ID
 // GET /api/devis/:id
  static async getOne(req: AuthRequest, res: Response) {
    try {
      const devisId = parseInt(req.params.id, 10);
      if (isNaN(devisId)) {
        return res.status(400).json({ success: false, message: 'ID de devis invalide.' });
      }

      const devis = await DevisService.getDevisById(devisId);
      return res.status(200).json({ success: true, data: devis });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de la récupération du devis.',
      });
    }
  }

  // Admin: Get all devis requests
  // GET /api/admin/devis
  static async listAll(_req: AuthRequest, res: Response) {
    try {
      const devisList = await DevisService.getAllDevis();
      return res.status(200).json({ success: true, data: devisList });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Erreur de récupération des devis.',
      });
    }
  }

 // Admin: Valider un devis
 // PUT /api/admin/devis/:id/validate
  static async validate(req: AuthRequest, res: Response) {
    try {
      const devisId = parseInt(req.params.id, 10);
      if (isNaN(devisId)) {
        return res.status(400).json({ success: false, message: 'ID de devis invalide.' });
      }

      const updatedDevis = await DevisService.validateDevis(devisId);
      return res.status(200).json({
        success: true,
        message: 'Devis validé avec succès.',
        data: updatedDevis,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de la validation du devis.',
      });
    }
  }

  // Admin: Refuser undevis avec motif
  // PUT /api/admin/devis/:id/refuse
  static async refuse(req: AuthRequest, res: Response) {
    try {
      const devisId = parseInt(req.params.id, 10);
      const { motifRefus } = req.body;

      if (isNaN(devisId)) {
        return res.status(400).json({ success: false, message: 'ID de devis invalide.' });
      }
      if (!motifRefus?.trim()) {
        return res.status(400).json({ success: false, message: 'Le motif de refus est requis.' });
      }

      const updatedDevis = await DevisService.refuseDevis(devisId, motifRefus.trim());
      return res.status(200).json({
        success: true,
        message: 'Devis refusé avec succès.',
        data: updatedDevis,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors du refus du devis.',
      });
    }
  }

  // Admin: Delete a devis
  // DELETE /api/admin/devis/:id
  static async delete(req: AuthRequest, res: Response) {
    try {
      const devisId = parseInt(req.params.id, 10);
      if (isNaN(devisId)) {
        return res.status(400).json({ success: false, message: 'ID de devis invalide.' });
      }

      await DevisService.deleteDevis(devisId);
      return res.status(200).json({
        success: true,
        message: 'Devis supprimé avec succès.',
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de la suppression du devis.',
      });
    }
  }

  // Admin: Get devis statistiques
  // GET /api/admin/devis/stats
  static async getStats(_req: AuthRequest, res: Response) {
    try {
      const stats = await DevisService.getDevisStats();
      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de la récupération des statistiques.',
      });
    }
  }
}