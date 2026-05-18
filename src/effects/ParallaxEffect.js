import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mouse } from '@/core/mouse.js';

export class ParallaxEffect {
  constructor() {
    this.smoothMouse = { x: 0, y: 0 };
    this.layers = [];
    this.isRunning = false;
    this.rafId = null;
    this.ctx = null;

    this.init();
  }

  init() {
    this.ctx = gsap.context(() => {
      this.collectLayers();
      this.setupScrollParallax();
    });
    this.startLoop();
  }

  collectLayers() {
    document.querySelectorAll('[data-parallax-speed]').forEach((el) => {
      this.layers.push({
        el,
        speed: parseFloat(el.dataset.parallaxSpeed) || -0.3,
      });
    });
  }

  setupScrollParallax() {
    this.layers.forEach(({ el, speed }) => {
      const section = el.closest('section') || el.parentElement;
      gsap.fromTo(el, { y: 0 }, {
        y: () => section.offsetHeight * speed * 1.5,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    });

    gsap.to('.hero__canvas', {
      y: -100,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
    });

    const aboutText = document.querySelector('.about__text');
    if (aboutText) {
      gsap.fromTo(aboutText, { y: 50 }, {
        y: -30,
        ease: 'none',
        scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: 1.5 },
      });
    }

    const contactOrb = document.querySelector('.contact__bg-orb');
    if (contactOrb) {
      gsap.fromTo(contactOrb, { y: 100, scale: 0.8 }, {
        y: -80,
        scale: 1.2,
        ease: 'none',
        scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
    }

    document.querySelectorAll('.panel__visual').forEach((visual) => {
      gsap.fromTo(visual, { scale: 0.9 }, {
        scale: 1.05,
        ease: 'none',
        scrollTrigger: {
          trigger: visual.closest('.work__panel'),
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: true,
        },
      });
    });
  }

  startLoop() {
    this.isRunning = true;
    const tick = () => {
      if (!this.isRunning) return;

      this.smoothMouse.x += (mouse.normX - this.smoothMouse.x) * 0.08;
      this.smoothMouse.y += (mouse.normY - this.smoothMouse.y) * 0.08;

      document.querySelectorAll('[data-mouse-parallax]').forEach((el) => {
        const depth = parseFloat(el.dataset.mouseDepth) || 0.05;
        gsap.set(el, {
          x: this.smoothMouse.x * depth * 100,
          y: this.smoothMouse.y * depth * 100,
        });
      });

      const glassCard = document.querySelector('.glass-card');
      if (glassCard) {
        gsap.to(glassCard, {
          rotateY:  this.smoothMouse.x * 10,
          rotateX: -this.smoothMouse.y * 8,
          duration: 0.5,
          ease: 'power2.out',
          transformPerspective: 800,
        });
      }

      const heroContent = document.querySelector('.hero__content');
      if (heroContent) {
        gsap.set(heroContent, {
          x: this.smoothMouse.x * -8,
          y: this.smoothMouse.y * -5,
        });
      }

      this.rafId = requestAnimationFrame(tick);
    };
    tick();
  }

  destroy() {
    this.isRunning = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.ctx?.revert();
  }
}
