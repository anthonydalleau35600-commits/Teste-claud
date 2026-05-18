import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class ParallaxEffect {
  constructor() {
    this.mouse = { x: 0, y: 0 };
    this.targetMouse = { x: 0, y: 0 };
    this.layers = [];
    this.isRunning = false;
    this.rafId = null;

    this.init();
  }

  init() {
    this.collectLayers();
    this.setupScrollParallax();
    this.setupMouseParallax();
    this.startLoop();
  }

  collectLayers() {
    // Collect all parallax elements
    const parallaxEls = document.querySelectorAll('[data-parallax-speed]');
    parallaxEls.forEach((el) => {
      this.layers.push({
        el,
        speed: parseFloat(el.dataset.parallaxSpeed) || -0.3,
        currentY: 0,
      });
    });

    // Mouse parallax layers (depth layers by index)
    const mouseEls = document.querySelectorAll('[data-mouse-parallax]');
    mouseEls.forEach((el) => {
      el.dataset.mouseDepth = el.dataset.mouseDepth || '0.05';
    });
  }

  setupScrollParallax() {
    // Background layers parallax with GSAP ScrollTrigger scrub
    this.layers.forEach(({ el, speed }) => {
      const section = el.closest('section') || el.parentElement;

      gsap.fromTo(
        el,
        { y: 0 },
        {
          y: () => section.offsetHeight * speed * 1.5,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    });

    // Parallax for floating shapes in hero
    const heroShapes = document.querySelectorAll('.hero__canvas');
    heroShapes.forEach((shape) => {
      gsap.to(shape, {
        y: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    });

    // About section - text parallax
    const aboutText = document.querySelector('.about__text');
    if (aboutText) {
      gsap.fromTo(
        aboutText,
        { y: 50 },
        {
          y: -30,
          ease: 'none',
          scrollTrigger: {
            trigger: '.about',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        }
      );
    }

    // Contact orb parallax
    const contactOrb = document.querySelector('.contact__bg-orb');
    if (contactOrb) {
      gsap.fromTo(
        contactOrb,
        { y: 100, scale: 0.8 },
        {
          y: -80,
          scale: 1.2,
          ease: 'none',
          scrollTrigger: {
            trigger: '.contact',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );
    }

    // Panel visuals depth effect
    const panelVisuals = document.querySelectorAll('.panel__visual');
    panelVisuals.forEach((visual) => {
      gsap.fromTo(
        visual,
        { scale: 0.9 },
        {
          scale: 1.05,
          ease: 'none',
          scrollTrigger: {
            trigger: visual.closest('.work__panel'),
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: true,
          },
        }
      );
    });
  }

  setupMouseParallax() {
    document.addEventListener('mousemove', (e) => {
      this.targetMouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      this.targetMouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Touch support
    document.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      this.targetMouse.x = (touch.clientX / window.innerWidth - 0.5) * 2;
      this.targetMouse.y = (touch.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  startLoop() {
    this.isRunning = true;
    const tick = () => {
      if (!this.isRunning) return;

      // Smooth mouse interpolation
      this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.08;
      this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.08;

      // Apply mouse parallax to elements with data-mouse-parallax
      const mouseEls = document.querySelectorAll('[data-mouse-parallax]');
      mouseEls.forEach((el) => {
        const depth = parseFloat(el.dataset.mouseDepth) || 0.05;
        const moveX = this.mouse.x * depth * 100;
        const moveY = this.mouse.y * depth * 100;
        gsap.set(el, { x: moveX, y: moveY });
      });

      // Glass card 3D tilt on mouse
      const glassCard = document.querySelector('.glass-card');
      if (glassCard) {
        const rotateY = this.mouse.x * 10;
        const rotateX = -this.mouse.y * 8;
        gsap.to(glassCard, {
          rotateY,
          rotateX,
          duration: 0.5,
          ease: 'power2.out',
          transformPerspective: 800,
        });
      }

      // Hero content subtle mouse parallax
      const heroContent = document.querySelector('.hero__content');
      if (heroContent) {
        gsap.set(heroContent, {
          x: this.mouse.x * -8,
          y: this.mouse.y * -5,
        });
      }

      this.rafId = requestAnimationFrame(tick);
    };
    tick();
  }

  destroy() {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    ScrollTrigger.getAll().forEach((st) => st.kill());
  }
}
