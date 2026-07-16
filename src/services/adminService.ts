import prisma from '../config/db';

export class AdminService {
 // récupération de liste de tous les clients enregistrés
  static async getClientsList() {
    return prisma.client.findMany({
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
    const totalClients = await prisma.client.count();

    // Devis stats (total + count par status)
    const devisCount = await prisma.devis.count();
    const devisByStatus = await prisma.devis.groupBy({
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
    const reclamationCount = await prisma.reclamation.count();
    const reclamationByStatus = await prisma.reclamation.groupBy({
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
