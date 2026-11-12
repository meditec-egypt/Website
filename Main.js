/**
 * MediTec Egypt - main.js
 * Language switcher (EN/AR + RTL), smooth scroll with offset, scroll spy,
 * mobile menu, scroll animations, and contact-form validation (ready for use).
 */
(() => {
  'use strict';

  const NAV_OFFSET = 80;
  const STORAGE_KEY = 'meditec-lang';
  const TITLES = {
    en: 'MediTec Egypt | Orthopedic Implants & Surgical Instruments',
    ar: 'ميديتك مصر | غرسات العظام والأدوات الجراحية'
  };
  const DESCRIPTIONS = {
    en: 'Your trusted partner in orthopedic solutions. High-quality implants and surgical instruments for surgeons and hospitals across Egypt.',
    ar: 'شريكك الموثوق في حلول جراحة العظام. غرسات وأدوات جراحية عالية الجودة للجراحين والمستشفيات في مصر.'
  };

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  /* ---------- Safe localStorage helpers ---------- */
  const readStorage = (key) => {
    try { return localStorage.getItem(key); } catch { return null; }
  };
  const writeStorage = (key, value) => {
    try { localStorage.setItem(key, value); } catch { /* storage unavailable */ }
  };

  /* ---------- Language switcher ---------- */
  const applyLanguage = (lang) => {
    const isArabic = lang === 'ar';
    const root = document.documentElement;

    root.lang = lang;
    root.dir = isArabic ? 'rtl' : 'ltr';

    $$('[data-en][data-ar]').forEach((el) => {
      el.textContent = el.dataset[lang];
    });

    document.title = TITLES[lang];
    const meta = $('meta[name="description"]');
    if (meta) meta.setAttribute('content', DESCRIPTIONS[lang]);

    const toggleText = $('#lang-toggle-text');
    const toggleBtn = $('#lang-toggle');
    if (toggleText) toggleText.textContent = isArabic ? 'EN' : 'AR';
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-label', isArabic ? 'Switch language to English' : 'التبديل إلى العربية');
    }
  };

  const initLanguage = () => {
    const toggleBtn = $('#lang-toggle');
    if (!toggleBtn) return;

    const saved = readStorage(STORAGE_KEY);
    if (saved === 'ar') applyLanguage('ar');

    toggleBtn.addEventListener('click', () => {
      const next = document.documentElement.lang === 'ar' ? 'en' : 'ar';
      document.body.classList.add('is-switching');
      setTimeout(() => {
        applyLanguage(next);
        writeStorage(STORAGE_KEY, next);
        document.body.classList.remove('is-switching');
      }, 300);
    });
  };

  /* ---------- Mobile menu ---------- */
  const initMobileMenu = () => {
    const hamburger = $('#hamburger');
    const menu = $('#nav-menu');
    if (!hamburger || !menu) return;

    const setOpen = (open) => {
      menu.classList.toggle('is-open', open);
      hamburger.classList.toggle('is-active', open);
      hamburger.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('menu-open', open);
    };

    hamburger.addEventListener('click', () => setOpen(!menu.classList.contains('is-open')));

    // Close when a link is clicked (event delegation)
    menu.addEventListener('click', (e) => {
      if (e.target.closest('.nav__link')) setOpen(false);
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (menu.classList.contains('is-open') && !e.target.closest('#nav-menu, #hamburger')) {
        setOpen(false);
      }
    });

    // Close on Escape or when resizing to desktop
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setOpen(false);
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) setOpen(false);
    });
  };

  /* ---------- Smooth scroll with fixed-navbar offset ---------- */
  const initSmoothScroll = () => {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const hash = link.getAttribute('href');
      if (hash.length < 2) return;
      const target = document.getElementById(hash.slice(1));
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - (hash === '#home' ? 0 : NAV_OFFSET - 1);
      window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
      history.replaceState(null, '', hash);
    });
  };

  /* ---------- Header shadow + active nav item ---------- */
  const initScrollSpy = () => {
    const header = $('#header');
    const links = $$('.nav__link');
    const sections = links
      .map((link) => document.getElementById(link.getAttribute('href').slice(1)))
      .filter(Boolean);

    const update = () => {
      if (header) header.classList.toggle('is-scrolled', window.scrollY > 10);

      const position = window.scrollY + NAV_OFFSET + 40;
      let currentId = sections.length ? sections[0].id : '';
      sections.forEach((section) => {
        if (section.offsetTop <= position) currentId = section.id;
      });
      // Bottom of page: highlight last section
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2 && sections.length) {
        currentId = sections[sections.length - 1].id;
      }

      links.forEach((link) => {
        const active = link.getAttribute('href') === `#${currentId}`;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    };

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { update(); ticking = false; });
    }, { passive: true });
    update();
  };

  /* ---------- Scroll animations (Intersection Observer) ---------- */
  const initScrollAnimations = () => {
    const items = $$('.fade-in');
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach((el) => observer.observe(el));
  };

  /* ---------- Form validation (prepared for future use) ---------- */
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const FORM_MESSAGES = {
    en: { required: 'This field is required.', email: 'Please enter a valid email address.' },
    ar: { required: 'هذا الحقل مطلوب.', email: 'يرجى إدخال بريد إلكتروني صحيح.' }
  };

  const validateField = (field) => {
    const lang = document.documentElement.lang === 'ar' ? 'ar' : 'en';
    const value = field.value.trim();
    let message = '';

    if (field.required && !value) message = FORM_MESSAGES[lang].required;
    else if (field.type === 'email' && value && !EMAIL_REGEX.test(value)) message = FORM_MESSAGES[lang].email;

    const errorEl = field.parentElement.querySelector('.form__error');
    if (errorEl) errorEl.textContent = message;
    field.classList.toggle('is-invalid', Boolean(message));
    field.setAttribute('aria-invalid', String(Boolean(message)));
    return !message;
  };

  const initContactForm = () => {
    const form = $('#contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const valid = $$('input, textarea', form).map(validateField).every(Boolean);
      if (!valid) return;
      // TODO: connect to a backend or form service (e.g. Formspree) here.
      form.reset();
    });

    form.addEventListener('blur', (e) => {
      if (e.target.matches('input, textarea')) validateField(e.target);
    }, true);
  };

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    try {
      initLanguage();
      initMobileMenu();
      initSmoothScroll();
      initScrollSpy();
      initScrollAnimations();
      initContactForm();
    } catch (error) {
      // Fail silently in production; the page remains usable without JS enhancements.
    }
  });
})();
