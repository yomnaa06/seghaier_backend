import prisma from '../config/db';
import { StatutReclamation } from '@prisma/client';

export class ReclamationService {
  // creation d'une noiuvelle reclamation client
  static async createReclamation(clientId: number, data: { destinataire: string; sujet: string; description: string }) {
    // Verify client exists
    const clientExists = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!clientExists) {
      throw new Error('Client introuvable.');
    }

    return prisma.reclamation.create({
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
  static async getClientReclamations(clientId: number) {
    return prisma.reclamation.findMany({
      where: { clientId: clientId },
      orderBy: { date: 'desc' },
    });
  }

  // récupération de toutes les réclamations par l'admin
  static async getAllReclamations() {
    return prisma.reclamation.findMany({
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
    return prisma.reclamation.findMany({
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
  static async getReclamationById(reclamationId: number) {
    const reclamation = await prisma.reclamation.findUnique({
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
  static async processReclamation(
    reclamationId: number,
    data: { statut: StatutReclamation; reponseAdmin: string }
  ) {
    const reclamation = await prisma.reclamation.findUnique({
      where: { id: reclamationId },
    });

    if (!reclamation) {
      throw new Error('Réclamation introuvable.');
    }

    return prisma.reclamation.update({
      where: { id: reclamationId },
      data: {
        statut: data.statut,
        reponseAdmin: data.reponseAdmin,
      },
    });
  }
}
