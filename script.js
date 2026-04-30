// Carousel Functionality
class Carousel {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    
    this.track = this.container.querySelector('.carousel-track');
    this.slides = this.container.querySelectorAll('.carousel-slide');
    this.prevBtn = this.container.querySelector('.carousel-prev');
    this.nextBtn = this.container.querySelector('.carousel-next');
    this.dots = this.container.querySelectorAll('.carousel-dot');
    
    this.currentIndex = 0;
    this.totalSlides = this.slides.length;
    this.isTransitioning = false;
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.wheelTimeout = null;
    this.wheelDelta = 0;
    this.mouseDownX = 0;
    this.isDragging = false;
    
    this.init();
  }

  init() {
    this.attachEventListeners();
    this.updateDots();
  }

  attachEventListeners() {
    if (!this.prevBtn || !this.nextBtn) return;
    
    // Button clicks
    this.prevBtn.addEventListener('click', () => this.prev());
    this.nextBtn.addEventListener('click', () => this.next());

    // Dot clicks
    this.dots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        this.goToSlide(index);
      });
    });

    // Touch events for swipe
    this.container.addEventListener('touchstart', (e) => this.handleTouchStart(e), false);
    this.container.addEventListener('touchmove', (e) => this.handleTouchMove(e), false);
    this.container.addEventListener('touchend', (e) => this.handleTouchEnd(e), false);

    // Wheel/Scroll events
    this.container.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });

    // Mouse drag support
    this.container.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    this.container.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.container.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    this.container.addEventListener('mouseleave', (e) => this.handleMouseUp(e));
  }

  handleTouchStart(e) {
    this.touchStartX = e.changedTouches[0].screenX;
    this.isDragging = true;
  }

  handleTouchMove(e) {
    if (!this.isDragging) return;
    this.touchEndX = e.changedTouches[0].screenX;
    this.updateDragPreview();
  }

  handleTouchEnd(e) {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.handleSwipe();
  }

  handleMouseDown(e) {
    if (e.button !== 0) return;
    this.mouseDownX = e.clientX;
    this.touchStartX = e.clientX;
    this.isDragging = true;
    this.container.style.cursor = 'grabbing';
  }

  handleMouseMove(e) {
    if (!this.isDragging || this.touchStartX === 0) return;
    this.touchEndX = e.clientX;
    this.updateDragPreview();
  }

  handleMouseUp(e) {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.handleSwipe();
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.container.style.cursor = 'grab';
  }

  updateDragPreview() {
    const diff = this.touchStartX - this.touchEndX;
    const dragPercent = (diff / this.container.offsetWidth) * 100;
    // Show smooth preview during drag
    if (Math.abs(dragPercent) < 50) {
      this.track.style.transition = 'none';
      const currentTranslate = -this.currentIndex * 100;
      this.track.style.transform = `translateX(${currentTranslate - dragPercent}%)`;
    }
  }

  handleSwipe() {
    const threshold = 25; // Swipe threshold percentage
    const diff = this.touchStartX - this.touchEndX;
    const dragPercent = (diff / this.container.offsetWidth) * 100;

    // Re-enable transition for the final snap
    this.track.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';

    if (Math.abs(dragPercent) > threshold) {
      if (dragPercent > 0) {
        this.next();
      } else {
        this.prev();
      }
    } else {
      // Snap back to current slide
      this.updateCarousel();
    }
  }

  handleWheel(e) {
    e.preventDefault();

    if (this.isDragging) return;

    // Accumulate wheel delta
    this.wheelDelta += e.deltaY > 0 ? 1 : -1;

    if (this.wheelTimeout) clearTimeout(this.wheelTimeout);

    if (Math.abs(this.wheelDelta) >= 3) {
      if (this.wheelDelta > 0) {
        this.next();
      } else {
        this.prev();
      }
      this.wheelDelta = 0;
    }

    this.wheelTimeout = setTimeout(() => {
      this.wheelDelta = 0;
    }, 300);
  }

  prev() {
    if (this.isTransitioning) return;
    this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
    this.updateCarousel();
  }

  next() {
    if (this.isTransitioning) return;
    this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
    this.updateCarousel();
  }

  goToSlide(index) {
    if (this.isTransitioning || index === this.currentIndex) return;
    this.currentIndex = index;
    this.updateCarousel();
  }

  updateCarousel() {
    this.isTransitioning = true;

    // Smooth easing for snap animation
    this.track.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    
    const translateX = -this.currentIndex * 100;
    this.track.style.transform = `translateX(${translateX}%)`;

    setTimeout(() => {
      this.isTransitioning = false;
    }, 300);

    this.updateDots();
  }

  updateDots() {
    this.dots.forEach((dot, index) => {
      if (index === this.currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
}

// Initialize carousel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new Carousel('packageCarousel');
});

// GSAP Scroll Zoom and Reveal Effects
document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && typeof ScrollSmoother !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    const smoother = ScrollSmoother.create({
      smooth: 1,
      effects: true,
      normalizeScroll: false // THIS MUST BE FALSE TO FIX THE FLOATING HEADER
    });

    // --- NEW: Header link ScrollSmoother interceptor ---
    const navLinks = document.querySelectorAll('.nav-pill-shell a');
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href'); 
        smoother.scrollTo(targetId, true, "top top"); 
      });
    });

    const zoomContainer = document.querySelector('.zoom-container');
    if (zoomContainer) {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".zoom-container",
            start: "top top",
            end: "+=150%",
            pin: true,
            scrub: 1
          }
        })
        .to(
          ".zoom-item[data-layer='3']",
          { opacity: 1, z: 800, ease: "power1.inOut" },
          0
        )
        .to(
          ".zoom-item[data-layer='2']",
          { opacity: 1, z: 600, ease: "power1.inOut" },
          0
        )
        .to(
          ".zoom-item[data-layer='1']",
          { opacity: 1, z: 400, ease: "power1.inOut" },
          0
        )
        .to(
          ".heading",
          { opacity: 1, z: 50, ease: "power1.inOut" },
          0
        );
    }
  }

  if (typeof SplitText !== 'undefined' && typeof gsap !== 'undefined') {
    const revealText = document.querySelector(".opacity-reveal");
    if (revealText) {
      const splitLetters = SplitText.create(revealText);
      gsap.set(splitLetters.chars, { opacity: "0.2" });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".section-stick",
            pin: true,
            start: "center center",
            end: "+=600", /* MASSIVELY REDUCED SCROLL GAP HERE */
            scrub: 1
          }
        })
        .to(splitLetters.chars, {
          opacity: "1",
          duration: 1,
          ease: "none",
          stagger: 1
        })
        .to({}, { duration: 2 }) /* SHORTER HOLD */
        .to(".opacity-reveal", {
          opacity: "0",
          scale: 1.1,
          duration: 20 /* SHORTER FADE OUT */
        });
    }
  }
});