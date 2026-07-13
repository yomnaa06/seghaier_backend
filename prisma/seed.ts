import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
//msg to appear to terminal wakt running the seed script
async function main() {
  console.log('[Seed]: Starting database seeding...');

  // Hashing passwords
  const adminPasswordHash = await bcrypt.hash('adminpassword', 10);
  const clientPasswordHash = await bcrypt.hash('clientpassword', 10);

  // deleting old test data before importing new ones in correct order of dependency child kbal bad parent
  console.log('[Seed]: Cleaning database...');
  await prisma.devis.deleteMany();
  await prisma.reclamation.deleteMany();
  await prisma.client.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.user.deleteMany();
  console.log('[Seed]: Database cleaned...');

  // Creation d'Admin
  console.log('[Seed]: Creating admin user...');
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@seghaier.com',
      password: adminPasswordHash,
      role: 'ADMIN',
      dateCreation: new Date()
    },
  });
  await prisma.admin.create({
    data: {
      userId: adminUser.id,
      username: 'admin_seghaier',
    },
  });

  // Creation des clients
  console.log('[Seed]: Creating client users...');
  
  // Client 1
  const clientUser1 = await prisma.user.create({
    data: {
      email: 'client1@gmail.com',
      password: clientPasswordHash,
      role: 'CLIENT',
      dateCreation: new Date()
    },
  });
  const client1 = await prisma.client.create({
    data: {
      id: clientUser1.id,
      clientType: 'INDIVIDUEL',
      nom: 'Dhouib',
      prenom: 'Yomna',
      telephone: '+216 98 765 432',
      adresse: '123 Rue de la Paix, Tunis, Tunisie',
      codePostal: '4000',
      ville:'Sousse',
      brancheContact: 'E.A.S.C. Pièces Auto',
      produitsInterets: 'Filtres,Suspensions,Lubrifiants'
    },
  });

  // Client 2
  const clientUser2 = await prisma.user.create({
    data: {
      email: 'client2@gmail.com',
      password: clientPasswordHash,
      role: 'CLIENT',
      dateCreation: new Date()
    },
  });
  const client2 = await prisma.client.create({
    data: {
      id: clientUser2.id,
      clientType: 'INDIVIDUEL',
      nom: 'Belajouza',
      prenom: 'Adem',
      telephone: '+216 55 443 322',
      adresse: '45 Avenue Habib Bourguiba',
      codePostal: '1000',
      ville: 'Tunis',
      brancheContact: 'APS (Auto Parts Seghaier)',
      produitsInterets: 'Freinage,Carrosserie'
    },
  });
   console.log(`Created ${await prisma.client.count({ where: { clientType: 'INDIVIDUEL' } })} individual clients`);
   console.log('[Seed]: Creating company clients...');
   // Client 3: TechInnov
  const clientUser3 = await prisma.user.create({
    data: {
      email: 'contact@techinnov.tn',
      password: clientPasswordHash,
      role: 'CLIENT',
      dateCreation: new Date()
    }
  });

  const client3=await prisma.client.create({
    data: {
      id: clientUser3.id,
      clientType: 'SOCIETE',
      nom: 'TechInnov SARL',
      telephone: '+216 71 234 567',
      adresse: 'Immeuble TechPark, Lac 2',
      codePostal: '1053',
      ville: 'Tunis',
      matriculeFiscal: '1234567/TN/000',
      brancheContact: 'E.A.S.C. Gros',
      produitsInterets: 'Lubrifiants,Refroidissement,Fluids'
    }
  });

  // Client 4: Groupe Seghaier
  const clientUser4 = await prisma.user.create({
    data: {
      email: 'contact@seghaier-group.com',
      password: clientPasswordHash,
      role: 'CLIENT',
      dateCreation: new Date()
    }
  });

  const client4 = await prisma.client.create({
    data: {
      id: clientUser4.id,
      clientType: 'SOCIETE',
      nom: 'Groupe Seghaier',
      telephone: '+216 70 123 456',
      adresse: 'Tour Seghaier, Centre Urbain Nord',
      codePostal: '1080',
      ville: 'Tunis',
      matriculeFiscal: '8765432/TN/000',
      brancheContact: 'E.A.S.C. Pièces Auto',
      produitsInterets: 'Filtres,Suspensions,Freinage'
    }
  });

  console.log(` Created ${await prisma.client.count({ where: { clientType: 'SOCIETE' } })} company clients`);
  // Creation devis
  console.log('[Seed]: Creating quote requests (devis)...');
  
  // En attente
  await prisma.devis.create({
    data: {
      clientId: client1.id,
      brancheContact: 'E.A.S.C. Pièces Auto',
      produitDesire: 'Filtres',
      description: 'Demande de devis pour vidange complète et diagnostic moteur porsche.',
      statut: 'EN_ATTENTE',
    },
  });

  // Valide
  await prisma.devis.create({
    data: {
      clientId: client2.id,
      brancheContact: 'APS (Auto Parts Seghaier)',
      produitDesire: 'Freinage',
      description: 'Remplacement des plaquettes et disques de frein avant sur Golf 7.',
      statut: 'VALIDE',
      dateTraitement: new Date(),
    },
  });
  await prisma.devis.create({
    data: {
      clientId: client3.id,
      brancheContact: 'E.A.S.C. Gros',
      produitDesire: 'Lubrifiants',
      description: 'Commande en gros huile moteur 5W30 - 200 bidons de 5L.',
      statut: 'EN_COURS',
      dateTraitement: new Date(),
    },
  });
  await prisma.devis.create({
    data: {
      clientId: client4.id,
      brancheContact: 'E.A.S.C. Pièces Auto',
      produitDesire: 'Suspensions',
      description: 'Besoin de pièces de suspension pour véhicules utilitaires.',
      statut: 'REFUS',
      dateTraitement: new Date(),
      motifRefus: 'Stock insuffisant pour cette quantité'
    }
  });
  console.log(`Created ${await prisma.devis.count()} devis`);


  //Create Reclamations
  console.log('[Seed]: Creating reclamations...');

  // Reclamation 1: en attente
  await prisma.reclamation.create({
    data: {
      clientId: client1.id,
      destinataire: 'E.A.S.C. Pièces Auto',
      sujet: 'Retard de livraison',
      description: "Les filtres commandés le lundi n'ont pas encore été livrés.",
      statut: 'EN_ATTENTE',
    },
  });

  // Reclamation 2: Traité
  await prisma.reclamation.create({
    data: {
      clientId: client2.id,
      destinataire: 'APS (Auto Parts Seghaier)',
      sujet: 'Pièce non conforme',
      description: "Commande passée le 01/06/2026 non livrée à ce jour.",
      statut: 'EN_COURS',
      reponseAdmin: " Nous avons contacté le transporteur. Livraison prévue pour demain.",
    },
  });
    await prisma.reclamation.create({
    data: {
      clientId: client3.id,
      destinataire: 'E.A.S.C. Gros',
      sujet: 'Facturation incorrecte',
      description: 'La facture contient une erreur de montant.',
      statut: 'TRAITE',
      reponseAdmin: 'Nous avons corrigé la facture.'
    }
  });

  await prisma.reclamation.create({
    data: {
      clientId: client4.id,
      destinataire: 'E.A.S.C. Pièces Auto',
      sujet: 'Erreur dans la commande',
      description: 'Nous avons reçu des pièces de suspension pour Peugeot au lieu de Renault.',
      statut: 'EN_ATTENTE'
    }
  });
  console.log(`Created ${await prisma.reclamation.count()} reclamations`);
  console.log('[Seed]: Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('[Seed Error]:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
