// ============================================================
// MODERN 3D WEB EXPERIENCE - MAIN ENTRY POINT
// ============================================================

import './style.css';

// ---- Core Libraries ----
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import AOS from 'aos';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'aos/dist/aos.css';

// ---- Local Modules ----
import { Loader } from './components/Loader.js';
import { MainScene } from './scenes/MainScene.js';
import { ScrollAnimations } from './animations/ScrollAnimations.js';
import { ParallaxEffect } from './effects/ParallaxEffect.js';
import { CityParallax } from './effects/CityParallax.js';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// ============================================================
// APPLICATION CLASS
// ============================================================

class App {
  constructor() {
    this.lenis = null;
    this.mainScene = null;
    this.scrollAnimations = null;
    this.parallaxEffect = null;
    this.cityParallax = null;
    this.swiper = null;

    this.init();
  }

  init() {
    const loader = new Loader();
    loader.start(() => {
      this.initLenis();
      this.initCityParallax();
      this.initThreeScene();
      this.initScrollAnimations();
      this.initParallaxEffect();
      this.initParticles();
      this.initSwiper();
      this.initAOS();
      this.initBarba();
    });
  }

  // ---- City Parallax ----
  initCityParallax() {
    this.cityParallax = new CityParallax();
  }

  // ---- Lenis Smooth Scroll ----
  initLenis() {
    this.lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    // Connect Lenis to GSAP ticker
    gsap.ticker.add((time) => {
      this.lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Connect Lenis to ScrollTrigger
    this.lenis.on('scroll', ScrollTrigger.update);

    // Lenis scroll events
    this.lenis.on('scroll', (e) => {
      this.onScroll(e);
    });
  }

  onScroll(e) {
    // Update nav appearance
    const nav = document.querySelector('.nav');
    if (nav) {
      if (e.scroll > 50) {
        nav.style.backdropFilter = 'blur(20px)';
        nav.style.background = 'rgba(0, 0, 0, 0.8)';
      } else {
        nav.style.backdropFilter = 'blur(0px)';
        nav.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%)';
      }
    }
  }

  // ---- Three.js Scene ----
  initThreeScene() {
    const canvas = document.querySelector('#three-canvas');
    if (canvas) {
      this.mainScene = new MainScene(canvas);
    }
  }

  // ---- GSAP Scroll Animations ----
  initScrollAnimations() {
    this.scrollAnimations = new ScrollAnimations();

    // Refresh ScrollTrigger after Lenis is ready
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300);
  }

  // ---- Parallax Effect ----
  initParallaxEffect() {
    this.parallaxEffect = new ParallaxEffect();
  }

  // ---- tsParticles ----
  async initParticles() {
    try {
      const { tsParticles } = await import('@tsparticles/engine');
      const { loadSlim } = await import('@tsparticles/slim');

      await loadSlim(tsParticles);

      await tsParticles.load({
        id: 'tsparticles',
        options: {
          fullScreen: { enable: false },
          background: { color: { value: 'transparent' } },
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: { enable: true, mode: 'repulse' },
              onClick: { enable: true, mode: 'push' },
            },
            modes: {
              repulse: { distance: 100, duration: 0.4 },
              push: { quantity: 4 },
            },
          },
          particles: {
            color: { value: ['#7b2fff', '#00ffcc', '#ff2fff', '#ffffff'] },
            links: {
              color: '#7b2fff',
              distance: 150,
              enable: true,
              opacity: 0.15,
              width: 1,
            },
            move: {
              direction: 'none',
              enable: true,
              outModes: { default: 'bounce' },
              random: true,
              speed: 0.8,
              straight: false,
            },
            number: { density: { enable: true, area: 1200 }, value: 60 },
            opacity: { value: { min: 0.1, max: 0.4 } },
            shape: { type: 'circle' },
            size: { value: { min: 1, max: 3 } },
          },
          detectRetina: true,
        },
      });
    } catch (error) {
      console.warn('tsParticles failed to load:', error);
    }
  }

  // ---- Swiper Slider ----
  initSwiper() {
    const swiperEl = document.querySelector('.mySwiper');
    if (!swiperEl) return;

    this.swiper = new Swiper('.mySwiper', {
      modules: [Navigation, Pagination, Autoplay],
      slidesPerView: 'auto',
      spaceBetween: 24,
      centeredSlides: false,
      loop: true,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        320: { slidesPerView: 1.2, spaceBetween: 16 },
        640: { slidesPerView: 1.8, spaceBetween: 20 },
        1024: { slidesPerView: 2.8, spaceBetween: 24 },
        1280: { slidesPerView: 3.2, spaceBetween: 24 },
      },
      grabCursor: true,
    });
  }

  // ---- AOS (Animate on Scroll) ----
  initAOS() {
    AOS.init({
      duration: 900,
      easing: 'ease-out-quart',
      once: true,
      offset: 60,
    });
  }

  // ---- Barba.js Page Transitions ----
  async initBarba() {
    try {
      const barba = await import('@barba/core');
      // Only init Barba if multiple pages exist; in single-page demo just log
      console.log('[Barba.js] Available for page transitions.');
    } catch (e) {
      console.warn('[Barba.js] Not configured for this demo.');
    }
  }
}

// ============================================================
// BOOT
// ============================================================

// Prevent FOUC
document.documentElement.style.visibility = 'hidden';

window.addEventListener('DOMContentLoaded', () => {
  document.documentElement.style.visibility = 'visible';
  window.__app = new App();
});

// ============================================================
// OPTIONAL EXTRAS — demonstrate other imported libraries
// ============================================================

// Anime.js demo (runs a quick test animation on a hidden element)
import('animejs').then(({ default: anime }) => {
  const el = document.querySelector('.loader__bar');
  if (!el) return;
  anime({
    targets: el,
    opacity: [0, 1],
    duration: 500,
    easing: 'easeInOutQuad',
  });
}).catch(() => {});

// ScrollReveal demo
import('scrollreveal').then(({ default: ScrollReveal }) => {
  const sr = ScrollReveal({
    reset: false,
    distance: '30px',
    duration: 800,
    delay: 100,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
  });

  sr.reveal('.stat__label', { interval: 100, origin: 'bottom' });
  sr.reveal('.footer__copy', { origin: 'left', delay: 200 });
  sr.reveal('.footer__stack', { origin: 'right', delay: 200 });
}).catch(() => {});
