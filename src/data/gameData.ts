export type PixelAsset =
  | 'terminal'
  | 'barbell'
  | 'kettlebell'
  | 'rack'
  | 'docker'
  | 'map'
  | 'pdf'
  | 'medal'
  | 'professor';

export interface Station {
  name: string;
  label: string;
  asset: PixelAsset;
  description: string;
  stats?: string[];
  details: string[];
}

export interface LevelData {
  id: string;
  company: string;
  role: string;
  period: string;
  theme: string;
  wod: string;
  stations: Station[];
}

export const personal = {
  name: 'Joaquín Pina Socorro',
  title: 'Development Team Lead / Backend Software Engineer - Python',
  location: 'A Coruna, Spain',
  phone: '+34 641 156 176',
  email: 'jpinas1998@gmail.com',
  linkedin: 'www.linkedin.com/in/jpinas1998-software-engineer/',
  github: 'github.com/jpinas1998',
};

export const profile =
  'Development team lead and backend engineer with 5+ years building web products and data-driven platforms with Python, Django REST Framework, PostgreSQL, MongoDB, ClickHouse, AWS, GCP, Docker and CI/CD.';

export const gameLevels: LevelData[] = [
  {
    id: 'profile',
    company: 'Warm-up',
    role: 'Backend Software Engineer',
    period: '5+ years',
    theme: 'A tech gym floor for APIs, data and production delivery.',
    wod: 'AMRAP: APIs + data + shipping',
    stations: [
      {
        name: 'Python Engine',
        label: 'PY',
        asset: 'terminal',
        description: 'Primary backend stack.',
        stats: ['Python', 'Django REST Framework', 'Team lead', 'Flask'],
        details: [
          'Designs REST APIs, microservices and RBAC-backed systems.',
          'Builds production software from requirements to deployment.',
          'Works across backend, data, integrations and frontend delivery.',
          'Leads delivery with architecture ownership and team coordination.',
        ],
      },
      {
        name: 'Data Rack',
        label: 'DB',
        asset: 'rack',
        description: 'Databases and ETL work.',
        stats: ['PostgreSQL', 'ClickHouse', 'MySQL', 'MongoDB', 'ETL'],
        details: [
          'Models and optimizes data-heavy products.',
          'Creates and optimizes MongoDB queries and aggregation pipelines using indexes efficiently.',
          'Certified in ClickHouse data modeling, querying and analysis.',
        ],
      },
      {
        name: 'Cloud Sled: AWS + GCP',
        label: 'CLOUD',
        asset: 'kettlebell',
        description: 'AWS, Google Cloud Platform and DevOps loadout.',
        stats: ['Fargate', 'SageMaker', 'SQS', 'SNS', 'GCP Functions'],
        details: [
          'Deploys with Docker, Docker Compose, Nginx and CI/CD.',
          'Works with AWS Lambda, EC2, S3, SQS, SNS, SageMaker and Fargate.',
          'Builds GCP Cloud Functions to process emails and automate serverless workflows.',
          'Integrates services for real-time workflows and automation.',
        ],
      },
    ],
  },
  {
    id: 'etreew',
    company: 'Etreew',
    role: 'Development Team Lead / Software Engineer',
    period: 'Nov 2024 - Present',
    theme: 'Leadership lane with solar operations, field testing and platform architecture.',
    wod: 'For time: team lead + platform build',
    stations: [
      {
        name: 'Voltia Platform',
        label: 'VOL',
        asset: 'barbell',
        description: 'Product leadership from operational need to production software.',
        stats: ['Team lead', 'Product discovery', 'Vue.js', 'Django REST Framework', 'PostgreSQL', 'Docker'],
        details: [
          'Captures requirements directly from company operations and translates them into functional product requirements.',
          'Designs and implements those workflows across the product, from architecture to production.',
          'Leads the development team by planning and assigning work, then reviewing each implementation.',
          'Mentors the developer on the team through pairing, technical guidance and code review.',
        ],
      },
      {
        name: 'Lebana',
        label: 'LEB',
        asset: 'docker',
        description: 'Product modernization and complete server migration.',
        stats: ['Server migration', 'Nginx', 'Docker', 'GitHub Actions', 'CI/CD'],
        details: [
          'Ships new business requirements into production.',
          'Redesigned the customer-facing application for performance and usability.',
          'Led a migration from monolith to microservices.',
          'Migrated the complete server environment, including Nginx configuration and production routing.',
          'Containerized deployment with Docker and automated delivery through GitHub Actions CI/CD.',
        ],
      },
      {
        name: 'Corporate Sites',
        label: 'WEB',
        asset: 'terminal',
        description: 'End-to-end design and deployment.',
        details: [
          'Built and deployed CosmasTitle, Sendigo Finance and Atlantic Basin Energy.',
          'Packaged environments with Docker and routed multiple domains through Nginx.',
        ],
      },
    ],
  },
  {
    id: 'kods',
    company: 'KODS',
    role: 'Software Engineer',
    period: 'Nov 2020 - Feb 2025',
    theme: 'Logistics systems for fiscal documents, email automation, ML, reporting and microservice delivery.',
    wod: 'EMOM: validate, analyze, report, deploy',
    stations: [
      {
        name: 'Tax PDF + XML Validator',
        label: 'PDF',
        asset: 'pdf',
        description: 'Two critical fiscal-document systems for freight logistics.',
        stats: ['Tax PDF', 'XML validation', 'National specification'],
        details: [
          'Designed and implemented the tax-document PDF generator used by the logistics workflow.',
          'Built an equally critical XML validator aligned with the national tax specification.',
          'Converted complex fiscal rules into clear validation results before documents entered the workflow.',
        ],
      },
      {
        name: 'Company Email Analyzer',
        label: 'MAIL',
        asset: 'terminal',
        description: 'Automated document detection and event-driven actions.',
        stats: ['Email processing', 'Document detection', 'Automation'],
        details: [
          'Analyzed the company mailbox to detect when specific document types were sent or received.',
          'Classified each document and triggered the correct business action for its type.',
          'Turned a manual monitoring process into an automated operational workflow.',
        ],
      },
      {
        name: 'SageMaker Model',
        label: '92%',
        asset: 'kettlebell',
        description: 'Cost-estimation model.',
        stats: ['92% accuracy', 'Amazon SageMaker'],
        details: [
          'Built a cost-estimation model that reached 92% accuracy.',
          'Integrated Google Maps APIs for geolocation and freight route planning.',
        ],
      },
      {
        name: 'Report Architecture',
        label: 'RPT',
        asset: 'rack',
        description: 'Scalable on-demand reporting for hundreds of users.',
        stats: ['Hundreds of users', 'AWS Fargate', 'Async reports'],
        details: [
          'Designed the architecture for reports executed on demand by hundreds of users.',
          'Moved expensive report generation into isolated AWS Fargate workloads.',
          'Protected the main application while allowing report processing to scale independently.',
        ],
      },
      {
        name: 'Microservice Release Platform',
        label: 'CI',
        asset: 'docker',
        description: 'Automated delivery and real-time services across the platform.',
        stats: ['7+ microservices', 'GitHub Actions', 'Firestore chat'],
        details: [
          'Implemented GitHub Actions CI/CD pipelines for more than seven microservices.',
          'Standardized repeatable build, test and deployment workflows across services.',
          'Built a real-time operational chat using Google Firestore.',
        ],
      },
    ],
  },
  {
    id: 'itmx',
    company: 'ITMX',
    role: 'Software Engineer',
    period: 'Dec 2023 - Oct 2024',
    theme: 'Modernization lane for carbon, automation and shared libraries.',
    wod: 'Chipper: performance + automation',
    stations: [
      {
        name: 'CarbonQuota',
        label: 'CO2',
        asset: 'rack',
        description: 'Carbon emissions management platform.',
        stats: ['20% faster loads', '73% faster table loading', '10+ features'],
        details: [
          'Integrated SendGrid API for automated email marketing.',
          'Optimized site performance and table pagination.',
          'Generated signed PDF documents from HTML content.',
        ],
      },
      {
        name: 'Aria',
        label: 'ARIA',
        asset: 'terminal',
        description: 'Modernization and automation.',
        details: [
          'Helped evolve a large single-script monolithic solution.',
          'Migrated the workflow to a web application to improve UX and operations.',
        ],
      },
      {
        name: 'Shared Email Library',
        label: 'MAIL',
        asset: 'barbell',
        description: 'Reusable integration layer.',
        details: [
          'Extracted repeated email-sending logic into a shared library.',
          'Built template inheritance and extension support around Resend.',
        ],
      },
    ],
  },
  {
    id: 'early',
    company: 'Early Wins',
    role: 'Engineer / Lecturer',
    period: '2018 - 2023',
    theme: 'Final lane for teaching, public health systems and awards.',
    wod: 'Benchmark: impact under pressure',
    stations: [
      {
        name: 'CUJAE Lecturer',
        label: 'UNI',
        asset: 'professor',
        description: 'Computer Engineering faculty work.',
        details: [
          'Taught Calculus I, Calculus III and Numerical Methods.',
          'Reviewed theses and served on internship evaluation panels.',
        ],
      },
      {
        name: 'Gemalab PCR Flow',
        label: 'PCR',
        asset: 'map',
        description: 'Hospital molecular genetics workflow.',
        details: [
          'Built a system to manage PCR sample flow.',
          'Reduced processing time and data-entry errors while tripling report speed.',
        ],
      },
      {
        name: 'Awards Board',
        label: 'PR',
        asset: 'medal',
        description: 'Recognition and programming contests.',
        stats: ['CITMA First Prize', 'Global Game Jam award', '1.5M+ people processed'],
        details: [
          'Built Cola.cu, a COVID-19 queue-control system used at national scale.',
          'Won awards in innovation, computing contests and game development.',
        ],
      },
    ],
  },
];
