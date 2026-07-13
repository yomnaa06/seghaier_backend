import prisma from '../config/db';
import { hashPassword, comparePassword } from '../utils/crypto';
import { generateToken } from '../utils/auth';

/**
 * Service for Authentication and User management
 */
export class AuthService {
  /**
   * Registers a new Individual Client.
   */
  static async registerIndividual(data: {
    email: string;
    password: string;
    nom: string;
    prenom: string;
    telephone?: string;
    adresse?: string;
    codePostal?: string;
    ville?: string;
    brancheContact?: string;
    produitsInterets?: string;
  }) {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('Email déjà utilisé.');
    }

    const hashedPassword = await hashPassword(data.password);

    // Run transaction
    return prisma.$transaction(async (tx) => {
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
      const token = generateToken({ userId: user.id, role: user.role });

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
  static async registerCompany(data: {
    email: string;
    password: string;
    nomSociete: string;
    telephone?: string;
    adresse?: string;
    codePostal?: string;
    ville?: string;
    matriculeFiscal: string;
    brancheContact?: string;
    produitsInterets?: string;
  }) {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('Email déjà utilisé.');
    }

    const hashedPassword = await hashPassword(data.password);

    // Run transaction
    return prisma.$transaction(async (tx) => {
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
      const token = generateToken({ userId: user.id, role: user.role });

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
  static async loginUser(data: { email: string; password: string; clientType?: string }) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: {
        client: true,   
        admin: true,    
      },
    });

    if (!user) {
      throw new Error('Identifiants incorrects.');
    }

    // If clientType is provided, verify it matches
    if (data.clientType && user.client && user.client.clientType !== data.clientType) {
      throw new Error(`Ce compte est un ${user.client.clientType === 'INDIVIDUEL' ? 'client individuel' : 'compte société'}. Veuillez utiliser le bon formulaire de connexion.`);
    }

    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Identifiants incorrects.');
    }


    // Generate JWT token
    const token = generateToken({ userId: user.id, role: user.role });

    // Format response based on role
    if (user.role === 'CLIENT' && user.client) {
      const client = user.client;
      
      // generer reponse selon type de client
      let userData: any = {
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
      } else {
        userData.matriculeFiscal = client.matriculeFiscal;
      }

      return {
        token,
        user: userData,
      };
    } else if (user.role === 'ADMIN' && user.admin) {
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
  static async getClientProfile(userId: number) {
    const client = await prisma.client.findUnique({
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
  static async updateClientProfile(
    userId: number,
    data: {
      nom?: string;
      prenom?: string;
      telephone?: string;
      adresse?: string;
      codePostal?: string;
      ville?: string;
      brancheContact?: string;
      produitsInterets?: string;
    }
  ) {
    const client = await prisma.client.findUnique({
      where: { id: userId },
    });

    if (!client) {
      throw new Error('Profil client introuvable.');
    }

    const updatedClient = await prisma.client.update({
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
}