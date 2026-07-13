import prisma from '../config/db';
import { StatutReclamation } from '@prisma/client';

export class ReclamationService {
  /**
   * Client: Creates a new Reclamation.
   */
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

  /**
   * Client: Retrieves complaints history for a specific Client.
   */
  static async getClientReclamations(clientId: number) {
    return prisma.reclamation.findMany({
      where: { clientId: clientId },
      orderBy: { date: 'desc' },
    });
  }

  /**
   * Admin: Retrieves all complaints.
   */
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

  /**
   * Admin: Retrieves complaints that are pending (En_attente or En_cours).
   * Mapped from "getReclamationsEnAttente()" in the Sequence Diagram.
   */
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
    /**
   * Admin: Gets a specific reclamation by ID with client details
   */
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

  /**
   * Admin: Processes a Reclamation by updating its status and response.
   * Mapped from "traiterReclamation(id, statut, reponse)" in the Sequence Diagram.
   */
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
