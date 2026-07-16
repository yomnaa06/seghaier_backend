import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { ReclamationService } from '../services/reclamationService';
import { StatutReclamation } from '@prisma/client';

export class ReclamationController {
  // Client: Create a new reclamation
  //POST /api/reclamations
  static async create(req: AuthRequest, res: Response) {
    try {
      const clientId = req.user?.userId;
      if (!clientId) {
        return res.status(401).json({ success: false, message: 'Non authentifié.' });
      }

      const { destinataire, sujet, description } = req.body;

      if (!destinataire || !sujet || !description) {
        return res.status(400).json({
          success: false,
          message: 'Les champs destinataire, sujet et description sont obligatoires.',
        });
      }

      const reclamation = await ReclamationService.createReclamation(clientId, {
        destinataire,
        sujet,
        description,
      });

      return res.status(201).json({
        success: true,
        message: 'Réclamation déposée avec succès.',
        data: reclamation,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de la création de la réclamation.',
      });
    }
  }

  // Client: Get their own reclamations historique
  // GET /api/reclamations/my
  static async getClientHistory(req: AuthRequest, res: Response) {
    try {
      const clientId = req.user?.userId;
      if (!clientId) {
        return res.status(401).json({ success: false, message: 'Non authentifié.' });
      }

      const reclamations = await ReclamationService.getClientReclamations(clientId);
      return res.status(200).json({ success: true, data: reclamations });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Erreur de récupération de l’historique.',
      });
    }
  }

  // Admin: Get all reclamations
  // GET /api/admin/reclamations
  static async listAll(_req: AuthRequest, res: Response) {
    try {
      const reclamations = await ReclamationService.getAllReclamations();
      return res.status(200).json({ success: true, data: reclamations });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Erreur de récupération des réclamations.',
      });
    }
  }

  // Admin: Get pending reclamations
  // GET /api/admin/reclamations/pending
   
  static async listPending(_req: AuthRequest, res: Response) {
    try {
      const reclamations = await ReclamationService.getPendingReclamations();
      return res.status(200).json({ success: true, data: reclamations });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Erreur de récupération des réclamations en attente.',
      });
    }
  }

  // Admin: update une reclamation
  // PUT /api/admin/reclamations/:id/process
  static async process(req: AuthRequest, res: Response) {
    try {
      const reclamationId = parseInt(req.params.id, 10);
      const { statut, reponseAdmin } = req.body;

      if (isNaN(reclamationId)) {
        return res.status(400).json({ success: false, message: 'ID de réclamation invalide.' });
      }

      if (!statut || !reponseAdmin?.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Le statut et la réponse admin sont obligatoires.',
        });
      }

      const validStatuses: StatutReclamation[] = ['EN_ATTENTE', 'EN_COURS', 'TRAITE'];
      if (!validStatuses.includes(statut as StatutReclamation)) {
        return res.status(400).json({ success: false, message: 'Statut invalide.' });
      }

      const updatedReclamation = await ReclamationService.processReclamation(reclamationId, {
        statut: statut as StatutReclamation,
        reponseAdmin: reponseAdmin.trim(),
      });

      return res.status(200).json({
        success: true,
        message: 'Réclamation traitée avec succès.',
        data: updatedReclamation,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors du traitement de la réclamation.',
      });
    }
  }
}