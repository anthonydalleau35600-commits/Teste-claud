import { gsap } from 'gsap';

export class Loader {
  constructor() {
    this.loader = document.querySelector('#loader');
    this.progressFill = document.querySelector('.loader__progress-fill');
    this.loaderText = document.querySelector('.loader__text');
    this.loaderBar = document.querySelector('.loader__bar');
    this.progress = 0;
    this.onComplete = null;
  }

  start(onComplete) {
    this.onComplete = onComplete;
    this.simulateProgress();
  }

  simulateProgress() {
    const messages = [
      'Initialisation WebGL...',
      'Chargement des shaders...',
      'Construction de la scène...',
      'Génération de la ville...',
      'Presque prêt...',
      'Bienvenue.',
    ];

    let messageIndex = 0;
    const updateMessage = () => {
      if (this.loaderText && messageIndex < messages.length) {
        gsap.to(this.loaderText, {
          opacity: 0,
          y: -10,
          duration: 0.3,
          onComplete: () => {
            this.loaderText.textContent = messages[messageIndex++];
            gsap.to(this.loaderText, { opacity: 1, y: 0, duration: 0.3 });
          },
        });
      }
    };

    // Animate progress bar
    const progressTween = gsap.to(this, {
      progress: 100,
      duration: 2.5,
      ease: 'power1.inOut',
      onUpdate: () => {
        if (this.progressFill) {
          this.progressFill.style.width = `${this.progress}%`;
        }
      },
      onComplete: () => {
        setTimeout(() => this.hide(), 300);
      },
    });

    // Update messages at intervals
    const messageInterval = setInterval(() => {
      if (messageIndex < messages.length - 1) {
        updateMessage();
      } else {
        clearInterval(messageInterval);
        updateMessage();
      }
    }, 400);

    // Bar animation
    if (this.loaderBar) {
      gsap.to(this.loaderBar, {
        scaleX: 1,
        transformOrigin: 'left center',
        duration: 2.5,
        ease: 'power2.inOut',
      });
    }
  }

  hide() {
    const tl = gsap.timeline({
      onComplete: () => {
        if (this.loader) {
          this.loader.style.display = 'none';
          this.loader.style.pointerEvents = 'none';
        }
        if (this.onComplete) {
          this.onComplete();
        }
      },
    });

    tl.to('.loader__inner', {
      y: -30,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
    }).to('#loader', {
      clipPath: 'inset(0 0 100% 0)',
      duration: 0.8,
      ease: 'power4.inOut',
    });
  }
}
