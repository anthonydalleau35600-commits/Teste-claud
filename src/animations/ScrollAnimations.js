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
    this.setupScrollProgress();
    this.setupSplitText();
    this.setupHeroAnimations();
    this.setupHeroPlane();
    this.setupHeroZoom();
    this.setupCounterAnimations();
    this.setupHorizontalWork();
    this.setupScrubTextReveal();
    this.setupAboutPanels();
    this.setupContactReveal();
    this.setupSliderCards();
    this.setupNavBehavior();
    this.setupCursor();
    this.setupMarquee();
  }

  // ---- Scroll progress bar ----
  setupScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;

    ScrollTrigger.create({
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        bar.style.transform = `scaleX(${self.progress})`;
      },
    });
  }

  // ---- Split text on data-split elements ----
  setupSplitText() {
    const els = document.querySelectorAll('[data-split]');
    els.forEach((el) => {
      const split = new SplitType(el, { types: 'chars,words' });
      this.splitInstances.push(split);

      gsap.set(split.chars, { y: '110%', opacity: 0, rotateX: -90 });

      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          gsap.to(split.chars, {
            y: '0%',
            opacity: 1,
            rotateX: 0,
            duration: 0.9,
            ease: 'back.out(1.7)',
            stagger: { amount: 0.5, from: 'start' },
          });
        },
      });
    });
  }

  // ---- Hero entrance ----
  setupHeroAnimations() {
    const tl = gsap.timeline({ delay: 0.3 });

    tl.to('.hero__eyebrow', {
      y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
    })
    .to('.hero__subtitle', {
      y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
    }, '-=0.4')
    .to('.hero__cta', {
      y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
    }, '-=0.3')
    .to('#scrollIndicator', {
      opacity: 1, duration: 0.6, ease: 'power2.out',
    }, '-=0.2');

    // Hero content fades out as user scrolls
    ScrollTrigger.create({
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        gsap.set('#heroContent', {
          y: p * 180,
          opacity: Math.max(0, 1 - p * 2),
        });
      },
    });
  }

  // ---- Airplane descending effect ----
  setupHeroPlane() {
    const plane = document.getElementById('heroPLane');
    if (!plane) return;

    // Entry animation
    gsap.to(plane, {
      opacity: 1, duration: 1.5, ease: 'power2.out', delay: 0.8,
    });

    // Hover float
    gsap.to(plane, {
      y: '+=12',
      duration: 3,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });

    // Descend into city on scroll
    ScrollTrigger.create({
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
      onUpdate: (self) => {
        const p = self.progress;
        // Plane descends and shrinks as city approaches
        gsap.set(plane, {
          y: p * 280,
          scale: 1 + p * 0.4,
          opacity: Math.max(0, 1 - p * 3),
        });
      },
    });
  }

  // ---- Hero zoom on scroll — city approaches ----
  setupHeroZoom() {
    ScrollTrigger.create({
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress;
        // City layers zoom in at different rates (descent simulation)
        gsap.set('#cityFar',  { scale: 1 + p * 0.15 });
        gsap.set('#cityMid',  { scale: 1 + p * 0.25 });
        gsap.set('#cityNear', { scale: 1 + p * 0.40 });
        gsap.set('.city-sky', { scale: 1 + p * 0.06 });
      },
    });
  }

  // ---- Horizontal work cards scroll ----
  setupHorizontalWork() {
    const pinWrap = document.getElementById('workPin');
    const track = document.getElementById('workTrack');
    const cards = document.querySelectorAll('.work__card');
    const dots = document.querySelectorAll('.work__dot');
    const progressFill = document.getElementById('workProgressFill');
    if (!pinWrap || !track || !cards.length) return;

    const cardCount = cards.length;
    const totalWidth = window.innerWidth * cardCount;
    track.style.width = `${totalWidth}px`;

    // Set section height to drive horizontal scroll
    const workSection = document.getElementById('work');

    gsap.to(track, {
      x: () => -(totalWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: pinWrap,
        start: 'top top',
        end: () => `+=${totalWidth - window.innerWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;
          const rawIndex = p * (cardCount - 1);
          const activeIndex = Math.round(rawIndex);

          // Update progress fill
          if (progressFill) {
            progressFill.style.width = `${p * 100}%`;
          }

          // Update dots
          dots.forEach((dot, i) => {
            dot.classList.toggle('work__dot--active', i === activeIndex);
          });

          // Activate card content
          cards.forEach((card, i) => {
            const active = i === activeIndex;
            card.classList.toggle('is-active', active);
          });
        },
      },
    });

    // Reveal each card with clip-path as it enters the horizontal viewport
    cards.forEach((card, i) => {
      gsap.to(card, {
        clipPath: 'inset(0 0% 0 0)',
        ease: 'none',
        scrollTrigger: {
          trigger: pinWrap,
          start: () => `top top+=${(i / cardCount) * (totalWidth - window.innerWidth)}`,
          end: () => `top top+=${((i + 0.6) / cardCount) * (totalWidth - window.innerWidth)}`,
          scrub: 1,
          containerAnimation: gsap.to(track, { x: -(totalWidth - window.innerWidth), ease: 'none' }),
        },
      });
    });

    // Activate first card immediately
    cards[0]?.classList.add('is-active');
    gsap.set(cards[0], { clipPath: 'inset(0 0% 0 0)' });
  }

  // ---- Scrub text reveal (big quote section) ----
  setupScrubTextReveal() {
    const bigText = document.getElementById('bigText');
    if (!bigText) return;

    const lines = bigText.querySelectorAll('[data-split-scrub]');
    lines.forEach((line) => {
      const split = new SplitType(line, { types: 'chars' });
      this.splitInstances.push(split);

      gsap.set(split.chars, { opacity: 0.1 });

      gsap.to(split.chars, {
        opacity: 1,
        stagger: { each: 0.04 },
        ease: 'none',
        scrollTrigger: {
          trigger: bigText,
          start: 'top 75%',
          end: 'bottom 25%',
          scrub: 0.8,
        },
      });
    });
  }

  // ---- About panels fade in on scroll ----
  setupAboutPanels() {
    const panels = document.querySelectorAll('.about__panel');
    panels.forEach((panel) => {
      ScrollTrigger.create({
        trigger: panel,
        start: 'top 80%',
        once: true,
        onEnter: () => panel.classList.add('is-visible'),
      });
    });
  }

  // ---- Counter animations ----
  setupCounterAnimations() {
    document.querySelectorAll('[data-count]').forEach((el) => {
      const target = parseInt(el.dataset.count, 10);
      ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate() { el.textContent = Math.round(obj.val); },
          });
        },
      });
    });
  }

  // ---- Contact section reveal ----
  setupContactReveal() {
    const title = document.getElementById('contactTitle');
    if (!title) return;

    // Clip reveal from bottom
    gsap.from(title, {
      clipPath: 'inset(0 0 100% 0)',
      duration: 1.2,
      ease: 'power4.out',
      scrollTrigger: { trigger: title, start: 'top 80%', once: true },
    });

    // Email link slide up
    gsap.from('.contact__link', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.4,
      scrollTrigger: { trigger: '.contact__cta-wrap', start: 'top 80%', once: true },
    });
  }

  // ---- Slider cards stagger ----
  setupSliderCards() {
    gsap.from('.slide-card', {
      y: 80,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: { trigger: '.slider-section', start: 'top 80%', once: true },
    });
  }

  // ---- Nav: hide on scroll down, show on scroll up ----
  setupNavBehavior() {
    let lastY = 0;

    ScrollTrigger.create({
      start: 'top -80',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const nav = document.querySelector('.nav');
        if (!nav) return;

        nav.classList.toggle('nav--scrolled', self.scroll() > 80);

        if (self.direction === 1 && self.scroll() > 200) {
          gsap.to(nav, { y: -100, duration: 0.3, ease: 'power2.in' });
        } else {
          gsap.to(nav, { y: 0, duration: 0.4, ease: 'power2.out' });
        }
      },
    });

    gsap.from('.nav__link', {
      y: -20, opacity: 0, duration: 0.5, stagger: 0.08,
      ease: 'power2.out', delay: 1.2,
    });

    gsap.from('.nav__logo', {
      x: -20, opacity: 0, duration: 0.6, ease: 'power2.out', delay: 1.0,
    });
  }

  // ---- Continuous marquee ----
  setupMarquee() {
    gsap.to('.marquee__track', {
      x: '-50%',
      duration: 22,
      ease: 'none',
      repeat: -1,
    });
  }

  // ---- Custom cursor ----
  setupCursor() {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    if (!cursor || !follower) return;

    let mx = 0, my = 0;
    let fx = 0, fy = 0;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      gsap.to(cursor, { x: mx, y: my, duration: 0.08, ease: 'none' });
    });

    const tick = () => {
      fx += (mx - fx) * 0.12;
      fy += (my - fy) * 0.12;
      gsap.set(follower, { x: fx, y: fy });
      requestAnimationFrame(tick);
    };
    tick();

    document.querySelectorAll('[data-cursor-hover], a, button, .tech-item, .swiper-slide').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor--hover');
        follower.classList.add('cursor-follower--hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor--hover');
        follower.classList.remove('cursor-follower--hover');
      });
    });
  }

  refresh() { ScrollTrigger.refresh(); }

  destroy() {
    ScrollTrigger.getAll().forEach((st) => st.kill());
    this.splitInstances.forEach((s) => s.revert());
  }
}
