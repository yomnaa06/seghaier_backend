"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const adminService_1 = require("../services/adminService");
const devisService_1 = require("../services/devisService");
const reclamationService_1 = require("../services/reclamationService");
class AdminController {
    // Admin prend liste de tous les clients
    // GET /api/admin/clients
    static async getClients(_req, res) {
        try {
            const clients = await adminService_1.AdminService.getClientsList();
            return res.status(200).json({
                success: true,
                data: clients,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || 'Erreur de récupération des clients.',
            });
        }
    }
    // Admin yekhou dashboard statistics
    // GET /api/admin/stats
    static async getStats(_req, res) {
        try {
            const stats = await adminService_1.AdminService.getDashboardStats();
            return res.status(200).json({
                success: true,
                data: stats,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || 'Erreur de récupération des statistiques.',
            });
        }
    }
    // Admin gets complete dashboard with notifications 
    // GET /api/admin/dashboard
    static async getDashboard(_req, res) {
        try {
            const statsData = await adminService_1.AdminService.getDashboardStats();
            const pendingDevis = await devisService_1.DevisService.getPendingDevis();
            const pendingReclamations = await reclamationService_1.ReclamationService.getPendingReclamations();
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
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || 'Erreur de récupération du tableau de bord.',
            });
        }
    }
    // Admin recoit sommaire de notificatuons
    // GET /api/admin/notifications
    static async getNotifications(_req, res) {
        try {
            const pendingDevis = await devisService_1.DevisService.getPendingDevis();
            const pendingReclamations = await reclamationService_1.ReclamationService.getPendingReclamations();
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
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || 'Erreur de récupération des notifications.',
            });
        }
    }
    // Admin Valide un devis
    // PUT /api/admin/devis/:id/validate
    static async validateDevis(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ success: false, message: 'ID de devis invalide.' });
            }
            const result = await devisService_1.DevisService.validateDevis(id);
            return res.status(200).json({
                success: true,
                message: 'Devis validé avec succès !',
                data: result,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || 'Erreur lors de la validation du devis.',
            });
        }
    }
    // Admin Refuse un devis avec motif
    // PUT /api/admin/devis/:id/refuse
    static async refuseDevis(req, res) {
        try {
            const id = parseInt(req.params.id);
            const { motifRefus } = req.body;
            if (isNaN(id)) {
                return res.status(400).json({ success: false, message: 'ID de devis invalide.' });
            }
            if (!motifRefus) {
                return res.status(400).json({ success: false, message: 'Le motif de refus est requis.' });
            }
            const result = await devisService_1.DevisService.refuseDevis(id, motifRefus);
            return res.status(200).json({
                success: true,
                message: 'Devis refusé avec succès !',
                data: result,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || 'Erreur lors du refus du devis.',
            });
        }
    }
    //Admin Processes une reclamation
    //PUT /api/admin/reclamations/:id/process
    static async processReclamation(req, res) {
        try {
            const id = parseInt(req.params.id);
            const { reponseAdmin } = req.body;
            if (isNaN(id)) {
                return res.status(400).json({ success: false, message: 'ID de réclamation invalide.' });
            }
            if (!reponseAdmin) {
                return res.status(400).json({ success: false, message: 'La réponse admin est requise.' });
            }
            const result = await reclamationService_1.ReclamationService.processReclamation(id, {
                statut: 'TRAITE',
                reponseAdmin,
            });
            return res.status(200).json({
                success: true,
                message: 'Réclamation traitée avec succès !',
                data: result,
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
exports.AdminController = AdminController;
