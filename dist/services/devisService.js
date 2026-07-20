"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevisService = void 0;
const db_1 = __importDefault(require("../config/db"));
class DevisService {
    //creation d'un nouveau devis pour client donné
    static async createDevis(clientId, data) {
        // Verification que  client exists
        const clientExists = await db_1.default.client.findUnique({
            where: { id: clientId },
        });
        if (!clientExists) {
            throw new Error('Client introuvable.');
        }
        return db_1.default.devis.create({
            data: {
                clientId: clientId,
                brancheContact: data.brancheContact,
                produitDesire: data.produitDesire,
                description: data.description,
                statut: 'EN_ATTENTE',
            },
        });
    }
    // yekhou liste de devis requested by a speciic client
    static async getClientDevis(clientId) {
        return db_1.default.devis.findMany({
            where: { clientId: clientId },
            orderBy: { dateDemande: 'desc' },
        });
    }
    // get all devis requests for admin
    static async getAllDevis() {
        return db_1.default.devis.findMany({
            include: {
                client: {
                    select: {
                        nom: true,
                        telephone: true,
                    },
                },
            },
            orderBy: { dateDemande: 'desc' },
        });
    }
    // prend devis en attente pour admin dashboard
    static async getPendingDevis() {
        return db_1.default.devis.findMany({
            where: { statut: 'EN_ATTENTE' },
            include: {
                client: {
                    include: {
                        user: {
                            select: {
                                email: true,
                            },
                        },
                    },
                    select: {
                        nom: true,
                        telephone: true,
                        adresse: true,
                        ville: true,
                    },
                },
            },
            orderBy: { dateDemande: 'asc' },
        });
    }
    // get specific devis by id for client 
    static async getDevisById(devisId) {
        const devis = await db_1.default.devis.findUnique({
            where: { id: devisId },
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
        if (!devis) {
            throw new Error('Devis introuvable.');
        }
        return devis;
    }
    // valider devis
    static async validateDevis(devisId) {
        const devis = await db_1.default.devis.findUnique({
            where: { id: devisId },
        });
        if (!devis) {
            throw new Error('Devis introuvable.');
        }
        return db_1.default.devis.update({
            where: { id: devisId },
            data: {
                statut: 'VALIDE',
                dateTraitement: new Date(),
            },
        });
    }
    // refuser devis
    static async refuseDevis(devisId, motifRefus) {
        const devis = await db_1.default.devis.findUnique({
            where: { id: devisId },
        });
        if (!devis) {
            throw new Error('Devis introuvable.');
        }
        if (!motifRefus) {
            throw new Error('Le motif de refus est requis.');
        }
        return db_1.default.devis.update({
            where: { id: devisId },
            data: {
                statut: 'REFUS',
                dateTraitement: new Date(),
                motifRefus: motifRefus,
            },
        });
    }
    // admin efface devis
    static async deleteDevis(devisId) {
        const devis = await db_1.default.devis.findUnique({
            where: { id: devisId }
        });
        if (!devis) {
            throw new Error('Devis non trouvé.');
        }
        return db_1.default.devis.delete({
            where: { id: devisId }
        });
    }
    // admin prend devis statistiques pour dashboard
    static async getDevisStats() {
        const [total, enAttente, valide, refus, enCours] = await Promise.all([
            db_1.default.devis.count(),
            db_1.default.devis.count({ where: { statut: 'EN_ATTENTE' } }),
            db_1.default.devis.count({ where: { statut: 'VALIDE' } }),
            db_1.default.devis.count({ where: { statut: 'REFUS' } }),
            db_1.default.devis.count({ where: { statut: 'EN_COURS' } })
        ]);
        return {
            total,
            enAttente,
            valide,
            refus,
            enCours
        };
    }
}
exports.DevisService = DevisService;
