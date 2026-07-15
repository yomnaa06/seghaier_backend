import prisma from '../config/db';

export class DevisService {
  /**
   * Creates a new Devis request for a Client.
   */
  static async createDevis(clientId: number, data: { brancheContact: string; produitDesire: string; description: string }) {
    // Verify client exists
    const clientExists = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!clientExists) {
      throw new Error('Client introuvable.');
    }

    return prisma.devis.create({
      data: {
        clientId: clientId,
        brancheContact: data.brancheContact,
        produitDesire: data.produitDesire,
        description: data.description,
        statut: 'EN_ATTENTE',
      },
    });
  }

  /**
   * Gets the list of Devis requested by a specific Client.
   */
  static async getClientDevis(clientId: number) {
    return prisma.devis.findMany({
      where: { clientId: clientId },
      orderBy: { dateDemande: 'desc' },
    });
  }

  /**
   * Gets all Devis requests (for Admin).
   */
  static async getAllDevis() {
    return prisma.devis.findMany({
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

  /**
   * Gets pending Devis (EN_ATTENTE) for Admin notifications
   */
  static async getPendingDevis() {
    return prisma.devis.findMany({
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

  /**
   * Gets a specific Devis by ID with client details
   */
  static async getDevisById(devisId: number) {
    const devis = await prisma.devis.findUnique({
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

  /**
   * Validates a Devis (sets status to Valide).
   */
  static async validateDevis(devisId: number) {
    const devis = await prisma.devis.findUnique({
      where: { id: devisId },
    });

    if (!devis) {
      throw new Error('Devis introuvable.');
    }

    return prisma.devis.update({
      where: { id: devisId },
      data: {
        statut: 'VALIDE',
        dateTraitement: new Date(),
      },
    });
  }

  /**
   * Refuses a Devis (sets status to Refus with reason).
   */
  static async refuseDevis(devisId: number, motifRefus: string) {
    const devis = await prisma.devis.findUnique({
      where: { id: devisId },
    });

    if (!devis) {
      throw new Error('Devis introuvable.');
    }

    if (!motifRefus) {
      throw new Error('Le motif de refus est requis.');
    }

    return prisma.devis.update({
      where: { id: devisId },
      data: {
        statut: 'REFUS',
        dateTraitement: new Date(),
        motifRefus: motifRefus,
      },
    });
  }

  /**
   * Admin: Delete a devis
   */
  static async deleteDevis(devisId: number) {
    const devis = await prisma.devis.findUnique({
      where: { id: devisId }
    });

    if (!devis) {
      throw new Error('Devis non trouvé.');
    }

    return prisma.devis.delete({
      where: { id: devisId }
    });
  }

  /**
   * Admin: Get devis statistics for dashboard
   */
  static async getDevisStats() {
    const [total, enAttente, valide, refus, enCours] = await Promise.all([
      prisma.devis.count(),
      prisma.devis.count({ where: { statut: 'EN_ATTENTE' } }),
      prisma.devis.count({ where: { statut: 'VALIDE' } }),
      prisma.devis.count({ where: { statut: 'REFUS' } }),
      prisma.devis.count({ where: { statut: 'EN_COURS' } })
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