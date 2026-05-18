import './style.css';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Loader } from './components/Loader.js';
import { MainScene } from './scenes/MainScene.js';
import { ScrollAnimations } from './animations/ScrollAnimations.js';
import { CityParallax } from './effects/CityParallax.js';

gsap.registerPlugin(ScrollTrigger);

class App {
  constructor() {
    this.lenis = null;
    this.mainScene = null;
    this.scrollAnimations = null;
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
      this.initParticles();
      this.initSwiper();
    });
  }

  initLenis() {
    this.lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    gsap.ticker.add((time) => { this.lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    this.lenis.on('scroll', ScrollTrigger.update);
  }

  initCityParallax() {
    this.cityParallax = new CityParallax();
  }

  initThreeScene() {
    const canvas = document.querySelector('#three-canvas');
    if (canvas) this.mainScene = new MainScene(canvas);
  }

  initScrollAnimations() {
    this.scrollAnimations = new ScrollAnimations();
    setTimeout(() => ScrollTrigger.refresh(), 500);
  }

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
              repulse: { distance: 80, duration: 0.4 },
              push: { quantity: 3 },
            },
          },
          particles: {
            color: { value: ['#6633ff', '#00d4ff', '#ff2fff', '#ffffff'] },
            links: {
              color: '#6633ff',
              distance: 150,
              enable: true,
              opacity: 0.1,
              width: 1,
            },
            move: {
              direction: 'none',
              enable: true,
              outModes: { default: 'bounce' },
              random: true,
              speed: 0.6,
              straight: false,
            },
            number: { density: { enable: true, area: 1200 }, value: 50 },
            opacity: { value: { min: 0.08, max: 0.3 } },
            shape: { type: 'circle' },
            size: { value: { min: 1, max: 2.5 } },
          },
          detectRetina: true,
        },
      });
    } catch (e) {
      console.warn('tsParticles:', e);
    }
  }

  initSwiper() {
    if (!document.querySelector('.mySwiper')) return;

    this.swiper = new Swiper('.mySwiper', {
      modules: [Navigation, Pagination, Autoplay],
      slidesPerView: 'auto',
      spaceBetween: 24,
      loop: true,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      pagination: { el: '.swiper-pagination', clickable: true },
      breakpoints: {
        320: { slidesPerView: 1.2, spaceBetween: 16 },
        640: { slidesPerView: 1.8, spaceBetween: 20 },
        1024: { slidesPerView: 2.8, spaceBetween: 24 },
        1280: { slidesPerView: 3.2, spaceBetween: 24 },
      },
      grabCursor: true,
    });
  }
}

document.documentElement.style.visibility = 'hidden';

window.addEventListener('DOMContentLoaded', () => {
  document.documentElement.style.visibility = 'visible';
  window.__app = new App();
});
