/* ============================================
   MAIN.JS — AI FORMATIONS SITE
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll effect ──────────────────
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ── Mobile nav toggle ─────────────────────
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const spans = navToggle.querySelectorAll('span');
      if (navLinks.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
  }

  // ── Scroll animations ─────────────────────
  const animEls = document.querySelectorAll('.animate-on-scroll');
  if (animEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.12 });
    animEls.forEach(el => observer.observe(el));
  }

  // ── FAQ accordion ─────────────────────────
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-question');
    if (q) {
      q.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(o => o.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    }
  });

  // ── Module accordion (course detail) ─────
  document.querySelectorAll('.module-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.module-item');
      item.classList.toggle('open');
    });
  });

  // ── Newsletter form ───────────────────────
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const email = input?.value?.trim();
      if (!email || !isValidEmail(email)) {
        showToast('Veuillez entrer un email valide.', 'error');
        return;
      }
      showToast('🎉 Bienvenue ! Vérifiez votre boîte mail.', 'success');
      input.value = '';
    });
  });

  // ── Contact form ──────────────────────────
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = contactForm.querySelector('#name')?.value?.trim();
      const email = contactForm.querySelector('#email')?.value?.trim();
      const message = contactForm.querySelector('#message')?.value?.trim();
      if (!name || !email || !message) {
        showToast('Merci de remplir tous les champs.', 'error');
        return;
      }
      if (!isValidEmail(email)) {
        showToast('Email invalide.', 'error');
        return;
      }
      const btn = contactForm.querySelector('.submit-btn');
      btn.disabled = true;
      btn.textContent = 'Envoi en cours…';
      setTimeout(() => {
        showToast('✅ Message envoyé ! Réponse sous 24h.', 'success');
        contactForm.reset();
        btn.disabled = false;
        btn.textContent = 'Envoyer le message';
      }, 1500);
    });
  }

  // ── Smooth scroll for anchor links ────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Typewriter effect (hero) ──────────────
  const typeEl = document.getElementById('typewriter');
  if (typeEl) {
    const words = ['ChatGPT', 'l\'automatisation', 'le business IA', 'les agents IA'];
    let wi = 0, ci = 0, deleting = false;
    const type = () => {
      const word = words[wi];
      typeEl.textContent = deleting ? word.substring(0, ci--) : word.substring(0, ci++);
      if (!deleting && ci > word.length) { deleting = true; setTimeout(type, 1800); return; }
      if (deleting && ci < 0) { deleting = false; wi = (wi + 1) % words.length; }
      setTimeout(type, deleting ? 60 : 100);
    };
    type();
  }

  // ── Counter animation ─────────────────────
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.done) {
          entry.target.dataset.done = true;
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => countObserver.observe(el));
  }

  // ── Countdown timer ───────────────────────
  initCountdown();

});

/* ── Helpers ─────────────────────────────── */

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showToast(msg, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(30px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1500;
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

function initCountdown() {
  const el = document.getElementById('countdown');
  if (!el) return;
  const end = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  const update = () => {
    const diff = Math.max(0, end - Date.now());
    const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
    const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    el.innerHTML = `<span>${h}</span>h <span>${m}</span>m <span>${s}</span>s`;
  };
  update();
  setInterval(update, 1000);
}

/* ── Payment modal (used by payment.js) ──── */
window.openPaymentModal = function(courseTitle, price, oldPrice) {
  const modal = document.getElementById('payment-modal');
  if (!modal) return;
  document.getElementById('modal-course-title').textContent = courseTitle;
  document.getElementById('modal-price').textContent = price;
  document.getElementById('modal-old-price').textContent = oldPrice || '';
  document.getElementById('modal-summary-price').textContent = price;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeModal = function(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
};

document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
    document.body.style.overflow = '';
  }
});
