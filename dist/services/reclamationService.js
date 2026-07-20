"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReclamationService = void 0;
const db_1 = __importDefault(require("../config/db"));
class ReclamationService {
    // creation d'une noiuvelle reclamation client
    static async createReclamation(clientId, data) {
        // Verify client exists
        const clientExists = await db_1.default.client.findUnique({
            where: { id: clientId },
        });
        if (!clientExists) {
            throw new Error('Client introuvable.');
        }
        return db_1.default.reclamation.create({
            data: {
                clientId: clientId,
                destinataire: data.destinataire,
                sujet: data.sujet,
                description: data.description,
                statut: 'EN_ATTENTE',
            },
        });
    }
    // récupération historique reclamations d'un client
    static async getClientReclamations(clientId) {
        return db_1.default.reclamation.findMany({
            where: { clientId: clientId },
            orderBy: { date: 'desc' },
        });
    }
    // récupération de toutes les réclamations par l'admin
    static async getAllReclamations() {
        return db_1.default.reclamation.findMany({
            include: {
                client: {
                    select: {
                        nom: true,
                        telephone: true,
                    },
                },
            },
            orderBy: { date: 'desc' },
        });
    }
    // récupération de toutes les réclamations en attente ou en cours par l'admin
    static async getPendingReclamations() {
        return db_1.default.reclamation.findMany({
            where: {
                statut: {
                    in: ['EN_ATTENTE', 'EN_COURS'],
                },
            },
            include: {
                client: {
                    select: {
                        nom: true,
                        telephone: true,
                    },
                },
            },
            orderBy: { date: 'asc' },
        });
    }
    // get a specific reclamation by id for admin
    static async getReclamationById(reclamationId) {
        const reclamation = await db_1.default.reclamation.findUnique({
            where: { id: reclamationId },
            include: {
                client: {
                    include: {
                        user: {
                            select: {
                                email: true,
                            },
                        },
                    },
                },
            },
        });
        if (!reclamation) {
            throw new Error('Réclamation introuvable.');
        }
        return reclamation;
    }
    // processing reclamation by updating its status and adding admin response
    // mapped from "traiterReclamation(id, statut, reponse)" dans le diagramme de séquence
    static async processReclamation(reclamationId, data) {
        const reclamation = await db_1.default.reclamation.findUnique({
            where: { id: reclamationId },
        });
        if (!reclamation) {
            throw new Error('Réclamation introuvable.');
        }
        return db_1.default.reclamation.update({
            where: { id: reclamationId },
            data: {
                statut: data.statut,
                reponseAdmin: data.reponseAdmin,
            },
        });
    }
}
exports.ReclamationService = ReclamationService;
