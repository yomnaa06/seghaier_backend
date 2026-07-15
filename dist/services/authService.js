"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const db_1 = __importDefault(require("../config/db"));
const crypto_1 = require("../utils/crypto");
const auth_1 = require("../utils/auth");
/**
 * Service for Authentication and User management
 */
class AuthService {
    /**
     * Registers a new Individual Client.
     */
    static async registerIndividual(data) {
        // Check if email already exists
        const existingUser = await db_1.default.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new Error('Email déjà utilisé.');
        }
        const hashedPassword = await (0, crypto_1.hashPassword)(data.password);
        // Run transaction
        return db_1.default.$transaction(async (tx) => {
            // 1. Create User
            const user = await tx.user.create({
                data: {
                    email: data.email,
                    password: hashedPassword,
                    role: 'CLIENT',
                    dateCreation: new Date(),
                },
            });
            // 2. creation du client de type individuel
            const client = await tx.client.create({
                data: {
                    id: user.id,
                    clientType: 'INDIVIDUEL',
                    nom: data.nom,
                    prenom: data.prenom,
                    telephone: data.telephone ?? '',
                    adresse: data.adresse ?? '',
                    codePostal: data.codePostal ?? '',
                    ville: data.ville ?? '',
                    brancheContact: data.brancheContact ?? '',
                    produitsInterets: data.produitsInterets ?? '',
                },
            });
            // Generate JWT token
            const token = (0, auth_1.generateToken)({ userId: user.id, role: user.role });
            return {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    clientType: client.clientType,
                    nom: client.nom,
                    prenom: client.prenom,
                    telephone: client.telephone,
                    adresse: client.adresse,
                    codePostal: client.codePostal,
                    ville: client.ville,
                    brancheContact: client.brancheContact,
                    produitsInterets: client.produitsInterets,
                },
            };
        });
    }
    /**
     * Registers a new Company Client.
     */
    static async registerCompany(data) {
        // Check if email already exists
        const existingUser = await db_1.default.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new Error('Email déjà utilisé.');
        }
        const hashedPassword = await (0, crypto_1.hashPassword)(data.password);
        // Run transaction
        return db_1.default.$transaction(async (tx) => {
            // 1. Create User
            const user = await tx.user.create({
                data: {
                    email: data.email,
                    password: hashedPassword,
                    role: 'CLIENT',
                    dateCreation: new Date(),
                },
            });
            // 2. Create Client profile with SOCIETE type
            const client = await tx.client.create({
                data: {
                    id: user.id,
                    clientType: 'SOCIETE',
                    nom: data.nomSociete,
                    telephone: data.telephone ?? '',
                    adresse: data.adresse ?? '',
                    codePostal: data.codePostal ?? '',
                    ville: data.ville ?? '',
                    matriculeFiscal: data.matriculeFiscal,
                    brancheContact: data.brancheContact ?? '',
                    produitsInterets: data.produitsInterets ?? '',
                },
            });
            // Generate JWT token
            const token = (0, auth_1.generateToken)({ userId: user.id, role: user.role });
            return {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    clientType: client.clientType,
                    nom: client.nom,
                    telephone: client.telephone,
                    adresse: client.adresse,
                    codePostal: client.codePostal,
                    ville: client.ville,
                    matriculeFiscal: client.matriculeFiscal,
                    brancheContact: client.brancheContact,
                    produitsInterets: client.produitsInterets,
                },
            };
        });
    }
    /**
     * Authenticates a User (Client or Admin) and returns a JWT token.
     */
    static async loginUser(data) {
        const user = await db_1.default.user.findUnique({
            where: { email: data.email },
            include: {
                client: true,
                admin: true,
            },
        });
        if (!user) {
            throw new Error('Identifiants incorrects.');
        }
        if (data.clientType === 'ADMIN') {
            if (user.role !== 'ADMIN') {
                throw new Error('Ce compte n\'est pas un compte administrateur.');
            }
        }
        else if (data.clientType === 'CLIENT') {
            if (!user.client) {
                throw new Error('Ce compte n\'est pas un compte client.');
            }
        }
        else if (data.clientType && user.client && user.client.clientType !== data.clientType) {
            throw new Error(`Ce compte est un ${user.client.clientType === 'INDIVIDUEL' ? 'client individuel' : 'compte société'}. Veuillez utiliser le bon formulaire de connexion.`);
        }
        const isPasswordValid = await (0, crypto_1.comparePassword)(data.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Identifiants incorrects.');
        }
        //generation des tokens
        const token = (0, auth_1.generateToken)({ userId: user.id, role: user.role });
        // reponse basée sur le role
        if (user.role === 'CLIENT' && user.client) {
            const client = user.client;
            let userData = {
                id: user.id,
                email: user.email,
                role: user.role,
                clientType: client.clientType,
                nom: client.nom,
                telephone: client.telephone,
                adresse: client.adresse,
                codePostal: client.codePostal,
                ville: client.ville,
                brancheContact: client.brancheContact,
                produitsInterets: client.produitsInterets,
            };
            if (client.clientType === 'INDIVIDUEL') {
                userData.prenom = client.prenom;
            }
            else {
                userData.matriculeFiscal = client.matriculeFiscal;
            }
            return {
                token,
                user: userData,
            };
        }
        else if (user.role === 'ADMIN' && user.admin) {
            return {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    username: user.admin.username,
                    nom: user.admin.nom,
                    prenom: user.admin.prenom,
                },
            };
        }
        throw new Error('Profil utilisateur non trouvé.');
    }
    /**
     * Retrieves profile details for a client.
     */
    static async getClientProfile(userId) {
        const client = await db_1.default.client.findUnique({
            where: { id: userId },
            include: {
                user: {
                    select: {
                        email: true,
                        dateCreation: true,
                    },
                },
            },
        });
        if (!client) {
            throw new Error('Profil client introuvable.');
        }
        return {
            id: client.id,
            email: client.user.email,
            clientType: client.clientType,
            nom: client.nom,
            prenom: client.prenom,
            telephone: client.telephone,
            adresse: client.adresse,
            codePostal: client.codePostal,
            ville: client.ville,
            matriculeFiscal: client.matriculeFiscal,
            brancheContact: client.brancheContact,
            produitsInterets: client.produitsInterets,
            dateCreation: client.user.dateCreation,
        };
    }
    /**
     * Updates profile details for a client.
     */
    static async updateClientProfile(userId, data) {
        const client = await db_1.default.client.findUnique({
            where: { id: userId },
        });
        if (!client) {
            throw new Error('Profil client introuvable.');
        }
        const updatedClient = await db_1.default.client.update({
            where: { id: userId },
            data: {
                nom: data.nom ?? client.nom,
                prenom: data.prenom ?? client.prenom,
                telephone: data.telephone ?? client.telephone,
                adresse: data.adresse ?? client.adresse,
                codePostal: data.codePostal ?? client.codePostal,
                ville: data.ville ?? client.ville,
                brancheContact: data.brancheContact ?? client.brancheContact,
                produitsInterets: data.produitsInterets ?? client.produitsInterets,
                dateModification: new Date(),
            },
        });
        return updatedClient;
    }
    /**
     * Gets client type info for registration forms
     */
    static async getClientTypes() {
        return {
            INDIVIDUEL: {
                label: 'Client Particulier',
                fields: ['nom', 'prenom', 'email', 'password', 'telephone', 'adresse', 'codePostal', 'ville', 'brancheContact', 'produitsInterets']
            },
            SOCIETE: {
                label: 'Société',
                fields: ['nomSociete', 'email', 'password', 'matriculeFiscal', 'telephone', 'adresse', 'codePostal', 'ville', 'brancheContact', 'produitsInterets']
            }
        };
    }
    /**
   * Generate password reset token
   */
    static async generateResetToken(email) {
        const user = await db_1.default.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new Error('Aucun compte trouvé avec cet email.');
        }
        // Generate reset token
        const crypto = await Promise.resolve().then(() => __importStar(require('crypto')));
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
        await db_1.default.user.update({
            where: { email },
            data: {
                resetToken,
                resetTokenExpiry,
            },
        });
        return resetToken;
    }
    /**
     * Reset password using token
     */
    static async resetPassword(token, newPassword) {
        const user = await db_1.default.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: {
                    gt: new Date(), // Token not expired
                },
            },
        });
        if (!user) {
            throw new Error('Token invalide ou expiré.');
        }
        const hashedPassword = await (0, crypto_1.hashPassword)(newPassword);
        await db_1.default.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });
        return { success: true, message: 'Mot de passe réinitialisé avec succès.' };
    }
}
exports.AuthService = AuthService;
