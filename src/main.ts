import { init3DScene } from './scene';
import { PROJECTS, Project } from './data';

const TRANSLATIONS: Record<'ar' | 'en', Record<string, string>> = {
  ar: {
    hud_name: 'عبدالله عجاج',
    lang_label: 'English',
    hero_title: 'عالم من الحلول والأنظمة السحابية',
    hero_subtitle:
      'أهلاً بك، أنا <strong>عبدالله عجاج</strong>…<br>أصمم وأبني بنى تحتية سحابية متكاملة وأنظمة برمجية موزعة فائقة الأداء.',
    hint_text: 'مرّر لتبدأ الرحلة',
    about_tag: 'نبذة عني',
    about_title: 'أهلاً، أنا عبدالله',
    about_body:
      'أهتم بتحويل الرؤى والأفكار الطموحة إلى منصات سحابية رشيقة وموثوقة، وتصميم أنظمة رقمية متكاملة تمنح المشاريع أعلى معايير الاستقرار والسرعة وقابلية التوسع.',
    proj_tag: 'الأعمال والمشاريع',
    proj_title: 'مشاريع ومنصات قيد التشغيل',
    contact_tag: 'المحطة الختامية',
    contact_title: 'لنبنِ شيئاً استثنائياً معاً',
    contact_body:
      'يسعدني دائماً التواصل حول المشاريع الجديدة، واستشارات المعمارية السحابية، والتعاون الإبداعي.',
    cta_telegram: 'محادثة مباشرة عبر تليجرام',
    btn_visit: 'زيارة المنصة',
    btn_docs: 'التوثيق',
  },
  en: {
    hud_name: 'Abdullah Ajaj',
    lang_label: 'العربية',
    hero_title: 'A World of Cloud Systems & Architecture',
    hero_subtitle:
      "Welcome, I'm <strong>Abdullah Ajaj</strong>…<br>Architecting and engineering high-performance serverless platforms and resilient distributed systems.",
    hint_text: 'Scroll to explore the journey',
    about_tag: 'About Me',
    about_title: "Hello, I'm Abdullah",
    about_body:
      'I specialize in turning ambitious visions into resilient, high-performance cloud platforms and end-to-end software architectures engineered for stability, velocity, and scale.',
    proj_tag: 'Featured Works',
    proj_title: 'Production Platforms in Action',
    contact_tag: 'Destination',
    contact_title: "Let's Create Something Extraordinary",
    contact_body:
      'Always open for new projects, cloud architecture consulting, and extraordinary collaborations.',
    cta_telegram: 'Chat on Telegram',
    btn_visit: 'Visit Platform',
    btn_docs: 'Docs',
  },
};

let currentLang: 'ar' | 'en' = (localStorage.getItem('preferred_lang') as 'ar' | 'en') || 'ar';
let activeProjectIndex = 0;
let scene: ReturnType<typeof init3DScene> | null = null;

// DOM elements
const htmlRoot = document.documentElement;
const langToggleBtn = document.getElementById('lang-toggle-btn');
const langLabel = document.getElementById('lang-label');
const railFill = document.getElementById('rail-fill');
const railSteps = document.querySelectorAll('.rail-step');
const sceneCounter = document.getElementById('scene-counter');
const uiHint = document.getElementById('ui-hint');
const canvas = document.getElementById('gl') as HTMLCanvasElement;

const overlays = [
  document.getElementById('ov-hero'),
  document.getElementById('ov-about'),
  document.getElementById('ov-projects'),
  document.getElementById('ov-contact'),
];

const projectTabsContainer = document.getElementById('project-tabs');
const activeProjectCard = document.getElementById('active-project-card');
const projectDotsContainer = document.getElementById('project-dots');

// Apply Language
function applyLanguage(lang: 'ar' | 'en') {
  currentLang = lang;
  localStorage.setItem('preferred_lang', lang);

  htmlRoot.setAttribute('lang', lang);
  htmlRoot.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

  if (langLabel) {
    langLabel.textContent = lang === 'ar' ? 'English' : 'العربية';
  }

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key && TRANSLATIONS[lang][key]) {
      el.textContent = TRANSLATIONS[lang][key];
    }
  });

  const hTitle = document.getElementById('hero-title');
  const hSubtitle = document.getElementById('hero-subtitle');
  const hName = document.getElementById('hud-name');
  const hintEl = document.getElementById('hint-text');

  if (hTitle) hTitle.innerHTML = `<span class="grad">${TRANSLATIONS[lang].hero_title}</span>`;
  if (hSubtitle) hSubtitle.innerHTML = TRANSLATIONS[lang].hero_subtitle;
  if (hName) hName.textContent = TRANSLATIONS[lang].hud_name;
  if (hintEl) hintEl.textContent = TRANSLATIONS[lang].hint_text;

  renderProjectViewer();
}

// Render Project Viewer
function renderProjectViewer() {
  if (!projectTabsContainer || !activeProjectCard || !projectDotsContainer) return;

  // Render Tabs
  projectTabsContainer.innerHTML = PROJECTS.map((p, idx) => {
    const isAct = idx === activeProjectIndex;
    return `
      <button class="proj-tab px-4 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
        isAct ? 'active' : 'text-white/70 hover:text-white'
      }" data-idx="${idx}">
        ${p.title[currentLang]}
      </button>
    `;
  }).join('');

  // Add click to tabs
  projectTabsContainer.querySelectorAll('.proj-tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.getAttribute('data-idx'));
      activeProjectIndex = idx;
      renderProjectViewer();
      if (scene) {
        const targetRatio = 0.45 + ((idx + 0.5) / PROJECTS.length) * (0.80 - 0.45);
        scene.scrollToStage(targetRatio);
      }
    });
  });

  // Render Active Project Card
  const curr = PROJECTS[activeProjectIndex];
  const visitText = TRANSLATIONS[currentLang].btn_visit;
  const docsText = TRANSLATIONS[currentLang].btn_docs;

  const liveLink = curr.liveUrl
    ? `<a href="${curr.liveUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#9068D1] to-[#4A356B] hover:from-[#8862C6] hover:to-[#382654] text-white text-xs font-bold shadow-lg shadow-[#9068D1]/30 transition-all hover:scale-105">
        <span>${visitText}</span>
        <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
      </a>`
    : '';

  const docsLink = curr.docsUrl
    ? `<a href="${curr.docsUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#110616]/80 hover:bg-[#210D32] border border-[rgba(144,104,209,0.4)] text-white/90 text-xs font-medium transition-all">
        <span>${docsText}</span>
      </a>`
    : '';

  const domainName = curr.liveUrl ? new URL(curr.liveUrl).hostname : '';

  activeProjectCard.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
      <!-- Live Screenshot Luxury Frame -->
      <div class="lg:col-span-7">
        <a href="${curr.liveUrl || '#'}" target="_blank" rel="noopener noreferrer" class="block rounded-2xl overflow-hidden border border-[rgba(144,104,209,0.5)] bg-[#070408] shadow-2xl group hover:border-[#9068D1] transition-all">
          <div class="h-8 bg-[#110616] border-b border-[rgba(144,104,209,0.3)] flex items-center justify-between px-3.5">
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-[#9068D1]/80"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-[#8862C6]/50"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-[#4A356B]/60"></span>
            </div>
            <div class="text-[11px] font-mono text-[#c8b3ec] bg-[#070408]/90 px-3 py-0.5 rounded-full border border-[rgba(144,104,209,0.3)] truncate max-w-[220px]">
              https://${domainName}
            </div>
            <div class="w-6"></div>
          </div>
          <div class="relative overflow-hidden bg-[#070408] aspect-[16/10]">
            <img 
              src="${curr.image}" 
              alt="${curr.title[currentLang]}" 
              class="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
              loading="eager"
            />
          </div>
        </a>
      </div>

      <!-- Project Details -->
      <div class="lg:col-span-5 space-y-4 text-start">
        <div class="flex items-center justify-between border-b border-[rgba(144,104,209,0.25)] pb-3">
          <span class="luxury-pill text-[11px] font-bold text-white">
            <span class="grad">LIVE SYSTEM</span>
          </span>
          <span class="text-xs font-mono text-[#c8b3ec]">0${activeProjectIndex + 1} / 0${PROJECTS.length}</span>
        </div>

        <div>
          <h3 class="text-2xl sm:text-3xl font-bold text-white mb-2 shadow-title">${curr.title[currentLang]}</h3>
          <p class="text-xs font-semibold text-[#9068D1] mb-2 font-mono">${curr.subtitle[currentLang]}</p>
          <p class="text-xs sm:text-sm text-white/80 leading-relaxed font-light">${curr.description[currentLang]}</p>
        </div>

        <div class="flex items-center gap-3 pt-3">
          ${liveLink}
          ${docsLink}
        </div>
      </div>
    </div>
  `;

  // Render Dots
  projectDotsContainer.innerHTML = PROJECTS.map((_, idx) => `
    <button class="h-2 rounded-full transition-all cursor-pointer ${
      idx === activeProjectIndex ? 'bg-[#9068D1] w-6 shadow-md shadow-[#9068D1]' : 'bg-white/20 hover:bg-white/40 w-2'
    }" data-dot="${idx}"></button>
  `).join('');

  projectDotsContainer.querySelectorAll('button').forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = Number(dot.getAttribute('data-dot'));
      activeProjectIndex = idx;
      renderProjectViewer();
      if (scene) {
        const targetRatio = 0.45 + ((idx + 0.5) / PROJECTS.length) * (0.80 - 0.45);
        scene.scrollToStage(targetRatio);
      }
    });
  });
}

// Initialize 3D Scene
scene = init3DScene(canvas, {
  onProgress: (p, stageIndex) => {
    if (railFill) {
      railFill.style.height = `${p * 100}%`;
    }

    railSteps.forEach((step, idx) => {
      if (idx === stageIndex) step.classList.add('active');
      else step.classList.remove('active');
    });

    if (sceneCounter) {
      sceneCounter.textContent = `0${stageIndex + 1}`;
    }

    overlays.forEach((ov, idx) => {
      if (!ov) return;
      if (idx === stageIndex) {
        ov.classList.add('active');
      } else {
        ov.classList.remove('active');
      }
    });

    // Auto-advance active project based on progress inside stage 2 (0.45 to 0.80)
    if (p >= 0.45 && p <= 0.80) {
      const projProgress = (p - 0.45) / (0.80 - 0.45);
      const targetProjIdx = Math.min(PROJECTS.length - 1, Math.floor(projProgress * PROJECTS.length));
      if (targetProjIdx !== activeProjectIndex) {
        activeProjectIndex = targetProjIdx;
        renderProjectViewer();
      }
    }

    if (uiHint) {
      uiHint.style.opacity = p > 0.02 ? '0' : '1';
    }
  },
});

// Rail click-to-scroll
const STAGE_RATIOS = [0.0, 0.30, 0.62, 0.95];
railSteps.forEach((btn, idx) => {
  btn.addEventListener('click', () => {
    const ratio = STAGE_RATIOS[idx] ?? 0;
    scene?.scrollToStage(ratio);
  });
});

langToggleBtn?.addEventListener('click', () => {
  const nextLang = currentLang === 'ar' ? 'en' : 'ar';
  applyLanguage(nextLang);
});

document.addEventListener('DOMContentLoaded', () => {
  applyLanguage(currentLang);
});
