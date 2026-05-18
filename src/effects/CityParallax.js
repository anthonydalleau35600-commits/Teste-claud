import { gsap } from 'gsap';

function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = Math.imul(s ^ (s >>> 17), 0x45d9f3b);
    s = Math.imul(s ^ (s >>> 11), 0x119de1f3);
    s = s ^ (s >>> 14);
    return (s >>> 0) / 0xffffffff;
  };
}

function generateCityPath(svgW, svgH, opts) {
  const { minH, maxH, minW, maxW, maxGap, streetFrac, spireChance, spireH, seed } = opts;
  const rand = makeRng(seed);
  const streetY = svgH * streetFrac;

  let d = `M 0 ${svgH} L 0 ${streetY}`;
  let x = 0;

  while (x < svgW + maxW) {
    const bw = minW + rand() * (maxW - minW);
    const bTop = svgH - (minH + rand() * (maxH - minH)) * svgH;

    d += ` L ${x} ${bTop}`;

    if (rand() < spireChance) {
      const sx = x + bw * (0.35 + rand() * 0.3);
      const spH = spireH * (0.6 + rand() * 0.8);
      d += ` L ${sx - 1.5} ${bTop} L ${sx} ${bTop - spH} L ${sx + 1.5} ${bTop}`;
    }

    d += ` L ${x + bw} ${bTop} L ${x + bw} ${streetY}`;

    const gap = rand() < 0.55 ? 0 : rand() * maxGap;
    if (gap > 1) d += ` L ${x + bw + gap} ${streetY}`;
    x += bw + Math.max(0, gap);
  }

  d += ` L ${svgW} ${svgH} Z`;
  return d;
}

function makeSVG(svgW, svgH, opts, fillColor) {
  const path = generateCityPath(svgW, svgH, opts);
  return `<svg viewBox="0 0 ${svgW} ${svgH}" preserveAspectRatio="xMidYMax slice"
    xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <path d="${path}" fill="${fillColor}" />
  </svg>`;
}

export class CityParallax {
  constructor() {
    this.init();
  }

  init() {
    this.injectCities();
    this.setupParallax();
    this.setupEntryAnimation();

    // Single resize listener registered once
    window.addEventListener('resize', () => this.injectCities(), { passive: true });
  }

  injectCities() {
    const w = Math.max(window.innerWidth, 1440);

    const far = document.getElementById('cityFar');
    if (far) {
      far.innerHTML = makeSVG(
        w,
        280,
        {
          minH: 0.22,
          maxH: 0.55,
          minW: 18,
          maxW: 55,
          maxGap: 12,
          streetFrac: 0.88,
          spireChance: 0.45,
          spireH: 20,
          seed: 0x2f4a,
        },
        '#071522'
      );
    }

    const mid = document.getElementById('cityMid');
    if (mid) {
      mid.innerHTML = makeSVG(
        w,
        400,
        {
          minH: 0.32,
          maxH: 0.7,
          minW: 38,
          maxW: 95,
          maxGap: 18,
          streetFrac: 0.84,
          spireChance: 0.35,
          spireH: 30,
          seed: 0x9b12,
        },
        '#041018'
      );
    }

    const near = document.getElementById('cityNear');
    if (near) {
      near.innerHTML = makeSVG(
        w,
        520,
        {
          minH: 0.45,
          maxH: 0.88,
          minW: 75,
          maxW: 190,
          maxGap: 22,
          streetFrac: 0.92,
          spireChance: 0.18,
          spireH: 40,
          seed: 0xc371,
        },
        '#020b14'
      );
    }
  }

  setupParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const trigger = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true };

    gsap.to('.city-sky', { yPercent: -8, ease: 'none', scrollTrigger: trigger });
    gsap.to('#cityFar', { yPercent: -22, ease: 'none', scrollTrigger: trigger });
    gsap.to('.city-fog-1', { yPercent: -28, opacity: 0.4, ease: 'none', scrollTrigger: trigger });
    gsap.to('#cityMid', { yPercent: -42, ease: 'none', scrollTrigger: trigger });
    gsap.to('.city-fog-2', { yPercent: -50, opacity: 0.3, ease: 'none', scrollTrigger: trigger });
    gsap.to('#cityNear', { yPercent: -65, ease: 'none', scrollTrigger: trigger });
  }

  setupEntryAnimation() {
    const delays = [0.3, 0.5, 0.65, 0.8, 0.9, 1.0];
    document.querySelectorAll('.city-layer').forEach((el, i) => {
      gsap.fromTo(
        el,
        { y: '40vh', opacity: 0 },
        { y: '0vh', opacity: 1, duration: 2.2, ease: 'power4.out', delay: delays[i] || 0.5 }
      );
    });
  }
}
