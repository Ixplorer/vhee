/**
 * VICTORY ORJINTA PORTFOLIO INTERACTIVE LOGIC
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileNav();
  initSkillTabs();
  initStatCounters();
  initRoiCalculator();
  initContactForm();
  initScrollAnimations();
  initWhatsAppWidget();
  initHeroSlider();
});

/* Navbar Scroll Effect & Active Section Tracker */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* Mobile Nav Drawer */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  const navBackdrop = document.getElementById('navBackdrop');

  function openMenu() {
    navLinks.classList.add('active');
    if (navBackdrop) navBackdrop.classList.add('active');
    document.body.classList.add('nav-open');
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', 'true');
      const icon = toggleBtn.querySelector('i');
      if (icon) icon.className = 'fas fa-times';
    }
  }

  function closeMenu() {
    navLinks.classList.remove('active');
    if (navBackdrop) navBackdrop.classList.remove('active');
    document.body.classList.remove('nav-open');
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', 'false');
      const icon = toggleBtn.querySelector('i');
      if (icon) icon.className = 'fas fa-bars';
    }
  }

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navLinks.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (navBackdrop) {
      navBackdrop.addEventListener('click', closeMenu);
    }

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        closeMenu();
      }
    });
  }
}

/* Skill Tabs & Progress Bar Animate */
function initSkillTabs() {
  const tabBtns = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // Animate skill progress bars on scroll intersection
  const progressBars = document.querySelectorAll('.progress-bar-fill');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const targetWidth = entry.target.getAttribute('data-width');
        entry.target.style.width = targetWidth;
      }
    });
  }, { threshold: 0.2 });

  progressBars.forEach(bar => observer.observe(bar));
}

/* Stat Counter Animation */
function initStatCounters() {
  const counters = document.querySelectorAll('.stat-number');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const prefix = counter.getAttribute('data-prefix') || '';
          const suffix = counter.getAttribute('data-suffix') || '';
          const duration = 1800; // ms
          const stepTime = 20;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.innerText = `${prefix}${target}${suffix}`;
              clearInterval(timer);
            } else {
              counter.innerText = `${prefix}${Math.floor(current)}${suffix}`;
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.5 });

  const statsContainer = document.querySelector('.hero-stats-row');
  if (statsContainer) observer.observe(statsContainer);
}

/* Interactive Campaign ROI Calculator */
function initRoiCalculator() {
  const budgetInput = document.getElementById('adBudget');
  const cpcInput = document.getElementById('avgCpc');
  const convRateInput = document.getElementById('convRate');

  const budgetVal = document.getElementById('budgetValue');
  const cpcVal = document.getElementById('cpcValue');
  const convRateVal = document.getElementById('convRateValue');

  const estLeadsVal = document.getElementById('estLeads');
  const estRoiVal = document.getElementById('estRoi');

  function calculate() {
    if (!budgetInput || !cpcInput || !convRateInput) return;

    const budget = parseFloat(budgetInput.value);
    const cpc = parseFloat(cpcInput.value);
    const convRate = parseFloat(convRateInput.value) / 100;

    budgetVal.innerText = `$${budget.toLocaleString()}`;
    cpcVal.innerText = `$${cpc.toFixed(2)}`;
    convRateVal.innerText = `${(convRate * 100).toFixed(1)}%`;

    const estimatedClicks = budget / cpc;
    const estimatedLeads = Math.round(estimatedClicks * convRate);
    
    // Average customer lifetime value benchmark
    const avgDealValue = 350;
    const estimatedRevenue = estimatedLeads * avgDealValue;
    const roiMultiplier = ((estimatedRevenue - budget) / budget * 100).toFixed(0);

    estLeadsVal.innerText = estimatedLeads.toLocaleString();
    estRoiVal.innerText = `${roiMultiplier > 0 ? '+' : ''}${roiMultiplier}%`;
  }

  [budgetInput, cpcInput, convRateInput].forEach(input => {
    if (input) input.addEventListener('input', calculate);
  });

  calculate();
}

/* Contact Form Submission Handler */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const modal = document.getElementById('successModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Message...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        form.reset();

        if (modal) {
          modal.classList.add('active');
        }
      }, 1200);
    });
  }

  if (modalCloseBtn && modal) {
    modalCloseBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }
}

/* Scroll Intersection Reveal Animation */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.glass-card, .section-title, .timeline-item').forEach(el => {
    observer.observe(el);
  });
}

/* WhatsApp Floating Widget Handler */
function initWhatsAppWidget() {
  const toggleBtn = document.getElementById('waToggleBtn');
  const closeBtn = document.getElementById('waCloseBtn');
  const chatBox = document.getElementById('waChatBox');
  const waForm = document.getElementById('waForm');
  const waInput = document.getElementById('waInput');
  const chips = document.querySelectorAll('.wa-chip');

  const phone = '23408053794097';

  if (!toggleBtn || !chatBox) return;

  toggleBtn.addEventListener('click', () => {
    chatBox.classList.toggle('active');
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      chatBox.classList.remove('active');
    });
  }

  // Quick prompt chips
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const msg = chip.getAttribute('data-msg');
      openWhatsApp(msg);
    });
  });

  // Form submit
  if (waForm) {
    waForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = waInput.value.trim();
      if (msg) {
        openWhatsApp(msg);
        waInput.value = '';
        chatBox.classList.remove('active');
      }
    });
  }

  function openWhatsApp(message) {
    const encodedMsg = encodeURIComponent(message);
    const waUrl = `https://wa.me/${phone}?text=${encodedMsg}`;
    window.open(waUrl, '_blank');
  }
}

/* Full Screen Hero Slider Controller */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slider .slide');
  const dots = document.querySelectorAll('.slider-dots .dot');
  const prevBtn = document.getElementById('sliderPrevBtn');
  const nextBtn = document.getElementById('sliderNextBtn');
  const sliderContainer = document.getElementById('heroSlider');

  if (!slides.length) return;

  let currentSlide = 0;
  let slideInterval = null;

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');

    // Trigger stat counters if slide has counters
    const activeCounters = slides[currentSlide].querySelectorAll('.stat-number[data-target]');
    activeCounters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const prefix = counter.getAttribute('data-prefix') || '';
      const suffix = counter.getAttribute('data-suffix') || '';
      let count = 0;
      const step = Math.max(1, Math.ceil(target / 40));
      const timer = setInterval(() => {
        count += step;
        if (count >= target) {
          counter.textContent = `${prefix}${target}${suffix}`;
          clearInterval(timer);
        } else {
          counter.textContent = `${prefix}${count}${suffix}`;
        }
      }, 30);
    });
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    slideInterval = setInterval(nextSlide, 6000);
  }

  function stopAutoplay() {
    if (slideInterval) clearInterval(slideInterval);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoplay();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      goToSlide(idx);
      startAutoplay();
    });
  });

  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', stopAutoplay);
    sliderContainer.addEventListener('mouseleave', startAutoplay);

    // Touch Swipe Support
    let touchStartX = 0;
    let touchEndX = 0;

    sliderContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 40) {
        nextSlide();
        startAutoplay();
      } else if (touchEndX - touchStartX > 40) {
        prevSlide();
        startAutoplay();
      }
    }, { passive: true });
  }

  // Keyboard Arrow Navigation
  document.addEventListener('keydown', (e) => {
    const heroSec = document.getElementById('hero');
    if (heroSec && window.scrollY < heroSec.offsetHeight) {
      if (e.key === 'ArrowRight') {
        nextSlide();
        startAutoplay();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
        startAutoplay();
      }
    }
  });

  startAutoplay();
}
