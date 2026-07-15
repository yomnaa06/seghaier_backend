CREATE DATABASE IF NOT EXISTS sghaier_db;
USE sghaier_db;
INSERT IGNORE INTO users(email,password,role,dateCreation) VALUES
('admin@sghaier.com', '$2a$10$H7zPZqB8K5Xq7Y9W2rQ8fNv3KjLmNpQrStUvWxYz1AbCdEfGhIjKl', 'ADMIN', NOW()),
    ('manager@sghaier.com', '$2a$10$H7zPZqB8K5Xq7Y9W2rQ8fNv3KjLmNpQrStUvWxYz1AbCdEfGhIjKl', 'ADMIN', NOW()),

    ('mohamed.karoui@gmail.com', '$2a$10$H7zPZqB8K5Xq7Y9W2rQ8fNv3KjLmNpQrStUvWxYz1AbCdEfGhIjKl', 'CLIENT', NOW()),
    ('sonia.gharbi@yahoo.com', '$2a$10$H7zPZqB8K5Xq7Y9W2rQ8fNv3KjLmNpQrStUvWxYz1AbCdEfGhIjKl', 'CLIENT', NOW()),
    ('karim.benromdhane@hotmail.com', '$2a$10$H7zPZqB8K5Xq7Y9W2rQ8fNv3KjLmNpQrStUvWxYz1AbCdEfGhIjKl', 'CLIENT', NOW()),
    ('nour.zoghlami@gmail.com', '$2a$10$H7zPZqB8K5Xq7Y9W2rQ8fNv3KjLmNpQrStUvWxYz1AbCdEfGhIjKl', 'CLIENT', NOW()),
    ('sarah.mahjoub@outlook.com', '$2a$10$H7zPZqB8K5Xq7Y9W2rQ8fNv3KjLmNpQrStUvWxYz1AbCdEfGhIjKl', 'CLIENT', NOW()),

    ('contact@tunisiaparts.tn', '$2a$10$H7zPZqB8K5Xq7Y9W2rQ8fNv3KjLmNpQrStUvWxYz1AbCdEfGhIjKl', 'CLIENT', NOW()),
    ('info@autodistrib.tn', '$2a$10$H7zPZqB8K5Xq7Y9W2rQ8fNv3KjLmNpQrStUvWxYz1AbCdEfGhIjKl', 'CLIENT', NOW()),
    ('commercial@mecaparts.tn', '$2a$10$H7zPZqB8K5Xq7Y9W2rQ8fNv3KjLmNpQrStUvWxYz1AbCdEfGhIjKl', 'CLIENT', NOW());

    INSERT IGNORE INTO admins (user_id, username, nom, prenom) VALUES 
    (1, 'admin_sghaier', 'Sghaier', 'Ahmed'),
    (2, 'manager_sghaier', 'Trabelsi', 'Sami');

    INSERT IGNORE INTO clients (
    id, clientType, nom, prenom, telephone, adresse, codePostal, ville, 
    brancheContact, produitsInterets, dateCreation
) VALUES 
    (3, 'INDIVIDUEL', 'Karoui', 'Mohamed', '71 234 567', '12 Rue de la Liberté', '1000', 'Tunis', 
     'E.A.S.C. Pièces Auto', 'Filtres,Huiles', NOW()),
    
    (4, 'INDIVIDUEL', 'Gharbi', 'Sonia', '71 345 678', '15 Avenue Habib Bourguiba', '1001', 'Tunis', 
     'E.A.S.C. Gros', 'Suspensions,Amortisseurs', NOW()),
    
    (5, 'INDIVIDUEL', 'Ben Romdhane', 'Karim', '71 456 789', '8 Rue de Marseille', '1002', 'Tunis', 
     'APS', 'Freins,Disques', NOW()),
    
    (6, 'INDIVIDUEL', 'Zoghlami', 'Nour', '71 567 890', '25 Rue de la République', '1003', 'Tunis', 
     'E.A.S.C. Pièces Auto', 'Filtres,Courroies', NOW()),
    
    (7, 'INDIVIDUEL', 'Mahjoub', 'Sarah', '71 678 901', '3 Rue de la Montagne', '1004', 'Tunis', 
     'E.A.S.C. Gros', 'Pneus,Jantes', NOW());

     INSERT IGNORE INTO clients (
    id, clientType, nom, telephone, adresse, codePostal, ville, 
    matriculeFiscal, brancheContact, produitsInterets, dateCreation
) VALUES 
    (8, 'SOCIETE', 'Tunisia Parts SARL', '71 789 012', 'Parc d\'Activités Borj Cédria', '1005', 'Ben Arous', 
     '1234567/A/000', 'E.A.S.C. Gros', 'Filtres,Suspensions,Amortisseurs', NOW()),
    
    (9, 'SOCIETE', 'Auto Distrib SA', '71 890 123', 'Z.I. Mégrine', '1006', 'Mégrine', 
     '2345678/B/000', 'APS', 'Freins,Disques,Plaquettes', NOW()),
    
    (10, 'SOCIETE', 'Méca Parts Tunisie', '71 901 234', 'Zone Industrielle Kairouan', '1007', 'Kairouan', 
     '3456789/C/000', 'E.A.S.C. Pièces Auto', 'Pièces Moteur,Courroies,Filtres', NOW());

INSERT IGNORE INTO devis (
    client_id, brancheContact, produitDesire, description, statut, 
    dateDemande, dateTraitement
) VALUES 
    -- En attente (
    (3, 'E.A.S.C. Pièces Auto', 'Filtres', 'Demande de filtres à huile et filtres à air pour Peugeot 208', 
     'EN_ATTENTE', NOW(), NULL),
    
    (4, 'E.A.S.C. Gros', 'Suspensions', 'Kit de suspension complet pour Renault Clio', 
     'EN_ATTENTE', NOW(), NULL),
    
    -- En cours 
    (5, 'APS', 'Freins', 'Disques et plaquettes de frein pour Volkswagen Golf', 
     'EN_COURS', NOW() - INTERVAL 2 DAY, NULL),
    
    (8, 'E.A.S.C. Gros', 'Filtres', 'Commande en gros de filtres à huile pour flotte de 50 véhicules', 
     'EN_COURS', NOW() - INTERVAL 3 DAY, NULL),
    
    -- Valide 
    (6, 'E.A.S.C. Pièces Auto', 'Courroies', 'Courroie de distribution pour Ford Focus', 
     'VALIDE', NOW() - INTERVAL 7 DAY, NOW() - INTERVAL 5 DAY),
    
    (9, 'APS', 'Disques', 'Disques de frein avant pour BMW Série 3', 
     'VALIDE', NOW() - INTERVAL 10 DAY, NOW() - INTERVAL 8 DAY),

     INSERT IGNORE INTO reclamations (
    client_id, destinataire, sujet, description, statut, date, reponseAdmin
) VALUES 
    -- En attente 
    (3, 'E.A.S.C. Pièces Auto', 'Pièce non conforme', 'J\'ai reçu un filtre à huile non conforme à la commande', 
     'EN_ATTENTE', NOW() - INTERVAL 1 DAY, NULL),
    
    (4, 'E.A.S.C. Gros', 'Retard de livraison', 'La commande de suspensions a 5 jours de retard', 
     'EN_ATTENTE', NOW() - INTERVAL 2 DAY, NULL),
    
    -- En cours 
    (5, 'APS', 'Problème de montage', 'Les disques de frein ne s\'adaptent pas au véhicule', 
     'EN_COURS', NOW() - INTERVAL 3 DAY, 'Nous vérifions la compatibilité avec le fournisseur'),
    
    (8, 'E.A.S.C. Gros', 'Facturation erronée', 'La facture comporte une erreur de montant', 
     'EN_COURS', NOW() - INTERVAL 4 DAY, 'Service comptable en cours de vérification'),
    
    -- Traite 
    (6, 'E.A.S.C. Pièces Auto', 'Produit défectueux', 'Courroie de distribution cassée après 1000 km', 
     'TRAITE', NOW() - INTERVAL 15 DAY, 'Nous avons procédé au remplacement sous garantie'),
    
    (9, 'APS', 'Satisfaction produit', 'Très satisfait des disques de frein reçus', 
     'TRAITE', NOW() - INTERVAL 10 DAY, 'Merci pour votre retour positif !'),
    
    (7, 'E.A.S.C. Gros', 'Question sur produit', 'Besoin d\'informations sur la compatibilité des pneus', 
     'TRAITE', NOW() - INTERVAL 8 DAY, 'Réponse envoyée par email avec détails techniques');
     INSERT IGNORE INTO devis (
    client_id, branche_contact, produit_desire, description, statut, 
    date_demande, date_traitement
) VALUES 
    (10, 'E.A.S.C. Pièces Auto', 'Filtres', 'Filtres à air pour camion poids lourd', 
     'EN_ATTENTE', NOW() + INTERVAL 1 DAY, NULL),
    
    (8, 'APS', 'Plaquettes', 'Plaquettes de frein pour flotte de transport', 
     'EN_COURS', NOW() - INTERVAL 1 DAY, NULL);


INSERT IGNORE INTO reclamations (
    client_id, destinataire, sujet, description, statut, date, reponseAdmin
) VALUES 
    (10, 'E.A.S.C. Pièces Auto', 'Demande de documentation', 'Besoin de fiches techniques pour pièces moteur', 
     'EN_ATTENTE', NOW() - INTERVAL 1 DAY, NULL),
    
    (5, 'APS', 'Problème de compatibilité', 'Plaquettes de frein ne correspondent pas au véhicule', 
     'EN_COURS', NOW() - INTERVAL 2 DAY, 'En attente de retour fournisseur');

SELECT '===DATA IMPOER COMPLETE===' AS 'Status';
SELECT
    (SELECT COUNT(*) FROM users)+(SELECT COUNT(*) FROM clients)+(SELECT COUNT(*) FROM admins) AS 'Records totals';
    SELECT 'users' AS table, COUNT(*) AS Count FROM users
    UNION ALL 
    SELECT 'clients' AS table, COUNT(*) AS Count FROM clients
    UNION ALL 
    SELECT 'admins' AS table, COUNT(*) AS Count FROM admins;
