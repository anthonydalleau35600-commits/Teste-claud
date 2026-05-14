/* ===========================================================
   Le Strike Bowling Redon — Interactivity
   =========================================================== */
(() => {
  'use strict';

  // ---------- LOADER ----------
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) setTimeout(() => loader.classList.add('is-done'), 350);
  });

  // ---------- FOOTER YEAR ----------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- NAV ----------
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 30);
  }, { passive: true });

  navToggle?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', open);
  });
  navLinks?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // ---------- SCROLL REVEAL ----------
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // ---------- HERO COUNTERS ----------
  const counters = document.querySelectorAll('[data-count]');
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCount(e.target);
          co.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => co.observe(c));
  }

  // ---------- PRICING TABS ----------
  const ptabs = document.querySelectorAll('.ptab');
  ptabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      ptabs.forEach(t => {
        t.classList.toggle('is-active', t === tab);
        t.setAttribute('aria-selected', t === tab);
      });
      document.querySelectorAll('[data-tab-target]').forEach(card => {
        card.classList.toggle('hidden', card.dataset.tabTarget !== target);
      });
    });
  });

  // ---------- SCHEDULE TABS ----------
  const stabs = document.querySelectorAll('.stab');
  stabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.period;
      stabs.forEach(t => {
        t.classList.toggle('is-active', t === tab);
        t.setAttribute('aria-selected', t === tab);
      });
      document.querySelectorAll('[data-period-content]').forEach(grid => {
        grid.classList.toggle('hidden', grid.dataset.periodContent !== target);
      });
    });
  });

  // ---------- OPEN / CLOSED STATUS ----------
  // Schedule: Mon=0..Sun=6 (we'll use JS getDay() with Sun=0)
  // Hors vacances: only Wed 14-20, Fri 17-1 next day, Sat 14-1 next day, Sun 14-19
  // Vacances scolaires: Mon-Thu 14-0 (midnight), Fri 14-1, Sat 14-1, Sun 14-19
  // For simplicity, we'll show the "hors vacances" schedule (the safer default).
  const statusCard = document.getElementById('statusCard');
  const statusText = document.getElementById('statusText');
  if (statusCard && statusText) {
    const now = new Date();
    const day = now.getDay(); // 0=Dim, 1=Lun, ...6=Sam
    const hour = now.getHours() + now.getMinutes() / 60;

    // Default to "hors vacances"
    const schedule = {
      0: [{ from: 14, to: 19 }],  // Dim
      3: [{ from: 14, to: 20 }],  // Mer
      5: [{ from: 17, to: 25 }],  // Ven (jusqu'à 1h = 25)
      6: [{ from: 14, to: 25 }],  // Sam (jusqu'à 1h)
    };

    let isOpen = false;
    let nextInfo = '';

    // Check current
    const today = schedule[day];
    if (today) {
      for (const slot of today) {
        if (hour >= slot.from && hour < slot.to) {
          isOpen = true;
          const closeAt = slot.to >= 24 ? `${slot.to - 24}h` : `${slot.to}h`;
          nextInfo = `Ouvert maintenant · ferme à ${closeAt}`;
          break;
        }
      }
    }
    // Yesterday late-night carry (e.g. Sat night → Sun 1am)
    if (!isOpen) {
      const prevDay = (day + 6) % 7;
      const prev = schedule[prevDay];
      if (prev) {
        for (const slot of prev) {
          if (slot.to > 24 && hour < slot.to - 24) {
            isOpen = true;
            nextInfo = `Ouvert maintenant · ferme à ${slot.to - 24}h`;
            break;
          }
        }
      }
    }

    if (!isOpen) {
      // Find next opening
      const labels = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
      for (let i = 0; i < 7; i++) {
        const d = (day + i) % 7;
        const slots = schedule[d];
        if (slots) {
          const slot = slots[0];
          if (i === 0 && hour >= slot.from) continue;
          const when = i === 0 ? "aujourd'hui" : i === 1 ? 'demain' : labels[d];
          nextInfo = `Fermé · ouvre ${when} à ${slot.from}h`;
          break;
        }
      }
      if (!nextInfo) nextInfo = 'Fermé';
    }

    statusCard.classList.add(isOpen ? 'is-open' : 'is-closed');
    statusText.textContent = nextInfo;
  }

  // ---------- BIRTHDAY ESTIMATOR ----------
  const kidsRange = document.getElementById('kidsRange');
  const kidsCount = document.getElementById('kidsCount');
  const bdayTotal = document.getElementById('bdayTotal');
  const bdayPerKid = document.getElementById('bdayPerKid');
  const bdayDetails = document.getElementById('bdayDetails');

  const PRICES = {
    base: 12,          // bowling + chaussures
    extra: { laser: 4, billard: 2, arcade: 3 },
    cake: 2,
    drinks: 3,
    gift: 2.5,
  };

  function computeBirthday() {
    if (!kidsRange) return;
    const kids = parseInt(kidsRange.value, 10);
    kidsCount.textContent = kids;
    const extraVal = document.querySelector('input[name="extra"]:checked')?.value || 'laser';
    const cake = document.getElementById('optCake').checked;
    const drinks = document.getElementById('optDrinks').checked;
    const gift = document.getElementById('optGift').checked;

    const perKid = PRICES.base
      + PRICES.extra[extraVal]
      + (cake ? PRICES.cake : 0)
      + (drinks ? PRICES.drinks : 0)
      + (gift ? PRICES.gift : 0);

    const total = perKid * kids;

    bdayTotal.textContent = total.toLocaleString('fr-FR');
    bdayPerKid.textContent = perKid.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    bdayDetails.innerHTML = '';
    const rows = [
      ['Bowling + chaussures', `${PRICES.base}€`],
      [`Activité : ${extraVal}`, `+${PRICES.extra[extraVal]}€`],
    ];
    if (cake)   rows.push(['Gâteau', `+${PRICES.cake}€`]);
    if (drinks) rows.push(['Boissons', `+${PRICES.drinks}€`]);
    if (gift)   rows.push(['Cadeau', `+${PRICES.gift}€`]);
    rows.push([`× ${kids} enfants`, '']);
    rows.forEach(([label, val]) => {
      const li = document.createElement('li');
      li.innerHTML = `<span>${label}</span><strong>${val}</strong>`;
      bdayDetails.appendChild(li);
    });
  }
  if (kidsRange) {
    document.querySelectorAll('.birthday__form input').forEach(el => {
      el.addEventListener('input', computeBirthday);
      el.addEventListener('change', computeBirthday);
    });
    computeBirthday();
  }

  // ---------- GALLERY LIGHTBOX ----------
  const lightbox = document.getElementById('lightbox');
  const lightboxArt = document.getElementById('lightboxArt');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('.gallery__item').forEach(item => {
    item.addEventListener('click', () => {
      const art = item.querySelector('.gallery__art');
      const caption = item.dataset.caption || '';
      if (!art) return;
      lightboxArt.className = art.className;
      lightboxCaption.textContent = caption;
      lightbox.hidden = false;
    });
  });
  function closeLightbox() { lightbox.hidden = true; }
  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
  });

  // ---------- BOOKING FORM ----------
  const form = document.getElementById('bookingForm');
  const success = document.getElementById('bookingSuccess');
  const dateInput = form?.querySelector('input[name="date"]');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const btn = form.querySelector('button[type="submit"]');
    const label = btn.querySelector('.btn__label');
    const originalLabel = label.textContent;
    label.textContent = 'Envoi…';
    btn.disabled = true;

    // Simulate request (no backend yet)
    setTimeout(() => {
      success.hidden = false;
      label.textContent = '✓ Envoyé';
      setTimeout(() => {
        form.reset();
        label.textContent = originalLabel;
        btn.disabled = false;
      }, 2500);
    }, 700);
  });

  // ---------- BACK TO TOP ----------
  const backTop = document.getElementById('backTop');
  window.addEventListener('scroll', () => {
    backTop.classList.toggle('is-visible', window.scrollY > 600);
  }, { passive: true });
  backTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---------- CANVAS PARTICLES BACKGROUND ----------
  const canvas = document.getElementById('bg-canvas');
  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let w, h, particles;
    const COLORS = ['#ff3d7f', '#7c3aed', '#22d3ee'];

    function resize() {
      w = canvas.width = window.innerWidth * window.devicePixelRatio;
      h = canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
    }
    function init() {
      const count = Math.min(60, Math.floor(window.innerWidth / 30));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + 0.6,
        vx: (Math.random() - 0.5) * 0.3 * window.devicePixelRatio,
        vy: (Math.random() - 0.5) * 0.3 * window.devicePixelRatio,
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      // Connect lines
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.hypot(dx, dy);
          const max = 140 * window.devicePixelRatio;
          if (dist < max) {
            ctx.strokeStyle = `rgba(255,61,127,${0.18 * (1 - dist / max)})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * window.devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    resize(); init(); draw();
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { resize(); init(); }, 200);
    });
  }
})();
