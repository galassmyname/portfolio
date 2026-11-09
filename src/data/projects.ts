/**
 * Project data — single source of truth for the portfolio.
 *
 * Every field here was verified against the public repository
 * (README, dependency manifests, configuration and source files) at
 * github.com/galassmyname. Optional fields are left out when the
 * repository does not support them. `sources` lists the files each
 * entry was derived from.
 */

/**
 * Project categories, by domain. A filter only appears when at least one
 * published project uses its category.
 */
export const categories = [
  'Artificial Intelligence',
  'Machine Learning',
  'Software Engineering',
  'Full Stack',
  'Backend & Big Data',
] as const;
export type Category = (typeof categories)[number];

export type ArchitectureLayer = {
  label: string;
  nodes: string[];
};

export type Project = {
  slug: string;
  name: string;
  repo: string;
  /** Owner of `repo` when it is not galassmyname (team project hosted by a teammate). */
  repoOwner?: string;
  /** Team project: what Serigne Fallou Mbaye did, shown on the card and case study. */
  role?: string;
  /** Not on GitHub yet: kept out of the site until the repository is published. */
  draft?: boolean;
  /** Workshop / exercise: shown as a compact card without cover. */
  learning?: boolean;
  /** Further repositories that belong to the same project (e.g. a separate frontend). */
  extraRepos?: string[];
  /** One-line summary shown on cards; `description` is the full text. */
  summary: string;
  description: string;
  categories: Category[];
  technologies: string[];
  year: number;
  featured?: boolean;
  demoUrl?: string;
  /** Case-study content — featured projects only. */
  context?: string;
  problem?: string;
  solution?: string;
  features?: string[];
  architecture?: { layers: ArchitectureLayer[]; caption: string };
  notes?: string[];
  sources?: string[];
};

const GITHUB = 'https://github.com/galassmyname';
export const repoUrl = (p: Pick<Project, 'repo'> & { repoOwner?: string }) =>
  p.repoOwner ? `https://github.com/${p.repoOwner}/${p.repo}` : `${GITHUB}/${p.repo}`;
export const allRepos = (p: Project) => [p.repo, ...(p.extraRepos ?? [])];

const allProjects: Project[] = [
  // ─── Featured ────────────────────────────────────────────────
  {
    slug: 'labour-code-rag',
    name: 'Labour Code RAG Assistant',
    repo: 'p1ia_groupe3_llm-projet',
    repoOwner: 'Atou-D10',
    featured: true,
    year: 2026,
    categories: ['Artificial Intelligence'],
    role: 'Team of 5 (Sonatel Academy P1 IA). I built part 5: function calling and guardrails wired into the pipeline, and its report section.',
    summary: 'Answers questions on Senegal’s 2026 Labour Code and cites the articles it used.',
    description:
      'A retrieval-augmented generation (RAG) assistant that answers questions in French about Senegal’s Labour Code (law no. 2026-18), cites the articles it relied on, and is evaluated on a set of reference questions. Team project of the Sonatel Academy P1 IA “LLM & ecosystem” module.',
    technologies: ['Python', 'ChromaDB', 'sentence-transformers', 'Groq', 'PyMuPDF', 'pandas'],
    context:
      'A team project in the “LLM & ecosystem” module of the Sonatel Academy P1 IA programme: build an assistant that answers questions on a public French-language corpus, shows its sources, and measures its own quality.',
    problem:
      'A legal text is long, precise and recently changed: the 2026 Labour Code replaces the 1997 one, which a language model may have memorised. Answers must come from the current text and point to the article they rely on.',
    solution:
      'The law is split into one chunk per article (long articles are split at sentence boundaries with a 150-character overlap, and the Title > Chapter > Section context is repeated in each chunk). Chunks are embedded locally with multilingual-e5-small and stored in ChromaDB. For each question, the closest passages are retrieved, a similarity threshold flags out-of-corpus questions, and an LLM served by Groq writes the answer from those passages only, with citations. Every request is traced (step latency, tokens, cost) to a JSON Lines log.',
    features: [
      'One chunk per article, so answers can cite “article N”',
      'Local multilingual embeddings (multilingual-e5-small) and a persistent ChromaDB collection',
      'Similarity threshold to detect questions the corpus does not cover',
      'Function calling and guardrails plugged into the pipeline (my part)',
      'Per-request traces: latency of each step, tokens and estimated cost',
      'Evaluation set of reference questions: factual, comparison, out-of-corpus and trick questions',
    ],
    architecture: {
      caption: 'From the repository README and the src/ modules.',
      layers: [
        { label: 'Ingestion', nodes: ['collect.py · PDF (PyMuPDF)', 'chunking.py · one chunk per article'] },
        { label: 'Retrieval', nodes: ['index.py · multilingual-e5-small', 'ChromaDB (cosine)', 'retrieve.py · top-k + threshold'] },
        { label: 'Generation', nodes: ['pipeline.py · LLM via Groq', 'tools.py · function calling', 'guardrails.py'] },
        { label: 'Quality', nodes: ['evaluate.py', 'observability.py · traces'] },
      ],
    },
    notes: [
      'Team project hosted on a teammate’s account (Atou-D10). My commits cover part 5 (function calling, guardrails) and the report.',
      'Some sections of the repository README (evaluation results, guardrail cases) were still marked “to complete” when this page was written.',
    ],
    sources: ['README.md', 'requirements.txt', 'src/', 'commit history'],
  },
  {
    slug: 'couture-api',
    name: 'Tailoring Workshop REST API',
    repo: 'Atelier-Fast-api-Couture',
    featured: true,
    year: 2026,
    categories: ['Backend & Big Data'],
    summary: 'FastAPI + PostgreSQL API for a tailor’s shop: orders, payments, deliveries, stats.',
    description:
      'REST API that runs a tailoring workshop: customers and their measurements, orders and order lines, payments, deliveries and statistics, with JWT authentication and three roles. Final project of the FastAPI / PostgreSQL module at Sonatel Academy.',
    technologies: ['Python', 'FastAPI', 'PostgreSQL', 'SQLAlchemy', 'Alembic', 'Pydantic', 'JWT', 'pytest', 'Docker'],
    context:
      'Final project of the FastAPI / PostgreSQL module at Sonatel Academy: a complete backend for a tailoring workshop, specified as 44 routes and a set of business rules.',
    problem:
      'A workshop tracks customers, their measurements, garment orders, partial payments and deliveries — often on paper. The rules (who may change an order, when a delivery can be confirmed, what is still unpaid) must be enforced consistently.',
    solution:
      'A layered FastAPI application: routers check permissions and call a service; all business rules live in services/; SQLAlchemy 2 models are migrated with Alembic; Pydantic schemas separate create, update and read shapes. Passwords are hashed with Argon2 and requests are authenticated with JWT. Docker Compose starts PostgreSQL, applies migrations, seeds an admin and the catalogue, then serves the API.',
    features: [
      '44 routes under /api/v1: auth, users, customers, catalogue, measurements, orders, payments, deliveries, statistics',
      'Three roles (admin, reception, tailor) with permission checks per route',
      'Order status history, order lines, partial payments and unpaid-balance reporting',
      'Paginated lists and French error messages with consistent HTTP codes (401, 403, 404, 409, 422)',
      '37 pytest tests on an in-memory SQLite database, covering business rules and role permissions',
      'One-command start with Docker Compose; Swagger docs at /docs',
    ],
    architecture: {
      caption: 'From the repository structure (app/, alembic/, tests/).',
      layers: [
        { label: 'API', nodes: ['FastAPI routers', 'JWT · role checks (deps.py)'] },
        { label: 'Domain', nodes: ['services/ · business rules', 'Pydantic schemas'] },
        { label: 'Data', nodes: ['SQLAlchemy 2 models', 'Alembic migrations', 'PostgreSQL'] },
      ],
    },
    sources: ['README.md', 'requirements.txt', 'app/', 'tests/', 'docker-compose.yml'],
  },
  {
    slug: 'hadoop-mapreduce-cluster',
    name: 'Hadoop Cluster & MapReduce Sales Analytics',
    repo: 'hadoop-mapreduce-cluster',
    draft: true,
    featured: true,
    year: 2026,
    categories: ['Backend & Big Data'],
    summary: 'Multi-node Hadoop 3.4 cluster on Docker and four Python MapReduce jobs.',
    description:
      'A Hadoop 3.4.1 cluster on Docker Compose (1 NameNode, 3 DataNodes, 1 ResourceManager, 3 NodeManagers) running four Python MapReduce jobs over 100,000 synthetic sales transactions: revenue by country and by month, statistics by category and average basket by payment method. Each job is checked against an independent Python computation, and node failures are simulated. Master 2 SI coursework (UADB).',
    technologies: ['Hadoop', 'HDFS', 'YARN', 'MapReduce', 'Python', 'Docker Compose'],
  },
  {
    slug: 'spark-emr-revenue',
    name: 'PySpark Revenue by Country on Amazon EMR',
    repo: 'pyspark-emr-revenue',
    draft: true,
    year: 2026,
    categories: ['Backend & Big Data'],
    summary: 'PySpark job on Amazon EMR: revenue per country from S3, written back as Parquet.',
    description:
      'A PySpark job submitted to an Amazon EMR cluster: it reads sales transactions from S3, validates and cleans the columns, computes revenue per country, ranks the countries and writes the result to S3 as Parquet. Master 2 SI coursework (UADB, Big Data & NoSQL).',
    technologies: ['PySpark', 'Apache Spark', 'Amazon EMR', 'Amazon S3', 'Parquet', 'Python'],
  },
  {
    slug: 'first-aid-rag-chatbot',
    name: 'First-Aid RAG Chatbot (in progress)',
    repo: 'first-aid-rag-chatbot',
    draft: true,
    year: 2026,
    categories: ['Artificial Intelligence'],
    summary: 'French first-aid assistant: hybrid search, reranking and LLM answers from official guides.',
    description:
      'A French-language first-aid assistant built on official guides (PSC1 2024, IFRC 2020, Canadian Red Cross): hybrid retrieval (BM25 + multilingual embeddings in ChromaDB), cross-encoder reranking, a confidence threshold, LLM query rewriting as a fallback and answer generation through Groq, served by a layered FastAPI API. Conversation history and a web front end are still to come.',
    technologies: ['Python', 'FastAPI', 'ChromaDB', 'sentence-transformers', 'BM25', 'Groq'],
  },
  {
    slug: 'sunutransport',
    name: 'SunuTransport — Bus Lines & Live Tracking',
    repo: 'sunutransport-backend',
    extraRepos: ['sunutransport-front'],
    featured: true,
    year: 2025,
    categories: ['Full Stack', 'Backend & Big Data'],
    demoUrl: 'https://sunutransport.vercel.app',
    summary: 'Bus-line management with live GPS tracking on a map.',
    description:
      'A bus-network management platform with live vehicle tracking: an Express and MongoDB API that receives driver GPS positions and pushes them over WebSocket to an Angular and Leaflet admin dashboard.',
    technologies: ['TypeScript', 'Angular', 'Leaflet', 'Node.js', 'Express', 'MongoDB', 'Mongoose', 'WebSocket', 'JWT'],
    context:
      'A platform for managing public bus lines — buses, stops, drivers and passengers — and following each bus on a map as it runs its route.',
    problem:
      'Operators and passengers need to know where a bus is and when it will reach a stop. A static timetable cannot answer either question.',
    solution:
      'Drivers authenticate and send GPS positions (latitude, longitude, speed, accuracy) to the Express API, which stores them in MongoDB, marks the bus as active and broadcasts each update over WebSocket. On every position the API computes the haversine distance to the next stop on the line and emits an arrival notification once the bus is within 50 m; an ETA endpoint derives the time to the next stop from distance and speed. The Angular dashboard shows buses and stops on a Leaflet map and manages buses, stops and users.',
    features: [
      'Live bus positions pushed to connected clients over WebSocket',
      'Arrival notification when a bus comes within 50 m of its next stop (haversine distance)',
      'Estimated time of arrival at the next stop, from distance and speed',
      'Three roles — passenger, driver, admin — with JWT; passengers sign in with a bcrypt-hashed 4-digit PIN they can reset',
      'Lines with ordered stops per direction, and a global search across buses and stops',
      'Admin dashboard: statistics, bus, stop and user management, Leaflet map',
    ],
    architecture: {
      caption: 'Derived from server.js, routes/ and the Angular services.',
      layers: [
        { label: 'Clients', nodes: ['Admin dashboard · Angular + Leaflet', 'Driver GPS client'] },
        { label: 'API', nodes: ['Express REST API', 'WebSocket server', 'JWT auth'] },
        { label: 'Data', nodes: ['MongoDB · Mongoose'] },
      ],
    },
    notes: [
      'The API receives positions from a driver mobile app (POST /api/localisation/mobile); that app is not part of these public repositories.',
      'The live demo is the admin dashboard and requires a login. When checked, its API on Render returned an HTTP 500 error, so the demo may not be fully functional.',
    ],
    sources: [
      'server.js',
      'controllers/localisationControllers.js',
      'controllers/authControllers.js',
      'models/',
      'sunutransport-front/package.json',
      'src/app/app.routes.ts',
    ],
  },
  {
    slug: 'student-microservices',
    name: 'Student, Course & Teacher Microservices',
    repo: 'microservices-gestion-etudiants',
    year: 2026,
    categories: ['Backend & Big Data'],
    summary: 'Three Spring Boot microservices behind a gateway, run with Docker Compose.',
    description:
      'Three Spring Boot services for students, courses and teachers behind a Spring Cloud Gateway, each with its own MySQL database, orchestrated with Docker Compose.',
    technologies: [
      'Java 17',
      'Spring Boot',
      'Spring Cloud Gateway',
      'Spring Data JPA',
      'MySQL',
      'Docker',
      'Docker Compose',
      'Swagger / OpenAPI',
      'Lombok',
    ],
    context:
      'An academic management application split into independent services: one for students, one for courses and one for teachers. Each service owns its data and runs in its own container.',
    problem:
      'Keep each domain independently deployable while still answering cross-domain questions — for example, returning a course together with its student and teacher.',
    solution:
      'Three REST services (ports 8081–8083) sit behind an API Gateway on port 8080 that routes /students, /courses and /teachers and applies a global CORS policy. The course service composes data from the student and teacher services over HTTP with RestTemplate. Docker Compose starts one MySQL 8 container per service with health checks, and every service documents its API with springdoc-openapi.',
    features: [
      'Database per service: separate MySQL 8 instances (student_db, course_db, teacher_db)',
      'Path-based routing and CORS handled centrally by Spring Cloud Gateway',
      'Aggregated endpoint returning a course with its student and teacher',
      'Swagger UI / OpenAPI 3 documentation on each service',
      'Docker Compose orchestration with health-checked database dependencies',
      'Layered code: controller, service, repository and model with Spring Data JPA',
    ],
    architecture: {
      caption: 'Derived from docker-compose.yaml and the gateway application.yml.',
      layers: [
        { label: 'Entry', nodes: ['API Gateway · :8080'] },
        { label: 'Services', nodes: ['Student · :8081', 'Course · :8082', 'Teacher · :8083'] },
        { label: 'Data', nodes: ['student_db', 'course_db', 'teacher_db'] },
      ],
    },
    notes: [
      'The README and docker-compose file reference an Angular frontend (frontend-microservices) that is not included in the public repository.',
    ],
    sources: ['README.md', 'docker-compose.yaml', 'api-gateway/…/application.yml', '*/pom.xml', 'CourseService.java'],
  },
  {
    slug: 'waste-image-dataset',
    name: 'Image Dataset Preparation for Waste Classification',
    repo: 'Atelier-Images',
    featured: true,
    year: 2026,
    categories: ['Machine Learning'],
    summary: 'Audit, cleaning and augmentation of a six-class waste image dataset.',
    description:
      'A computer-vision data pipeline that audits, cleans, normalises, splits and augments a six-class waste image dataset before model training.',
    technologies: ['Python', 'TensorFlow / Keras', 'Pillow', 'NumPy', 'pandas', 'scikit-learn', 'Matplotlib', 'Jupyter'],
    context:
      'A workshop notebook built on a raw dataset of waste images in six classes: cardboard, glass, metal, paper, plastic and trash.',
    problem:
      'Raw image datasets contain corrupted files, blank images, mixed resolutions and colour modes, duplicates, mislabelled samples and class imbalance. Each of these degrades a classifier before training even starts.',
    solution:
      'A 13-step notebook detects each issue and records the findings in an audit report. It then resizes images and standardises colour channels, scales pixel values, splits the data into train, validation and test sets, and augments the minority class with Keras — after the split, to avoid leaking augmented copies into evaluation.',
    features: [
      'Detection of corrupted and empty images',
      'Resolution and colour-channel analysis; images under 64 × 64 flagged',
      'Duplicate detection by file hashing',
      'Visual check for mislabelled images',
      'Class-imbalance analysis and minority-class augmentation with Keras',
      'Audit exported to reports/audit_images.csv',
    ],
    sources: ['notebooks/atelier_prepa_donnees_images.ipynb', 'data/', 'reports/audit_images.csv'],
  },
  {
    slug: 'tech-assist-dakar',
    name: 'Tech-Assist Dakar — E-commerce Store',
    repo: 'tech-assist-dakar',
    featured: true,
    year: 2026,
    categories: ['Full Stack'],
    summary: 'Online electronics store: catalogue, cart, checkout and admin area.',
    description:
      'A full-stack Next.js store for an electronics retailer in Dakar: catalogue, cart and checkout, plus an admin area for products, categories and orders, on PostgreSQL with Prisma.',
    technologies: ['TypeScript', 'Next.js', 'React', 'Prisma', 'PostgreSQL', 'NextAuth', 'Tailwind CSS', 'Cloudinary', 'Zustand'],
    context:
      'An online shop for Tech-Assist Dakar, an electronics reseller (computers, smartphones, storage, audio, accessories) based in Dakar. Payment is made on delivery.',
    problem:
      'The shop needs a public catalogue customers can browse and order from, and an admin side to manage stock and follow orders — without trusting prices or quantities sent from the browser.',
    solution:
      'A Next.js 14 App Router application that uses Server Actions as its backend and Prisma over PostgreSQL. Orders are created inside a Prisma transaction that re-reads prices and checks stock on the server; stock is decremented when an order is marked as delivered and restored if that status is reverted. Product images are uploaded to Cloudinary with server-side signatures, the cart is a persisted Zustand store, and NextAuth protects the admin area.',
    features: [
      'Catalogue with text search, category filters and pagination',
      'Product pages with an image gallery and JSON-LD structured data',
      'Persistent cart and a checkout flow ending on an order confirmation page',
      'Server-side price and stock checks inside a Prisma transaction',
      'Admin area: dashboard, category and product management with multi-image Cloudinary upload, order status workflow',
      'Order notification email to the admin through the Brevo API',
      'Dynamic sitemap.xml and robots.txt, per-page metadata and Open Graph',
    ],
    architecture: {
      caption: 'Derived from the README, prisma/schema.prisma and src/.',
      layers: [
        { label: 'Client', nodes: ['Shop', 'Cart · Zustand', 'Admin · NextAuth'] },
        { label: 'Next.js 14', nodes: ['App Router pages', 'Server Actions', 'Auth middleware'] },
        { label: 'Services', nodes: ['PostgreSQL · Prisma', 'Cloudinary', 'Brevo'] },
      ],
    },
    sources: ['README.md', 'package.json', 'prisma/schema.prisma', 'src/actions/order-actions.ts', 'src/lib/notifications.ts'],
  },
  {
    slug: 'km-food',
    name: 'KM Food — Ordering & Delivery Platform',
    repo: 'kmfood',
    year: 2026,
    categories: ['Full Stack'],
    summary: 'Meal ordering and delivery site with a real-time admin back office.',
    description:
      'A Next.js and Supabase application for a meal ordering and delivery service in Keur Massar, Dakar: a public site and a real-time admin back office.',
    technologies: ['TypeScript', 'Next.js', 'React', 'Supabase', 'PostgreSQL', 'Tailwind CSS', 'Recharts'],
    context:
      'Customers place orders for the service over WhatsApp. The application gives the operator one place to record those orders, dispatch couriers and confirm payments.',
    problem:
      'Tracking orders, couriers, restaurant menus and payments by hand across chat threads does not scale and leaves no reliable record of revenue.',
    solution:
      'A Next.js 14 App Router application backed by Supabase. Admins create orders and move them through a status lifecycle — new, confirmed, preparing, out for delivery, delivered — and the order list updates live through Supabase Realtime. Route handlers expose order and courier APIs, middleware protects the admin area, and the PostgreSQL schema defines enums, triggers and row-level security policies.',
    features: [
      'Order lifecycle with status tracking and real-time updates',
      'Courier directory with availability and assignment to orders',
      'Restaurant and menu management',
      'Payment tracking for Wave, Orange Money and cash',
      'Dashboard KPIs and 30-day revenue charts',
      'Public order-tracking page by order number',
      'Admin area protected by Supabase Auth and Next.js middleware',
    ],
    architecture: {
      caption: 'Derived from the README, src/ structure and supabase/schema.sql.',
      layers: [
        { label: 'Client', nodes: ['Public site', 'Order tracking', 'Admin dashboard'] },
        { label: 'Next.js 14', nodes: ['App Router pages', 'Route handlers /api', 'Auth middleware'] },
        { label: 'Supabase', nodes: ['PostgreSQL + RLS', 'Auth', 'Realtime'] },
      ],
    },
    sources: ['README.md', 'package.json', 'supabase/schema.sql', 'src/app/', 'src/middleware.ts'],
  },
  {
    slug: 'distributed-system',
    name: 'Distributed Web Application & Delivery Pipeline',
    repo: 'distributed-system-project',
    featured: true,
    year: 2026,
    categories: ['Full Stack', 'Backend & Big Data', 'Software Engineering'],
    summary: 'React and Django app deployed with Docker, Kubernetes, Ansible and Jenkins.',
    description:
      'A React, Django REST Framework and PostgreSQL application taken through the full delivery chain: Docker, Kubernetes manifests, Ansible playbooks and a Jenkins pipeline.',
    technologies: [
      'Python',
      'Django',
      'Django REST Framework',
      'React',
      'PostgreSQL',
      'Docker',
      'Kubernetes',
      'Ansible',
      'Jenkins',
      'Nginx',
    ],
    context: 'A three-tier application built for a distributed systems course.',
    problem:
      'Take a simple CRUD application from local development to a reproducible, automated deployment on a Kubernetes cluster.',
    solution:
      'A Django REST API (users and products) served by Gunicorn and a React frontend served by Nginx, each with its own Dockerfile. Docker Compose runs the stack locally. Kubernetes manifests define a namespace, PostgreSQL ConfigMap, Secret and persistent volume claim, and a deployment and service per tier. Ansible playbooks provision the infrastructure and apply the manifests to Minikube, and a Jenkinsfile lints, tests, builds, pushes and deploys.',
    features: [
      'REST endpoints for users and products with Django REST Framework',
      'Local stack with Docker Compose; cluster deployment on Minikube',
      'PostgreSQL with persistent volume claim, ConfigMap and Secret',
      'Ansible playbooks for infrastructure setup and Kubernetes deployment',
      'Jenkins pipeline: lint, test, build, push images tagged by commit to Docker Hub, apply manifests and verify rollout',
    ],
    architecture: {
      caption: 'Derived from docker-compose.yml, kubernetes/, ansible/ and the Jenkinsfile.',
      layers: [
        { label: 'Delivery', nodes: ['Jenkins', 'Docker Hub', 'Ansible'] },
        { label: 'Cluster', nodes: ['React + Nginx', 'Django REST API', 'PostgreSQL + PVC'] },
      ],
    },
    sources: ['README.md', 'Jenkinsfile', 'docker-compose.yml', 'kubernetes/', 'ansible/', 'backend/requirements.txt'],
  },
  {
    slug: 'review-text-preprocessing',
    name: 'Customer Review Text Preprocessing (NLP)',
    repo: 'Atelier-donnes-textuelles',
    year: 2026,
    categories: ['Machine Learning'],
    summary: 'NLP pipeline for customer reviews: cleaning, tokenisation, TF-IDF.',
    description:
      'An NLP preparation pipeline for a corpus of customer reviews: exploration, regex cleaning, tokenisation, normalisation and Bag of Words / TF-IDF vectorisation.',
    technologies: ['Python', 'NLTK', 'spaCy', 'scikit-learn', 'pandas', 'Seaborn', 'Jupyter'],
    context:
      'A workshop notebook working on a raw CSV of customer reviews with class labels, sources and products.',
    problem:
      'Raw review text contains URLs, mentions, hashtags, irregular spacing and punctuation, duplicates and empty entries. It cannot be fed to a model until it is cleaned and turned into numerical features.',
    solution:
      'The notebook profiles the corpus, wraps the cleaning steps in a reusable regex-based function, tokenises with NLTK, normalises case and stop words for French text, applies stemming or lemmatisation, splits train and test sets, and compares three text representations.',
    features: [
      'Corpus profiling: text length distribution, empty texts, duplicates and class balance',
      'Reusable cleaning function for URLs, mentions, hashtags, whitespace and punctuation',
      'Tokenisation and token statistics with NLTK',
      'Stop-word selection and lemmatisation / stemming for French text',
      'Train / test split before vectorisation',
      'Comparison of Bag of Words, TF-IDF and unigram + bigram TF-IDF',
    ],
    sources: ['notebooks/atelier_prepa_donnees_textuelles.ipynb', 'data/smart_reviews_raw.csv'],
  },
  {
    slug: 'red-product',
    name: 'RED PRODUCT — Hotel Management',
    repo: 'REDPRODUCT',
    year: 2025,
    categories: ['Full Stack', 'Backend & Big Data'],
    demoUrl: 'https://superb-sprite-2ad929.netlify.app/',
    summary: 'Hotel listings managed by administrators: prices, currencies and photos.',
    description:
      'An Angular and Express application where authenticated administrators manage hotel listings — details, nightly price, currency and photos.',
    technologies: ['TypeScript', 'Angular', 'Node.js', 'Express', 'MongoDB', 'Mongoose', 'JWT'],
    context: 'A web application for managing hotels and their information from a single dashboard.',
    problem:
      'Hotel managers need one place to keep property details — address, contact, nightly price, currency and photos — up to date.',
    solution:
      'An Angular 19 frontend (login, registration, dashboard, hotel list and form, route guard) talks to an Express 5 REST API backed by MongoDB through Mongoose. Passwords are hashed with bcrypt, sessions use JSON Web Tokens, photos are uploaded with Multer, and password-reset emails are sent with Nodemailer.',
    features: [
      'Registration and login with bcrypt-hashed passwords and JWT',
      'Forgot / reset password flow by email (Nodemailer)',
      'Route guard protecting the dashboard',
      'Hotel CRUD with photo upload (Multer)',
      'Nightly price in XOF, EUR or USD',
    ],
    notes: ['The live demo serves the Angular frontend; availability of the backend API behind it was not verified.'],
    sources: ['backend/package.json', 'backend/models/Hotel.js', 'backend/controllers/auth.controller.js', 'frontend/package.json', 'frontend/src/app/'],
  },

  // ─── Index ───────────────────────────────────────────────────
  {
    slug: 'appointment-api',
    name: 'Appointment Booking API',
    repo: 'appointement',
    year: 2025,
    categories: ['Backend & Big Data'],
    summary: 'Laravel booking backend: availabilities, reminders and an admin panel.',
    description:
      'Laravel 11 backend for booking appointments with service providers: availabilities, recurrences, email reminders and notifications, with a Filament admin panel and role-based permissions.',
    technologies: ['PHP', 'Laravel', 'Filament', 'Livewire', 'JWT', 'Spatie Permission'],
  },
  {
    slug: 'book-management',
    name: 'Book Management',
    repo: 'gestion-de-livres',
    year: 2025,
    categories: ['Full Stack', 'Backend & Big Data'],
    summary: 'Book CRUD app with login: Angular front end and Express API.',
    description:
      'Book CRUD application with registration and login: an Angular frontend with standalone components and an Express REST API on MongoDB secured with JWT.',
    technologies: ['Angular', 'TypeScript', 'Express', 'MongoDB', 'JWT'],
  },
  {
    slug: 'meteo-app',
    learning: true,
    name: 'Weather App',
    repo: 'METEO-APP',
    year: 2025,
    categories: ['Software Engineering'],
    summary: 'Search a city and see its current weather.',
    description: 'Angular application that searches a city and displays its current weather from WeatherAPI.',
    technologies: ['Angular', 'TypeScript', 'WeatherAPI'],
  },
  {
    slug: 'techassist',
    name: 'TechAssist — Sales Management',
    repo: 'TechAssist',
    year: 2025,
    categories: ['Software Engineering'],
    summary: 'Desktop sales and stock management, with accounting charts.',
    description:
      'Desktop sales management application: products, stock, purchases, sales and an accounting view with charts, stored in SQLite and packaged as a runnable JAR.',
    technologies: ['Java', 'Swing', 'SQLite', 'JFreeChart', 'Maven'],
  },
  {
    slug: 'wolof-dictionary',
    name: 'French–Wolof Dictionary',
    repo: 'Dictionnaire-Francais-Wolof',
    year: 2025,
    categories: ['Software Engineering'],
    summary: 'French–Wolof desktop dictionary with example sentences.',
    description:
      'Desktop dictionary to search, add and delete French–Wolof entries with example sentences, built with Java Swing and MySQL over JDBC.',
    technologies: ['Java', 'Swing', 'MySQL', 'JDBC'],
  },
  {
    slug: 'donnees-decisions',
    name: 'Données & Décisions',
    repo: 'Donnee-Decision',
    year: 2025,
    categories: ['Full Stack'],
    summary: 'Showcase site for a data-analysis company, with a contact form.',
    description:
      'Responsive showcase website for a data-analysis company, with a contact form stored in MySQL and a session-protected admin page to read messages.',
    technologies: ['PHP', 'MySQL', 'HTML', 'CSS', 'JavaScript'],
  },
  {
    slug: 'openshift-3-tier',
    name: 'OpenShift 3-Tier Deployment',
    repo: 'projet-openshift-3tiers',
    year: 2026,
    categories: ['Software Engineering'],
    summary: 'Three-tier setup on OpenShift Virtualization: gateway, MySQL, Nginx.',
    description:
      'OpenShift Virtualization manifests for a three-tier setup: a Fedora gateway VM, a MySQL VM and an Nginx web pod served from a ConfigMap.',
    technologies: ['OpenShift', 'KubeVirt', 'Kubernetes', 'Nginx', 'MySQL'],
  },
  {
    slug: 'cluster-network-lab',
    learning: true,
    name: 'Cluster Networking Lab',
    repo: 'galassmyname-dev',
    year: 2026,
    categories: ['Software Engineering'],
    summary: 'Kubernetes VMs, a MySQL pod and a NetworkPolicy guarding the database.',
    description:
      'Kubernetes manifests for two KubeVirt virtual machines, a MySQL pod, services and a NetworkPolicy that denies all ingress to the database.',
    technologies: ['Kubernetes', 'KubeVirt', 'MySQL'],
  },
  {
    slug: 'dataset-manager',
    learning: true,
    name: 'Dataset Catalogue Manager',
    repo: 'Application-Python',
    year: 2026,
    categories: ['Machine Learning'],
    summary: 'Python command-line app to catalogue datasets in CSV and JSON.',
    description:
      'Modular Python command-line app to catalogue datasets: add, search, sort, edit and delete entries, view statistics and persist to CSV and JSON.',
    technologies: ['Python'],
  },
  {
    slug: 'ai-workspace-ui',
    name: 'AI Workspace Interface',
    repo: 'Tecno-Web',
    year: 2026,
    categories: ['Artificial Intelligence', 'Software Engineering'],
    summary: 'Browser workspace whose chat calls an LLM through the Hugging Face API.',
    description:
      'Front-end AI workspace in vanilla JavaScript — dashboard, chat, summarisation, translation, prediction and history views. The chat sends requests to an LLM through the Hugging Face router (chat completions) with a token the user enters, kept in the browser; the dashboard views use sample data.',
    technologies: ['JavaScript', 'HTML', 'CSS', 'Hugging Face API'],
  },
  {
    slug: 'iot-sensor-classifier',
    name: 'IoT Sensor State Classifier',
    repo: 'Ateleir-Sklearn',
    year: 2026,
    categories: ['Machine Learning'],
    summary: 'k-NN classifier that predicts IoT sensor states with scikit-learn.',
    description:
      'Predicts the state of IoT sensors with a scikit-learn pipeline: median imputation, standard scaling and a k-nearest-neighbours classifier, evaluated and exported with joblib.',
    technologies: ['Python', 'scikit-learn', 'pandas', 'Seaborn', 'Jupyter'],
  },
  {
    slug: 'energy-consumption-nn',
    name: 'Energy Consumption Neural Network',
    repo: 'Atelier-Tensorflow',
    year: 2026,
    categories: ['Machine Learning'],
    summary: 'Keras neural network that predicts energy consumption.',
    description:
      'A Keras neural network that predicts energy consumption from a generated dataset: architecture, training history analysis, evaluation on test data, and saving / reloading the model.',
    technologies: ['Python', 'TensorFlow / Keras', 'NumPy', 'pandas', 'Jupyter'],
  },
  {
    slug: 'smart-building-tabular',
    name: 'Smart Building Tabular Data Preparation',
    repo: 'Atelier-donnees-tabulaires',
    year: 2026,
    categories: ['Machine Learning'],
    summary: 'Cleaning, encoding and scaling of a smart-building dataset.',
    description:
      'Preparation of a smart-building dataset: exploration, inconsistencies, outliers, correlations, categorical encoding, scaling and a scikit-learn preprocessing pipeline.',
    technologies: ['Python', 'scikit-learn', 'pandas', 'Seaborn', 'Jupyter'],
  },
  {
    slug: 'iot-seaborn',
    learning: true,
    name: 'IoT Exploratory Analysis with Seaborn',
    repo: 'Atelier-Seaborn',
    year: 2026,
    categories: ['Machine Learning'],
    summary: 'Exploratory analysis of IoT sensor data with Seaborn.',
    description:
      'Exploratory analysis of IoT sensor data: distributions, per-building comparisons, regressions, correlations and pair plots.',
    technologies: ['Python', 'Seaborn', 'pandas', 'Jupyter'],
  },
  {
    slug: 'iot-matplotlib',
    learning: true,
    name: 'IoT Visualisation with Matplotlib',
    repo: 'Atelier-matpltlib',
    year: 2026,
    categories: ['Machine Learning'],
    summary: 'Six chart types of IoT sensor readings, each explained.',
    description:
      'Line, bar, histogram, scatter, box and pie charts of IoT sensor readings, with notes on what each chart reveals.',
    technologies: ['Python', 'Matplotlib', 'pandas', 'Jupyter'],
  },
  {
    slug: 'iot-pandas',
    learning: true,
    name: 'IoT Data Wrangling with pandas',
    repo: 'Atelier-Pandas',
    year: 2026,
    categories: ['Machine Learning'],
    summary: 'Selecting, deriving and cleaning IoT data with pandas.',
    description:
      'Series and DataFrame operations on IoT sensor data — selection, derived columns and cleaning — exported to CSV and JSON.',
    technologies: ['Python', 'pandas', 'Jupyter'],
  },
  {
    slug: 'iot-numpy',
    learning: true,
    name: 'IoT Sensor Analysis with NumPy',
    repo: 'Atelier-Numpy',
    year: 2026,
    categories: ['Machine Learning'],
    summary: 'NumPy arrays and boolean filters to spot sensor anomalies.',
    description:
      'Array creation, indexing, boolean filtering for anomaly detection and reshaping applied to temperature readings from simulated sensors.',
    technologies: ['Python', 'NumPy', 'Jupyter'],
  },
  {
    slug: 'linux-ai-setup',
    learning: true,
    name: 'AI Project Setup Script',
    repo: 'Atelier-Linux',
    year: 2026,
    categories: ['Software Engineering'],
    summary: 'Bash script that scaffolds the folders of an AI project.',
    description:
      'Bash script that scaffolds a Linux environment for an AI project — datasets, models, logs, config, API and backup directories — with a written report.',
    technologies: ['Bash', 'Linux'],
  },
];

/**
 * Display order: featured projects first (AI work, then the strongest software
 * projects), then the rest by relevance.
 */
const ORDER = [
  // Main projects — one per domain, AI first
  'labour-code-rag',
  'sunutransport',
  'couture-api',
  'waste-image-dataset',
  'hadoop-mapreduce-cluster',
  'tech-assist-dakar',
  'distributed-system',
  'first-aid-rag-chatbot',
  // Secondary — case studies and complete applications
  'review-text-preprocessing',
  'student-microservices',
  'spark-emr-revenue',
  'km-food',
  'red-product',
  'ai-workspace-ui',
  'energy-consumption-nn',
  'iot-sensor-classifier',
  'smart-building-tabular',
  'appointment-api',
  'book-management',
  'techassist',
  'wolof-dictionary',
  'donnees-decisions',
  'openshift-3-tier',
  // Workshops and exercises
  'dataset-manager',
  'iot-seaborn',
  'iot-matplotlib',
  'iot-pandas',
  'iot-numpy',
  'cluster-network-lab',
  'meteo-app',
  'linux-ai-setup',
]

const rank = (p: Project) => {
  const i = ORDER.indexOf(p.slug);
  return i === -1 ? ORDER.length : i;
};

/** Projects on the site: drafts (not yet on GitHub) are left out until published. */
export const projects: Project[] = allProjects.filter((p) => !p.draft).sort((a, b) => rank(a) - rank(b));

export const featuredProjects = projects.filter((p) => p.featured);
export const otherProjects = projects.filter((p) => !p.featured);

/** Projects with enough verified material for a dedicated page. */
export const hasCaseStudy = (p: Project) => Boolean(p.context);
export const caseStudies = projects.filter(hasCaseStudy);

export const projectNumber = (p: Project) =>
  String(projects.findIndex((x) => x.slug === p.slug) + 1).padStart(2, '0');

export const findProject = (slug: string) => projects.find((p) => p.slug === slug);
