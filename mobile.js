// Mobile JavaScript - Common interactions and utilities

// Desktop Redirect - Redirect to desktop version on large screens
window.addEventListener('load', () => {
  const isDesktop = window.innerWidth > 768;
  const currentPage = window.location.pathname;

  // Redirect mobile case studies to desktop versions on large screens
  const mobileCaseStudies = [
    'compast-mobile.html',
    'petjam-mobile.html',
    'swaragam-mobile.html',
    'wais-mobile.html'
  ];

  if (isDesktop) {
    if (currentPage.includes('m.html') || currentPage.endsWith('m.html')) {
      window.location.replace('index.html');
    }
  }

  mobileCaseStudies.forEach(mobileFile => {
    if (isDesktop && currentPage.includes(mobileFile)) {
      const desktopFile = mobileFile.replace('-mobile', '');
      window.location.replace(desktopFile);
    }
  });
});

// Touch Device Detection
const isTouchDevice = 'ontouchstart' in window;

// Smooth scroll to section
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

// Navigation state management with Intersection Observer
function initNavObserver() {
  const sections = document.querySelectorAll('.mobile-snap-section');
  const navLinks = document.querySelectorAll('.mobile-nav-link');
  const header = document.querySelector('.mobile-header');

  if (sections.length === 0 || !header) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');

        // Update header theme based on section
        if (id === 'work-section') {
          header.classList.remove('dark');
          header.classList.add('light');
          // Start auto-advance when WORK section is visible
          startAutoAdvance();
        } else {
          header.classList.remove('light');
          header.classList.add('dark');
          // Stop auto-advance when not in WORK section
          stopAutoAdvance();
        }

        // Update active nav state
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(section => observer.observe(section));
}

// Touch feedback enhancement
function enhanceTouchFeedback() {
  const interactiveElements = document.querySelectorAll('a, button, .interactive-element');

  interactiveElements.forEach(el => {
    el.addEventListener('touchstart', () => {
      el.classList.add('touch-active');
    }, { passive: true });

    el.addEventListener('touchend', () => {
      el.classList.remove('touch-active');
    }, { passive: true });
  });
}

// Auto-advance carousel
let autoAdvanceInterval;
let currentIndex = 0;
const totalSlides = 4;
const advanceDelay = 5000; // 5 seconds per slide

// Project links for each slide
const projectLinks = [
  'wais-mobile.html',
  'compast-mobile.html',
  'swaragam-mobile.html',
  'petjam-mobile.html'
];

function startAutoAdvance() {
  // Clear existing interval
  if (autoAdvanceInterval) {
    clearInterval(autoAdvanceInterval);
  }

  // Start auto-advance
  autoAdvanceInterval = setInterval(() => {
    // Calculate next slide
    currentIndex = (currentIndex + 1) % totalSlides;

    // Trigger slide change
    goToSlide(currentIndex);
  }, advanceDelay);
}

function stopAutoAdvance() {
  if (autoAdvanceInterval) {
    clearInterval(autoAdvanceInterval);
    autoAdvanceInterval = null;
  }
}

function goToSlide(index) {
  const bars = document.querySelectorAll('.carousel-bar');
  const slides = document.querySelectorAll('.mobile-slide');
  const ctaButton = document.getElementById('mobile-cta-button');

  // Update active bar
  bars.forEach((bar, i) => {
    bar.classList.remove('active');
    if (i < index) {
      bar.classList.add('completed');
    } else {
      bar.classList.remove('completed');
    }
  });
  bars[index].classList.add('active');

  // Update active slide
  slides.forEach(slide => slide.classList.remove('active'));
  slides[index].classList.add('active');

  // Update CTA button link
  if (ctaButton && projectLinks[index]) {
    ctaButton.href = projectLinks[index];
  }

  // Update current index
  currentIndex = index;

  // Reset and start auto-advance timer
  startAutoAdvance();
}

// Swipe functionality
let touchStartX = 0;
let touchEndX = 0;

function initSwipeNavigation() {
  const carouselContentWrapper = document.querySelector('.mobile-carousel-content-wrapper');

  if (!carouselContentWrapper) return;

  carouselContentWrapper.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carouselContentWrapper.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
}

function handleSwipe() {
  const swipeThreshold = 50; // Minimum swipe distance
  const swipeDistance = touchStartX - touchEndX;

  if (swipeDistance > swipeThreshold) {
    // Swipe left - go to next slide
    const nextIndex = (currentIndex + 1) % totalSlides;
    goToSlide(nextIndex);
  } else if (swipeDistance < -swipeThreshold) {
    // Swipe right - go to previous slide
    const prevIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    goToSlide(prevIndex);
  }
}

// Touch pause functionality
function initTouchPause() {
  const carouselContentWrapper = document.querySelector('.mobile-carousel-content-wrapper');

  if (!carouselContentWrapper) return;

  carouselContentWrapper.addEventListener('touchstart', () => {
    // Pause auto-advance when user touches
    stopAutoAdvance();
  }, { passive: true });

  carouselContentWrapper.addEventListener('touchend', () => {
    // Resume auto-advance when user releases
    startAutoAdvance();
  }, { passive: true });
}

// Mobile Carousel
function initMobileCarousel() {
  const bars = document.querySelectorAll('.carousel-bar');
  const slides = document.querySelectorAll('.mobile-slide');
  const ctaButton = document.getElementById('mobile-cta-button');

  if (bars.length === 0 || slides.length === 0) return;

  bars.forEach((bar, index) => {
    bar.addEventListener('click', () => {
      // Update active bar
      bars.forEach(b => b.classList.remove('active'));
      bar.classList.add('active');

      // Update active slide
      slides.forEach(slide => slide.classList.remove('active'));
      slides[index].classList.add('active');

      // Update CTA button link
      if (ctaButton && projectLinks[index]) {
        ctaButton.href = projectLinks[index];
      }
    });
  });
}

// Bar animation state
const barStates = [];

// Initialize bar animation
function initBarAnimation() {
  const bars = document.querySelectorAll('.mobile-art-bar');

  bars.forEach((bar, index) => {
    barStates.push({
      element: bar,
      baseY: 0,
      currentY: 0,
      velocity: 0,
      phase: index * 0.5  // Phase offset for wave effect
    });
  });
}

// Animate bars with sine wave physics
function animateBars() {
  const time = Date.now() * 0.002; // Time multiplier for speed

  barStates.forEach((bar) => {
    // Calculate target Y position using sine wave
    const amplitude = 10;
    const targetY = Math.sin(time + bar.phase) * amplitude;

    // Apply spring physics for smooth movement
    const spring = 0.1;
    const damping = 0.85;

    bar.velocity += (targetY - bar.currentY) * spring;
    bar.velocity *= damping;
    bar.currentY += bar.velocity;

    // Apply transform
    bar.element.style.transform = `translateY(${bar.currentY}px)`;
  });

  requestAnimationFrame(animateBars);
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  enhanceTouchFeedback();
  initNavObserver();

  // Initialize and start bar animation
  initBarAnimation();
  animateBars();

  // Initialize mobile carousel
  initMobileCarousel();

  // Initialize swipe navigation
  initSwipeNavigation();

  // Initialize touch pause
  initTouchPause();

  // Initialize jump to top functionality
  initJumpToTop();
});

// Jump to top functionality
function initJumpToTop() {
  const jumpToTop = document.querySelector('.mobile-footer-jump');
  if (jumpToTop) {
    jumpToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
