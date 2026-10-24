document.addEventListener('DOMContentLoaded', () => {
  // Plan buttons preselect the plan in the contact form
  const planSelect = document.getElementById('f-plan');
  document.querySelectorAll('[data-plan]').forEach(btn => {
    btn.addEventListener('click', () => { planSelect.value = btn.dataset.plan; });
  });

  const loader = document.querySelector('.loader');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' ||
      typeof ScrollSmoother === 'undefined' || typeof SplitText === 'undefined') {
    loader.remove();
    return;
  }

  document.documentElement.classList.add('js-motion');
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

  const smoother = ScrollSmoother.create({
    smooth: 1,
    effects: true,
    normalizeScroll: false // THIS MUST BE FALSE TO FIX THE FLOATING HEADER
  });

  // Route every in-page link through ScrollSmoother
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      smoother.scrollTo(link.getAttribute('href'), true, 'top 64px');
    });
  });

  // --- Hero text, hidden behind the loader ---
  const heroRest = '.hero .eyebrow, .hero p, .hero .btn, .trust-row li, .circle-cta, nav';
  gsap.set('.hero-title', { autoAlpha: 0 });
  gsap.set(heroRest, { autoAlpha: 0, y: 24, filter: 'blur(8px)' });
  // Split when the reveal starts, so the web font has loaded and line breaks are final
  const revealHeroTitle = () => SplitText.create('.hero-title', {
    type: 'lines',
    mask: 'lines',
    autoSplit: true,
    onSplit: self => {
      gsap.set('.hero-title', { autoAlpha: 1 });
      return gsap.from(self.lines, { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.1 });
    }
  });

  // --- Loader: rolling 000 -> 100 counter, then wipe up ---
  // Each strip is a column of digits; we slide it by the running value / place.
  const strips = [...loader.querySelectorAll('.strip')];
  strips.forEach(strip => {
    const count = 100 / strip.dataset.place + 1;
    strip.innerHTML = Array.from({ length: count }, (_, i) => `<span>${i % 10}</span>`).join('');
  });
  const counter = { v: 0 };

  gsap.timeline()
    .to(counter, {
      v: 100,
      duration: 1.6,
      ease: 'power2.inOut',
      onUpdate: () => strips.forEach(s => {
        // Odometer: a column only rolls while the column to its right goes 9 -> 0
        const place = +s.dataset.place;
        const index = Math.floor(counter.v / place) + Math.max(0, (counter.v % place) - (place - 1));
        gsap.set(s, { yPercent: -index * (100 / s.children.length) });
      })
    })
    .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 0.8, ease: 'power3.inOut' }, '+=0.15')
    .add(() => loader.remove())
    .add(revealHeroTitle, '-=0.45')
    .to(heroRest, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power2.out', stagger: 0.05 }, '-=0.8');

  // --- Section headings: lines slide up out of a mask ---
  gsap.utils.toArray('.section-title, .heading h3').forEach(title => {
    SplitText.create(title, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      onSplit: self => gsap.from(self.lines, {
        yPercent: 110,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: { trigger: title, start: 'top 85%' }
      })
    });
  });

  // --- Body text: lines un-blur as they rise in ---
  const blurText = '.section .eyebrow, .section > div > p.secondary-text, #contact p.text-lg, .industries, .steps p, .steps h4, .plan-note, .proof .secondary-text';
  gsap.utils.toArray(blurText).forEach(text => {
    SplitText.create(text, {
      type: 'lines',
      autoSplit: true,
      onSplit: self => gsap.from(self.lines, {
        autoAlpha: 0,
        y: 15,
        filter: 'blur(10px)',
        duration: 0.6,
        ease: 'power1.out',
        stagger: 0.12,
        scrollTrigger: { trigger: text, start: 'top 85%' }
      })
    });
  });

  // --- Cards: clip-path wipe from the bottom-right corner ---
  const HIDDEN = 'polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)';
  const FULL = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';
  ['.funnel', '.plans', '.faq'].forEach(group => {
    gsap.fromTo(`${group} > *`, { clipPath: HIDDEN }, {
      clipPath: FULL,
      duration: 1,
      ease: 'power2.inOut',
      stagger: 0.15,
      scrollTrigger: { trigger: group, start: 'top 80%' }
    });
  });

  // --- Stats: count up the number inside each stat ---
  document.querySelectorAll('.stat').forEach(stat => {
    const [, pre, num, post] = stat.textContent.match(/^(\D*)(\d+)(.*)$/);
    const n = { v: 0 };
    gsap.to(n, {
      v: +num,
      duration: 1.5,
      ease: 'power2.out',
      scrollTrigger: { trigger: stat, start: 'top 90%' },
      onUpdate: () => { stat.textContent = pre + Math.round(n.v) + post; }
    });
  });

  // --- Creative zoom gallery ---
  gsap
    .timeline({
      scrollTrigger: {
        trigger: '.zoom-container',
        start: 'top top',
        end: '+=150%',
        pin: true,
        scrub: 1
      }
    })
    .to(".zoom-item[data-layer='3']", { opacity: 1, z: 800, ease: 'power1.inOut' }, 0)
    .to(".zoom-item[data-layer='2']", { opacity: 1, z: 600, ease: 'power1.inOut' }, 0)
    .to(".zoom-item[data-layer='1']", { opacity: 1, z: 400, ease: 'power1.inOut' }, 0)
    .to('.heading', { opacity: 1, z: 50, ease: 'power1.inOut' }, 0);
});
