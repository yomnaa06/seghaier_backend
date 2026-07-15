"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevisController = void 0;
const devisService_1 = require("../services/devisService");
class DevisController {
    /**
     * Client: Create a new Devis request
     * POST /api/devis
     */
    static async create(req, res) {
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
            const devis = await devisService_1.DevisService.createDevis(clientId, {
                brancheContact,
                produitDesire,
                description,
            });
            return res.status(201).json({
                success: true,
                message: 'Demande de devis créée avec succès.',
                data: devis,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || 'Erreur lors de la création du devis.',
            });
        }
    }
    /**
     * Client: Get their own devis history
     * GET /api/devis/my
     */
    static async getClientHistory(req, res) {
        try {
            const clientId = req.user?.userId;
            if (!clientId) {
                return res.status(401).json({ success: false, message: 'Non authentifié.' });
            }
            const devisList = await devisService_1.DevisService.getClientDevis(clientId);
            return res.status(200).json({ success: true, data: devisList });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || 'Erreur de récupération de l’historique.',
            });
        }
    }
    /**
     * Client: Get a single devis by ID
     * GET /api/devis/:id
     */
    static async getOne(req, res) {
        try {
            const devisId = parseInt(req.params.id, 10);
            if (isNaN(devisId)) {
                return res.status(400).json({ success: false, message: 'ID de devis invalide.' });
            }
            const devis = await devisService_1.DevisService.getDevisById(devisId);
            return res.status(200).json({ success: true, data: devis });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || 'Erreur lors de la récupération du devis.',
            });
        }
    }
    /**
     * Admin: Get all devis requests
     * GET /api/admin/devis
     */
    static async listAll(_req, res) {
        try {
            const devisList = await devisService_1.DevisService.getAllDevis();
            return res.status(200).json({ success: true, data: devisList });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || 'Erreur de récupération des devis.',
            });
        }
    }
    /**
     * Admin: Validate a devis
     * PUT /api/admin/devis/:id/validate
     */
    static async validate(req, res) {
        try {
            const devisId = parseInt(req.params.id, 10);
            if (isNaN(devisId)) {
                return res.status(400).json({ success: false, message: 'ID de devis invalide.' });
            }
            const updatedDevis = await devisService_1.DevisService.validateDevis(devisId);
            return res.status(200).json({
                success: true,
                message: 'Devis validé avec succès.',
                data: updatedDevis,
            });
        }
        catch (error) {
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
    static async refuse(req, res) {
        try {
            const devisId = parseInt(req.params.id, 10);
            const { motifRefus } = req.body;
            if (isNaN(devisId)) {
                return res.status(400).json({ success: false, message: 'ID de devis invalide.' });
            }
            if (!motifRefus?.trim()) {
                return res.status(400).json({ success: false, message: 'Le motif de refus est requis.' });
            }
            const updatedDevis = await devisService_1.DevisService.refuseDevis(devisId, motifRefus.trim());
            return res.status(200).json({
                success: true,
                message: 'Devis refusé avec succès.',
                data: updatedDevis,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || 'Erreur lors du refus du devis.',
            });
        }
    }
    /**
     * Admin: Delete a devis
     * DELETE /api/admin/devis/:id
     */
    static async delete(req, res) {
        try {
            const devisId = parseInt(req.params.id, 10);
            if (isNaN(devisId)) {
                return res.status(400).json({ success: false, message: 'ID de devis invalide.' });
            }
            await devisService_1.DevisService.deleteDevis(devisId);
            return res.status(200).json({
                success: true,
                message: 'Devis supprimé avec succès.',
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || 'Erreur lors de la suppression du devis.',
            });
        }
    }
    /**
     * Admin: Get devis statistics
     * GET /api/admin/devis/stats
     */
    static async getStats(_req, res) {
        try {
            const stats = await devisService_1.DevisService.getDevisStats();
            return res.status(200).json({
                success: true,
                data: stats,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || 'Erreur lors de la récupération des statistiques.',
            });
        }
    }
}
exports.DevisController = DevisController;
