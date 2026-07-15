"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReclamationController = void 0;
const reclamationService_1 = require("../services/reclamationService");
class ReclamationController {
    /**
     * Client: Create a new reclamation
     * POST /api/reclamations
     */
    static async create(req, res) {
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
            const reclamation = await reclamationService_1.ReclamationService.createReclamation(clientId, {
                destinataire,
                sujet,
                description,
            });
            return res.status(201).json({
                success: true,
                message: 'Réclamation déposée avec succès.',
                data: reclamation,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || 'Erreur lors de la création de la réclamation.',
            });
        }
    }
    /**
     * Client: Get their own reclamations history
     * GET /api/reclamations/my
     */
    static async getClientHistory(req, res) {
        try {
            const clientId = req.user?.userId;
            if (!clientId) {
                return res.status(401).json({ success: false, message: 'Non authentifié.' });
            }
            const reclamations = await reclamationService_1.ReclamationService.getClientReclamations(clientId);
            return res.status(200).json({ success: true, data: reclamations });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || 'Erreur de récupération de l’historique.',
            });
        }
    }
    /**
     * Admin: Get all reclamations
     * GET /api/admin/reclamations
     */
    static async listAll(_req, res) {
        try {
            const reclamations = await reclamationService_1.ReclamationService.getAllReclamations();
            return res.status(200).json({ success: true, data: reclamations });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || 'Erreur de récupération des réclamations.',
            });
        }
    }
    /**
     * Admin: Get pending reclamations
     * GET /api/admin/reclamations/pending
     */
    static async listPending(_req, res) {
        try {
            const reclamations = await reclamationService_1.ReclamationService.getPendingReclamations();
            return res.status(200).json({ success: true, data: reclamations });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || 'Erreur de récupération des réclamations en attente.',
            });
        }
    }
    /**
     * Admin: Process (update) a reclamation
     * PUT /api/admin/reclamations/:id/process
     */
    static async process(req, res) {
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
            const validStatuses = ['EN_ATTENTE', 'EN_COURS', 'TRAITE'];
            if (!validStatuses.includes(statut)) {
                return res.status(400).json({ success: false, message: 'Statut invalide.' });
            }
            const updatedReclamation = await reclamationService_1.ReclamationService.processReclamation(reclamationId, {
                statut: statut,
                reponseAdmin: reponseAdmin.trim(),
            });
            return res.status(200).json({
                success: true,
                message: 'Réclamation traitée avec succès.',
                data: updatedReclamation,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || 'Erreur lors du traitement de la réclamation.',
            });
        }
    }
}
exports.ReclamationController = ReclamationController;
