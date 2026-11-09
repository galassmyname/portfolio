import type { Lang } from '../i18n/ui';
import type { Project } from './projects';

/**
 * French text for projects.ts, keyed by slug. Same facts as the English
 * entries — only the wording changes. Technologies, repository names and
 * proper nouns are shared and stay in projects.ts.
 */
type ProjectText = Partial<
  Pick<Project, 'name' | 'summary' | 'description' | 'context' | 'problem' | 'solution' | 'features' | 'notes' | 'architecture'>
>;

const fr: Record<string, ProjectText> = {
  sunutransport: {
    summary: 'Gestion de lignes de bus avec suivi GPS en temps réel sur carte.',
    name: 'SunuTransport — Lignes de bus & suivi en temps réel',
    description:
      'Une plateforme de gestion des lignes de bus avec localisation des véhicules en temps réel : une API Express et MongoDB qui reçoit la position GPS des chauffeurs et la diffuse en WebSocket vers un tableau de bord d’administration Angular et Leaflet.',
    context:
      'Une plateforme pour gérer des lignes de bus — bus, arrêts, chauffeurs et voyageurs — et suivre chaque bus sur une carte pendant son trajet.',
    problem:
      'Les exploitants comme les voyageurs ont besoin de savoir où se trouve un bus et quand il arrivera à un arrêt. Un horaire statique ne répond à aucune de ces deux questions.',
    solution:
      'Les chauffeurs s’authentifient et envoient leur position GPS (latitude, longitude, vitesse, précision) à l’API Express, qui l’enregistre dans MongoDB, passe le bus en statut actif et diffuse chaque mise à jour en WebSocket. À chaque position, l’API calcule la distance (formule de haversine) jusqu’au prochain arrêt de la ligne et émet une notification d’arrivée dès que le bus est à moins de 50 m ; un endpoint d’ETA estime le temps restant jusqu’au prochain arrêt à partir de la distance et de la vitesse. Le tableau de bord Angular affiche les bus et les arrêts sur une carte Leaflet et permet de gérer les bus, les arrêts et les utilisateurs.',
    features: [
      'Positions des bus diffusées en direct aux clients connectés via WebSocket',
      'Notification d’arrivée lorsqu’un bus est à moins de 50 m de son prochain arrêt (distance de haversine)',
      'Estimation du temps d’arrivée au prochain arrêt, à partir de la distance et de la vitesse',
      'Trois rôles — voyageur, chauffeur, admin — avec JWT ; les voyageurs se connectent avec un code PIN à 4 chiffres haché (bcrypt) qu’ils peuvent réinitialiser',
      'Lignes avec arrêts ordonnés par direction, et recherche globale sur les bus et les arrêts',
      'Tableau de bord admin : statistiques, gestion des bus, des arrêts et des utilisateurs, carte Leaflet',
    ],
    architecture: {
      caption: 'Déduit de server.js, du dossier routes/ et des services Angular.',
      layers: [
        { label: 'Clients', nodes: ['Tableau de bord admin · Angular + Leaflet', 'Client GPS chauffeur'] },
        { label: 'API', nodes: ['API REST Express', 'Serveur WebSocket', 'Authentification JWT'] },
        { label: 'Données', nodes: ['MongoDB · Mongoose'] },
      ],
    },
    notes: [
      'L’API reçoit les positions depuis une application mobile chauffeur (POST /api/localisation/mobile) ; cette application ne fait pas partie de ces dépôts publics.',
      'La démo en ligne correspond au tableau de bord d’administration et nécessite une connexion. Lors de la vérification, son API hébergée sur Render renvoyait une erreur HTTP 500 : la démo peut donc ne pas être pleinement fonctionnelle.',
    ],
  },
  'tech-assist-dakar': {
    summary: 'Boutique en ligne d’électronique : catalogue, panier, commande et espace admin.',
    name: 'Tech-Assist Dakar — Boutique e-commerce',
    description:
      'Une boutique en ligne full-stack en Next.js pour un revendeur d’électronique à Dakar : catalogue, panier et commande, ainsi qu’un espace d’administration pour les produits, les catégories et les commandes, sur PostgreSQL avec Prisma.',
    context:
      'Une boutique en ligne pour Tech-Assist Dakar, revendeur d’électronique (ordinateurs, smartphones, stockage, audio, accessoires) basé à Dakar. Le paiement se fait à la livraison.',
    problem:
      'La boutique a besoin d’un catalogue public que les clients peuvent parcourir pour passer commande, et d’un espace d’administration pour gérer le stock et suivre les commandes — sans jamais faire confiance aux prix ou aux quantités envoyés par le navigateur.',
    solution:
      'Une application Next.js 14 (App Router) qui utilise les Server Actions comme backend et Prisma sur PostgreSQL. Les commandes sont créées dans une transaction Prisma qui relit les prix et vérifie le stock côté serveur ; le stock est décrémenté lorsqu’une commande passe au statut « livrée » et restauré si ce statut est annulé. Les images produits sont envoyées sur Cloudinary avec une signature générée côté serveur, le panier est un store Zustand persistant, et NextAuth protège l’espace d’administration.',
    features: [
      'Catalogue avec recherche texte, filtres par catégorie et pagination',
      'Fiches produits avec galerie d’images et données structurées JSON-LD',
      'Panier persistant et tunnel de commande jusqu’à la page de confirmation',
      'Vérification des prix et du stock côté serveur dans une transaction Prisma',
      'Espace admin : tableau de bord, gestion des catégories et des produits avec envoi de plusieurs images sur Cloudinary, suivi des statuts de commande',
      'E-mail de notification de commande à l’administrateur via l’API Brevo',
      'sitemap.xml et robots.txt dynamiques, métadonnées et Open Graph par page',
    ],
    architecture: {
      caption: 'Déduit du README, de prisma/schema.prisma et du dossier src/.',
      layers: [
        { label: 'Client', nodes: ['Boutique', 'Panier · Zustand', 'Admin · NextAuth'] },
        { label: 'Next.js 14', nodes: ['Pages App Router', 'Server Actions', 'Middleware d’authentification'] },
        { label: 'Services', nodes: ['PostgreSQL · Prisma', 'Cloudinary', 'Brevo'] },
      ],
    },
  },
  'student-microservices': {
    summary: 'Trois microservices Spring Boot derrière une gateway, avec Docker Compose.',
    name: 'Microservices Étudiants, Cours & Enseignants',
    description:
      'Trois services Spring Boot pour les étudiants, les cours et les enseignants, derrière une Spring Cloud Gateway, chacun avec sa propre base MySQL, orchestrés avec Docker Compose.',
    context:
      'Une application de gestion académique découpée en services indépendants : un pour les étudiants, un pour les cours et un pour les enseignants. Chaque service possède ses propres données et s’exécute dans son propre conteneur.',
    problem:
      'Garder chaque domaine déployable indépendamment tout en répondant aux requêtes transverses — par exemple, renvoyer un cours avec son étudiant et son enseignant.',
    solution:
      'Trois services REST (ports 8081 à 8083) sont placés derrière une API Gateway sur le port 8080, qui route /students, /courses et /teachers et applique une politique CORS globale. Le service des cours agrège les données des services étudiants et enseignants via HTTP avec RestTemplate. Docker Compose démarre un conteneur MySQL 8 par service avec des health checks, et chaque service documente son API avec springdoc-openapi.',
    features: [
      'Une base de données par service : instances MySQL 8 distinctes (student_db, course_db, teacher_db)',
      'Routage par chemin et CORS gérés de façon centralisée par Spring Cloud Gateway',
      'Endpoint agrégé renvoyant un cours avec son étudiant et son enseignant',
      'Documentation Swagger UI / OpenAPI 3 sur chaque service',
      'Orchestration Docker Compose, avec des bases de données vérifiées par health check avant le démarrage des services',
      'Code en couches : controller, service, repository et model avec Spring Data JPA',
    ],
    architecture: {
      caption: 'Déduit de docker-compose.yaml et du fichier application.yml de la gateway.',
      layers: [
        { label: 'Entrée', nodes: ['API Gateway · :8080'] },
        { label: 'Services', nodes: ['Student · :8081', 'Course · :8082', 'Teacher · :8083'] },
        { label: 'Données', nodes: ['student_db', 'course_db', 'teacher_db'] },
      ],
    },
    notes: [
      'Le README et le fichier docker-compose font référence à un frontend Angular (frontend-microservices) qui n’est pas inclus dans le dépôt public.',
    ],
  },
  'waste-image-dataset': {
    summary: 'Audit, nettoyage et augmentation d’un dataset d’images de déchets (6 classes).',
    name: 'Préparation d’un dataset d’images pour la classification des déchets',
    description:
      'Un pipeline de données de vision par ordinateur qui audite, nettoie, normalise, découpe et augmente un dataset d’images de déchets en six classes avant l’entraînement d’un modèle.',
    context:
      'Un notebook d’atelier construit sur un dataset brut d’images de déchets réparties en six classes : cardboard, glass, metal, paper, plastic et trash.',
    problem:
      'Les datasets d’images bruts contiennent des fichiers corrompus, des images vides, des résolutions et des modes de couleur hétérogènes, des doublons, des images mal étiquetées et un déséquilibre entre classes. Chacun de ces problèmes dégrade un classifieur avant même le début de l’entraînement.',
    solution:
      'Un notebook en 13 étapes détecte chacun de ces problèmes et consigne les résultats dans un rapport d’audit. Il redimensionne ensuite les images, uniformise les canaux de couleur, met les pixels à l’échelle, découpe les données en ensembles d’entraînement, de validation et de test, puis augmente la classe minoritaire avec Keras — après le découpage, pour éviter que des copies augmentées ne faussent l’évaluation.',
    features: [
      'Détection des images corrompues et vides',
      'Analyse des résolutions et des canaux de couleur ; images inférieures à 64 × 64 signalées',
      'Détection des doublons par hachage des fichiers',
      'Contrôle visuel des images mal étiquetées',
      'Analyse du déséquilibre des classes et augmentation de la classe minoritaire avec Keras',
      'Audit exporté dans reports/audit_images.csv',
    ],
  },
  'km-food': {
    summary: 'Site de commande et de livraison de repas, avec back-office en temps réel.',
    name: 'KM Food — Plateforme de commande et de livraison',
    description:
      'Une application Next.js et Supabase pour un service de commande et de livraison de repas à Keur Massar (Dakar) : un site public et un back-office d’administration en temps réel.',
    context:
      'Les clients passent leurs commandes via WhatsApp. L’application donne à l’opérateur un seul endroit pour enregistrer ces commandes, affecter les livreurs et confirmer les paiements.',
    problem:
      'Suivre à la main les commandes, les livreurs, les menus des restaurants et les paiements à travers des conversations ne passe pas à l’échelle et ne laisse aucune trace fiable du chiffre d’affaires.',
    solution:
      'Une application Next.js 14 (App Router) adossée à Supabase. Les administrateurs créent les commandes et les font passer par un cycle de statuts — nouvelle, confirmée, en préparation, en livraison, livrée — et la liste des commandes se met à jour en direct grâce à Supabase Realtime. Des route handlers exposent les API des commandes et des livreurs, un middleware protège l’espace d’administration, et le schéma PostgreSQL définit des enums, des triggers et des politiques de sécurité au niveau des lignes (RLS).',
    features: [
      'Cycle de vie des commandes avec suivi des statuts et mises à jour en temps réel',
      'Annuaire des livreurs avec disponibilité et affectation aux commandes',
      'Gestion des restaurants et des menus',
      'Suivi des paiements Wave, Orange Money et espèces',
      'Indicateurs clés et graphiques du chiffre d’affaires sur 30 jours',
      'Page publique de suivi de commande par numéro',
      'Espace d’administration protégé par Supabase Auth et un middleware Next.js',
    ],
    architecture: {
      caption: 'Déduit du README, de la structure src/ et de supabase/schema.sql.',
      layers: [
        { label: 'Client', nodes: ['Site public', 'Suivi de commande', 'Tableau de bord admin'] },
        { label: 'Next.js 14', nodes: ['Pages App Router', 'Route handlers /api', 'Middleware d’authentification'] },
        { label: 'Supabase', nodes: ['PostgreSQL + RLS', 'Auth', 'Realtime'] },
      ],
    },
  },
  'distributed-system': {
    summary: 'Application React et Django déployée avec Docker, Kubernetes, Ansible et Jenkins.',
    name: 'Application web distribuée & pipeline de déploiement',
    description:
      'Une application React, Django REST Framework et PostgreSQL menée à travers toute la chaîne de livraison : Docker, manifestes Kubernetes, playbooks Ansible et pipeline Jenkins.',
    context: 'Une application trois tiers réalisée dans le cadre d’un cours de systèmes répartis.',
    problem:
      'Faire passer une application CRUD simple du développement local à un déploiement automatisé et reproductible sur un cluster Kubernetes.',
    solution:
      'Une API Django REST (utilisateurs et produits) servie par Gunicorn et un frontend React servi par Nginx, chacun avec son propre Dockerfile. Docker Compose exécute la stack en local. Les manifestes Kubernetes définissent un namespace, la ConfigMap, le Secret et le volume persistant (PVC) de PostgreSQL, ainsi qu’un deployment et un service par tier. Des playbooks Ansible provisionnent l’infrastructure et appliquent les manifestes sur Minikube, et un Jenkinsfile enchaîne lint, tests, build, push et déploiement.',
    features: [
      'Endpoints REST pour les utilisateurs et les produits avec Django REST Framework',
      'Stack locale avec Docker Compose ; déploiement sur un cluster Minikube',
      'PostgreSQL avec volume persistant, ConfigMap et Secret',
      'Playbooks Ansible pour la mise en place de l’infrastructure et le déploiement Kubernetes',
      'Pipeline Jenkins : lint, tests, build, push sur Docker Hub d’images taguées par commit, application des manifestes et vérification du rollout',
    ],
    architecture: {
      caption: 'Déduit de docker-compose.yml, kubernetes/, ansible/ et du Jenkinsfile.',
      layers: [
        { label: 'Livraison', nodes: ['Jenkins', 'Docker Hub', 'Ansible'] },
        { label: 'Cluster', nodes: ['React + Nginx', 'API Django REST', 'PostgreSQL + PVC'] },
      ],
    },
  },
  'review-text-preprocessing': {
    summary: 'Pipeline NLP sur des avis clients : nettoyage, tokenisation, TF-IDF.',
    name: 'Prétraitement de textes d’avis clients (NLP)',
    description:
      'Un pipeline de préparation NLP pour un corpus d’avis clients : exploration, nettoyage par expressions régulières, tokenisation, normalisation et vectorisation Bag of Words / TF-IDF.',
    context:
      'Un notebook d’atelier travaillant sur un CSV brut d’avis clients, avec des étiquettes de classe, des sources et des produits.',
    problem:
      'Le texte brut des avis contient des URL, des mentions, des hashtags, des espaces et une ponctuation irréguliers, des doublons et des entrées vides. Il ne peut pas être fourni à un modèle tant qu’il n’est pas nettoyé et transformé en variables numériques.',
    solution:
      'Le notebook profile le corpus, regroupe les étapes de nettoyage dans une fonction réutilisable basée sur des expressions régulières, tokenise avec NLTK, normalise la casse et les mots vides pour un texte en français, applique une racinisation ou une lemmatisation, sépare les ensembles d’entraînement et de test, puis compare trois représentations du texte.',
    features: [
      'Profilage du corpus : distribution des longueurs, textes vides, doublons et équilibre des classes',
      'Fonction de nettoyage réutilisable pour les URL, mentions, hashtags, espaces et ponctuation',
      'Tokenisation et statistiques de tokens avec NLTK',
      'Sélection des mots vides et lemmatisation / racinisation pour le français',
      'Découpage entraînement / test avant la vectorisation',
      'Comparaison de Bag of Words, TF-IDF et TF-IDF unigrammes + bigrammes',
    ],
  },
  'red-product': {
    summary: 'Gestion d’hôtels par des administrateurs : prix, devises et photos.',
    name: 'RED PRODUCT — Gestion hôtelière',
    description:
      'Une application Angular et Express dans laquelle des administrateurs authentifiés gèrent des fiches d’hôtels — informations, prix par nuit, devise et photos.',
    context: 'Une application web pour gérer des hôtels et leurs informations depuis un tableau de bord unique.',
    problem:
      'Les gestionnaires d’hôtels ont besoin d’un seul endroit pour tenir à jour les informations de leurs établissements — adresse, contact, prix par nuit, devise et photos.',
    solution:
      'Un frontend Angular 19 (connexion, inscription, tableau de bord, liste et formulaire d’hôtels, garde de route) communique avec une API REST Express 5 adossée à MongoDB via Mongoose. Les mots de passe sont hachés avec bcrypt, les sessions reposent sur des JSON Web Tokens, les photos sont envoyées avec Multer et les e-mails de réinitialisation de mot de passe partent via Nodemailer.',
    features: [
      'Inscription et connexion avec mots de passe hachés (bcrypt) et JWT',
      'Mot de passe oublié / réinitialisation par e-mail (Nodemailer)',
      'Garde de route protégeant le tableau de bord',
      'CRUD des hôtels avec envoi de photos (Multer)',
      'Prix par nuit en XOF, EUR ou USD',
    ],
    notes: [
      'La démo en ligne sert le frontend Angular ; la disponibilité de l’API backend derrière celle-ci n’a pas été vérifiée.',
    ],
  },
  'appointment-api': {
    summary: 'Backend Laravel de prise de rendez-vous : disponibilités, rappels et admin.',
    name: 'API de prise de rendez-vous',
    description:
      'Backend Laravel 11 pour la prise de rendez-vous avec des prestataires : disponibilités, récurrences, rappels par e-mail et notifications, avec un panneau d’administration Filament et des permissions par rôle.',
  },
  'book-management': {
    summary: 'Application CRUD de livres avec connexion : Angular et API Express.',
    name: 'Gestion de livres',
    description:
      'Application CRUD de livres avec inscription et connexion : un frontend Angular à composants standalone et une API REST Express sur MongoDB sécurisée par JWT.',
  },
  'meteo-app': {
    summary: 'Recherchez une ville et consultez sa météo actuelle.',
    name: 'Application météo',
    description: 'Application Angular qui recherche une ville et affiche sa météo actuelle via WeatherAPI.',
  },
  techassist: {
    summary: 'Gestion des ventes et du stock sur desktop, avec graphiques comptables.',
    name: 'TechAssist — Gestion des ventes',
    description:
      'Application de bureau de gestion des ventes : produits, stock, achats, ventes et vue comptable avec graphiques, stockée dans SQLite et distribuée sous forme de JAR exécutable.',
  },
  'wolof-dictionary': {
    summary: 'Dictionnaire français–wolof sur desktop, avec phrases d’exemple.',
    name: 'Dictionnaire Français–Wolof',
    description:
      'Dictionnaire de bureau pour rechercher, ajouter et supprimer des entrées français–wolof avec des phrases d’exemple, réalisé avec Java Swing et MySQL via JDBC.',
  },
  'donnees-decisions': {
    summary: 'Site vitrine d’une société d’analyse de données, avec formulaire de contact.',
    description:
      'Site vitrine responsive pour une entreprise d’analyse de données, avec un formulaire de contact enregistré dans MySQL et une page d’administration protégée par session pour consulter les messages.',
  },
  'openshift-3-tier': {
    summary: 'Architecture 3 tiers sur OpenShift Virtualization : gateway, MySQL, Nginx.',
    name: 'Déploiement 3 tiers sur OpenShift',
    description:
      'Manifestes OpenShift Virtualization pour une architecture trois tiers : une VM passerelle Fedora, une VM MySQL et un pod web Nginx servi depuis une ConfigMap.',
  },
  'cluster-network-lab': {
    summary: 'VM Kubernetes, pod MySQL et NetworkPolicy qui protège la base de données.',
    name: 'Lab réseau sur cluster',
    description:
      'Manifestes Kubernetes pour deux machines virtuelles KubeVirt, un pod MySQL, des services et une NetworkPolicy qui bloque tout trafic entrant vers la base de données.',
  },
  'dataset-manager': {
    summary: 'Application Python en ligne de commande pour cataloguer des datasets.',
    name: 'Gestionnaire de catalogue de datasets',
    description:
      'Application Python modulaire en ligne de commande pour cataloguer des datasets : ajout, recherche, tri, modification et suppression, statistiques et persistance en CSV et JSON.',
  },
  'ai-workspace-ui': {
    summary: 'Interface d’un espace de travail IA : chat, résumé et traduction.',
    name: 'Interface AI Workspace',
    description:
      'Interface front-end d’un espace de travail IA — tableau de bord, chat, résumé, traduction, prédiction et historique — réalisée en JavaScript natif avec des données simulées.',
  },
  'iot-sensor-classifier': {
    summary: 'Classifieur k-NN qui prédit l’état de capteurs IoT avec scikit-learn.',
    name: 'Classifieur d’état de capteurs IoT',
    description:
      'Prédit l’état de capteurs IoT avec un pipeline scikit-learn : imputation par la médiane, standardisation et classifieur des k plus proches voisins, évalué puis exporté avec joblib.',
  },
  'energy-consumption-nn': {
    summary: 'Réseau de neurones Keras qui prédit la consommation d’énergie.',
    name: 'Réseau de neurones de consommation énergétique',
    description:
      'Un réseau de neurones Keras qui prédit la consommation énergétique à partir d’un dataset généré : architecture, analyse de l’historique d’entraînement, évaluation sur les données de test, sauvegarde et rechargement du modèle.',
  },
  'smart-building-tabular': {
    summary: 'Nettoyage, encodage et mise à l’échelle d’un dataset de bâtiment intelligent.',
    name: 'Préparation de données tabulaires — bâtiment intelligent',
    description:
      'Préparation d’un dataset de bâtiment intelligent : exploration, incohérences, valeurs aberrantes, corrélations, encodage des variables catégorielles, mise à l’échelle et pipeline de prétraitement scikit-learn.',
  },
  'iot-seaborn': {
    summary: 'Analyse exploratoire de données de capteurs IoT avec Seaborn.',
    name: 'Analyse exploratoire IoT avec Seaborn',
    description:
      'Analyse exploratoire de données de capteurs IoT : distributions, comparaisons par bâtiment, régressions, corrélations et pair plots.',
  },
  'iot-matplotlib': {
    summary: 'Six types de graphiques sur des mesures IoT, chacun commenté.',
    name: 'Visualisation IoT avec Matplotlib',
    description:
      'Courbes, diagrammes en barres, histogrammes, nuages de points, boîtes à moustaches et diagrammes circulaires de mesures de capteurs IoT, avec l’analyse de ce que révèle chaque graphique.',
  },
  'iot-pandas': {
    summary: 'Sélection, colonnes dérivées et nettoyage de données IoT avec pandas.',
    name: 'Manipulation de données IoT avec pandas',
    description:
      'Opérations sur Series et DataFrame appliquées à des données de capteurs IoT — sélection, colonnes dérivées et nettoyage — exportées en CSV et JSON.',
  },
  'iot-numpy': {
    summary: 'Tableaux NumPy et filtres booléens pour repérer des anomalies.',
    name: 'Analyse de capteurs IoT avec NumPy',
    description:
      'Création de tableaux, indexation, filtrage booléen pour la détection d’anomalies et redimensionnement, appliqués à des relevés de température de capteurs simulés.',
  },
  'linux-ai-setup': {
    summary: 'Script Bash qui génère l’arborescence d’un projet IA.',
    name: 'Script de mise en place d’un projet IA',
    description:
      'Script Bash qui génère l’arborescence d’un projet IA sous Linux — datasets, modèles, logs, configuration, API et sauvegardes — accompagné d’un rapport écrit.',
  },
};

/** Returns the project with its text in the requested language. */
export function localizeProject(project: Project, lang: Lang): Project {
  return lang === 'fr' ? { ...project, ...fr[project.slug] } : project;
}
