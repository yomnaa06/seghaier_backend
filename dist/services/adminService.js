"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const db_1 = __importDefault(require("../config/db"));
class AdminService {
    // récupération de liste de tous les clients enregistrés
    static async getClientsList() {
        return db_1.default.client.findMany({
            include: {
                user: {
                    select: {
                        email: true,
                        dateCreation: true,
                    },
                },
            },
            orderBy: { nom: 'asc' },
        });
    }
    // statistics pour admin dashboard
    static async getDashboardStats() {
        // Total Clients count
        const totalClients = await db_1.default.client.count();
        // Devis stats (total + count par status)
        const devisCount = await db_1.default.devis.count();
        const devisByStatus = await db_1.default.devis.groupBy({
            by: ['statut'],
            _count: {
                id: true,
            },
        });
        const devisStats = {
            total: devisCount,
            EN_ATTENTE: devisByStatus.find((d) => d.statut === 'EN_ATTENTE')?._count.id || 0,
            VALIDE: devisByStatus.find((d) => d.statut === 'VALIDE')?._count.id || 0,
            REFUS: devisByStatus.find((d) => d.statut === 'REFUS')?._count.id || 0,
        };
        //  Reclamation stats (total + count par status)
        const reclamationCount = await db_1.default.reclamation.count();
        const reclamationByStatus = await db_1.default.reclamation.groupBy({
            by: ['statut'],
            _count: {
                id: true,
            },
        });
        const reclamationStats = {
            total: reclamationCount,
            EN_ATTENTE: reclamationByStatus.find((r) => r.statut === 'EN_ATTENTE')?._count.id || 0,
            EN_COURS: reclamationByStatus.find((r) => r.statut === 'EN_COURS')?._count.id || 0,
            TRAITE: reclamationByStatus.find((r) => r.statut === 'TRAITE')?._count.id || 0,
        };
        return {
            stats: {
                totalClients,
                devis: devisStats,
                reclamations: reclamationStats,
            },
        };
    }
}
exports.AdminService = AdminService;
