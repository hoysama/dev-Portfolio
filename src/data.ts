export interface Project {
  id: string;
  title: {
    en: string;
    ar: string;
  };
  subtitle: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  liveUrl?: string;
  docsUrl?: string;
  image: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'resume-architect-pro',
    title: {
      en: 'Resume Architect Pro',
      ar: 'Resume Architect Pro',
    },
    subtitle: {
      en: 'AI-Powered Career & Resume Intelligence',
      ar: 'منصة ذكاء اصطناعي لبناء وتقييم السير الذاتية',
    },
    description: {
      en: 'An intelligent platform for crafting ATS-compliant professional resumes with real-time scoring and seamless payment gateway integration.',
      ar: 'منصة متقدمة لبناء السير الذاتية المتوافقة مع معايير الـ ATS العالمية، مع خوارزميات تقييم ذكية وبوابات دفع إلكترونية متكاملة.',
    },
    liveUrl: 'https://resumearchitectpro.com',
    image: '/projects/resume-architect.png',
  },
  {
    id: 'postnode',
    title: {
      en: 'PostNode',
      ar: 'PostNode',
    },
    subtitle: {
      en: 'Serverless Mailbox Hub & Developer API',
      ar: 'منظومة بريد سحابية وبوابة خدمات الـ API',
    },
    description: {
      en: 'High-performance email routing and temporary mailbox engine designed for developers, automated workflows, and instant webhook delivery.',
      ar: 'منظومة سحابية فائقة السرعة لإدارة وتوجيه البريد الإلكتروني، وتوفير صناديق بريد مؤقتة مع واجهات برمجية متطورة للربط والتشغيل الآلي.',
    },
    liveUrl: 'https://portal.nabehapp.com',
    docsUrl: 'https://docs.nabehapp.com',
    image: '/projects/postnode.png',
  },
  {
    id: 'pigeon-pedigree',
    title: {
      en: 'Pigeon Pedigree Generator',
      ar: 'Pigeon Pedigree Generator',
    },
    subtitle: {
      en: 'Precision Lineage & Pedigree Architecture',
      ar: 'محرك حسابات الأنساب وشجرات السلالات',
    },
    description: {
      en: 'Bio-informatics tool generating 5-generation pedigree family trees and lineage certificates with dynamic SVG rendering at edge speeds.',
      ar: 'منصة بيولوجية متخصصة لتوليد ورسم شجرات الأنساب الوراثية حتى 5 أجيال، وإصدار شهادات سلالات معتمدة بدقة متناهية وسرعة فائقة.',
    },
    liveUrl: 'https://pipedigree.win',
    image: '/projects/pigeon-pedigree.png',
  },
  {
    id: 'nabehapp-web',
    title: {
      en: 'Nabeh Platform',
      ar: 'منصة نبه (Nabeh)',
    },
    subtitle: {
      en: 'Cloud Gateway & Enterprise Ecosystem',
      ar: 'البوابة السحابية الموحدة لشبكة الخدمات',
    },
    description: {
      en: 'Central ecosystem gateway hosting developer documentation, client portals, and edge services under unified Anycast routing.',
      ar: 'البوابة المركزية والمظلة السحابية الشاملة التي تحتضن خدمات المنظومة، وتوثيق المطورين، وبوابات العملاء بأعلى معايير التوافر السحابي.',
    },
    liveUrl: 'https://nabehapp.com',
    image: '/projects/nabehapp.png',
  },
];

export const TECH_CATEGORIES = [
  {
    title: { en: 'Cloudflare Ecosystem', ar: 'منظومة Cloudflare' },
    items: ['Workers Engine', 'Durable Objects (Real-time)', 'Cloudflare D1 (SQL)', 'KV & R2 Storage', 'Turnstile & Tunnels'],
  },
  {
    title: { en: 'Architecture & Backend', ar: 'المعمارية والباك إند' },
    items: ['TypeScript / Bun Runtime', 'REST & Edge APIs', 'WebSockets Concurrency', 'Scheduled Cron Pipelines', 'Encrypted State Vaults'],
  },
  {
    title: { en: 'Modern Frontend', ar: 'الواجهات الحديثة' },
    items: ['Next.js / React', 'Tailwind CSS Architecture', 'Vite & High-Perf Bundles', 'Bilingual Responsive UI', '3D WebGL / Three.js'],
  },
  {
    title: { en: 'Fintech & Bots', ar: 'الدفع والأتمتة' },
    items: ['Moyasar Payment Gateway', 'Apple Pay & PayPal', 'Telegram Bot Platform', 'Telegram Mini Apps', 'OAuth 2.0 Providers'],
  },
];
