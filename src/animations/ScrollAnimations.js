import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

export class ScrollAnimations {
  constructor() {
    this.splitInstances = [];
    this.init();
  }

  init() {
    this.setupSplitText();
    this.setupHeroAnimations();
    this.setupCounterAnimations();
    this.setupPanelScrolling();
    this.setupRevealAnimations();
    this.setupParallaxText();
    this.setupNavAnimation();
    this.setupCursor();
  }

  setupSplitText() {
    // Split all elements with data-split attribute
    const splitElements = document.querySelectorAll('[data-split]');
    splitElements.forEach((el) => {
      const split = new SplitType(el, { types: 'chars,words,lines' });
      this.splitInstances.push(split);

      // Initial state - hide chars
      gsap.set(split.chars, {
        y: '110%',
        opacity: 0,
        rotateX: -90,
      });

      // Animate when in view
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(split.chars, {
            y: '0%',
            opacity: 1,
            rotateX: 0,
            duration: 0.8,
            ease: 'back.out(1.7)',
            stagger: {
              amount: 0.6,
              from: 'random',
            },
          });
        },
      });
    });
  }

  setupHeroAnimations() {
    const tl = gsap.timeline({ delay: 0.5 });

    // Hero content entrance
    tl.from('.hero__eyebrow', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    })
      .from('.hero__subtitle', {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
      }, '-=0.3')
      .from('.hero__cta', {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
      }, '-=0.3')
      .from('.hero__scroll-indicator', {
        y: -20,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
      }, '-=0.2');

    // Scroll indicator looping animation
    gsap.to('.scroll-line', {
      scaleY: 0,
      transformOrigin: 'top center',
      duration: 1.2,
      ease: 'power2.in',
      repeat: -1,
      yoyo: false,
      onRepeat: () => {
        gsap.set('.scroll-line', { scaleY: 1 });
      },
    });

    // Hero parallax on scroll
    ScrollTrigger.create({
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        gsap.set('.hero__content', {
          y: self.progress * 150,
          opacity: 1 - self.progress * 1.5,
        });
      },
    });

    // Marquee strip - continuous scroll
    gsap.to('.marquee__track', {
      x: '-50%',
      duration: 20,
      ease: 'none',
      repeat: -1,
    });
  }

  setupCounterAnimations() {
    const counters = document.querySelectorAll('[data-count]');
    counters.forEach((el) => {
      const target = parseInt(el.dataset.count);
      ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(el, {
            textContent: target,
            duration: 2,
            ease: 'power2.out',
            snap: { textContent: 1 },
            onUpdate: function () {
              el.textContent = Math.round(this.targets()[0]._gsap.textContent);
            },
          });
        },
      });
    });
  }

  setupPanelScrolling() {
    const panels = document.querySelectorAll('.work__panel');
    if (!panels.length) return;

    const pinContainer = document.querySelector('#pinContainer');
    if (!pinContainer) return;

    // Set panels initial state
    gsap.set(panels, { opacity: 0, x: 100 });
    gsap.set(panels[0], { opacity: 1, x: 0 });

    // Pin the work section and animate panels
    ScrollTrigger.create({
      trigger: '.work',
      start: 'top top',
      end: `+=${panels.length * 100}vh`,
      pin: true,
      scrub: 1,
      snap: 1 / (panels.length - 1),
      onUpdate: (self) => {
        const panelIndex = Math.round(self.progress * (panels.length - 1));
        panels.forEach((panel, i) => {
          if (i === panelIndex) {
            gsap.to(panel, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' });
          } else {
            gsap.to(panel, { opacity: 0, x: i < panelIndex ? -100 : 100, duration: 0.4, ease: 'power2.in' });
          }
        });
      },
    });

    // Animate panel orbs
    panels.forEach((panel) => {
      const orb = panel.querySelector('.panel__orb');
      if (orb) {
        gsap.to(orb, {
          scale: 1.1,
          duration: 2 + Math.random(),
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      }
    });
  }

  setupRevealAnimations() {
    // Big text reveal
    const bigText = document.querySelector('#bigText');
    if (bigText) {
      const spans = bigText.querySelectorAll('span');
      spans.forEach((span) => {
        const split = new SplitType(span, { types: 'chars' });
        this.splitInstances.push(split);

        ScrollTrigger.create({
          trigger: bigText,
          start: 'top 70%',
          end: 'bottom 30%',
          scrub: 0.5,
          onUpdate: (self) => {
            const charCount = split.chars.length;
            const revealCount = Math.floor(self.progress * charCount * 1.2);
            split.chars.forEach((char, i) => {
              if (i < revealCount) {
                gsap.to(char, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
              } else {
                gsap.to(char, { opacity: 0.15, duration: 0.3 });
              }
            });
          },
        });

        // Initial state
        gsap.set(split.chars, { opacity: 0.15 });
      });
    }

    // Glass card entrance
    ScrollTrigger.create({
      trigger: '.glass-card',
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.from('.glass-card', {
          scale: 0.8,
          opacity: 0,
          rotateY: -15,
          duration: 1,
          ease: 'back.out(1.4)',
        });
        gsap.from('.tech-item', {
          scale: 0,
          opacity: 0,
          duration: 0.4,
          ease: 'back.out(2)',
          stagger: 0.05,
          delay: 0.3,
        });
      },
    });

    // Slide cards
    gsap.from('.slide-card', {
      y: 60,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.slider-section',
        start: 'top 80%',
        once: true,
      },
    });

    // Contact section
    ScrollTrigger.create({
      trigger: '.contact',
      start: 'top 70%',
      once: true,
      onEnter: () => {
        gsap.from('.contact__link', {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: 0.5,
        });
      },
    });
  }

  setupParallaxText() {
    // Section labels floating in
    gsap.utils.toArray('.section-label').forEach((label) => {
      gsap.from(label, {
        x: -50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: label,
          start: 'top 85%',
          once: true,
        },
      });
    });

    // Stats pop-in
    gsap.utils.toArray('.stat').forEach((stat, i) => {
      gsap.from(stat, {
        y: 40,
        opacity: 0,
        duration: 0.6,
        ease: 'back.out(1.7)',
        delay: i * 0.1,
        scrollTrigger: {
          trigger: stat,
          start: 'top 85%',
          once: true,
        },
      });
    });

    // About body text
    ScrollTrigger.create({
      trigger: '.about__body',
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.from('.about__body', {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
        });
      },
    });
  }

  setupNavAnimation() {
    // Nav appearance on scroll
    ScrollTrigger.create({
      start: 'top -80',
      onUpdate: (self) => {
        const nav = document.querySelector('.nav');
        if (!nav) return;
        if (self.direction === -1) {
          gsap.to(nav, { y: 0, duration: 0.3, ease: 'power2.out' });
        } else {
          gsap.to(nav, { y: -100, duration: 0.3, ease: 'power2.in' });
        }
      },
    });

    // Nav links stagger on load
    gsap.from('.nav__link', {
      y: -20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out',
      delay: 1.2,
    });

    gsap.from('.nav__logo', {
      x: -20,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      delay: 1.0,
    });
  }

  setupCursor() {
    const cursor = document.querySelector('#cursor');
    const follower = document.querySelector('#cursor-follower');
    if (!cursor || !follower) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: 'none',
      });
    });

    // Smooth follower
    const updateFollower = () => {
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;
      gsap.set(follower, { x: followerX, y: followerY });
      requestAnimationFrame(updateFollower);
    };
    updateFollower();

    // Cursor states
    const interactables = document.querySelectorAll('a, button, .tech-item, .swiper-slide');
    interactables.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        gsap.to(cursor, { scale: 2.5, duration: 0.3 });
        gsap.to(follower, { scale: 1.5, duration: 0.3 });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(cursor, { scale: 1, duration: 0.3 });
        gsap.to(follower, { scale: 1, duration: 0.3 });
      });
    });
  }

  // Call this when Lenis updates to refresh ScrollTrigger
  refresh() {
    ScrollTrigger.refresh();
  }

  destroy() {
    ScrollTrigger.getAll().forEach((st) => st.kill());
    this.splitInstances.forEach((s) => s.revert());
  }
}
