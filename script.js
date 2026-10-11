/* ===== SCRIPT.JS - Arlene Jane's Lucan Journey ===== */

// ─── Sticky Header ───────────────────────────────────────────────────────────
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// ─── Hamburger / Mobile Nav ──────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navList   = document.getElementById('nav-list');

function closeMobileNav() {
  navList.classList.remove('open');
  document.body.classList.remove('nav-open');
  hamburger.classList.remove('active');
  hamburger.querySelectorAll('span').forEach(s => s.classList.remove('active'));
}

function toggleMobileNav() {
  const isOpen = navList.classList.toggle('open');
  document.body.classList.toggle('nav-open', isOpen);
  const spans = hamburger.querySelectorAll('span');
  spans.forEach(s => s.classList.toggle('active', isOpen));
  hamburger.classList.toggle('active', isOpen);
}

hamburger.addEventListener('click', (event) => {
  event.stopPropagation();
  toggleMobileNav();
});

// Close mobile nav when a link is clicked
navList.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    closeMobileNav();
  });
});

// Close drawer when tapping outside the nav
document.addEventListener('click', (event) => {
  if (window.innerWidth <= 768 && navList.classList.contains('open')) {
    const clickedInsideNav = navList.contains(event.target);
    const clickedHamburger = hamburger.contains(event.target);

    if (!clickedInsideNav && !clickedHamburger) {
      closeMobileNav();
    }
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    closeMobileNav();
  }
});

// ─── Active Nav Link on Scroll ───────────────────────────────────────────────
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

function updateActiveNav() {
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}
window.addEventListener('scroll', updateActiveNav);

// ─── Scroll-Reveal (IntersectionObserver) ────────────────────────────────────
const revealEls = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger cards slightly
      const delay = entry.target.closest('.skills-grid, .portfolio-grid, .activities-grid, .reflection-cards')
        ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 100
        : 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));


// ─── Smooth Scroll for all anchor links ──────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─── Photo Gallery Toggle ────────────────────────────────────────────────────
const portfolioCards = document.querySelectorAll('.portfolio-card');
const portfolioToggleBtn = document.querySelector('.portfolio-toggle-btn');

if (portfolioCards.length > 6 && portfolioToggleBtn) {
  const hiddenPortfolioCards = Array.from(portfolioCards).slice(6);
  hiddenPortfolioCards.forEach(card => card.classList.add('hidden'));

  let portfolioExpanded = false;

  portfolioToggleBtn.addEventListener('click', () => {
    portfolioExpanded = !portfolioExpanded;
    hiddenPortfolioCards.forEach(card => {
      card.classList.toggle('hidden', !portfolioExpanded);
    });

    portfolioToggleBtn.textContent = portfolioExpanded ? 'View Less' : 'More Photos';
    portfolioToggleBtn.setAttribute('aria-expanded', String(portfolioExpanded));
  });
}

// ─── Photo Modal ─────────────────────────────────────────────────────────────
const modal = document.getElementById("photo-modal");
const modalImg = document.getElementById("modal-img");
const closeModal = document.getElementById("close-modal");
const modalCaption = document.getElementById("modal-caption");
const modalCaptionTag = document.getElementById("modal-caption-tag");
const modalCaptionTitle = document.getElementById("modal-caption-title");
const modalCaptionText = document.getElementById("modal-caption-text");
const clickableImages = document.querySelectorAll(".portfolio-img img, .reflection-gallery img");
const activityCards = document.querySelectorAll(".activity-card");

function openPhotoModal(img, achievementCard = null) {
  modalImg.src = img.src;
  modalImg.alt = img.alt;
  if (achievementCard) {
    modalCaptionTag.textContent = achievementCard.querySelector(".activity-tag").textContent;
    modalCaptionTitle.textContent = achievementCard.querySelector("h3").textContent;
    modalCaptionText.textContent = achievementCard.querySelector("p").textContent;
    modalCaption.style.display = "block";
  } else {
    modalCaption.style.display = "none";
  }
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
  closeModal.focus();
}

function closePhotoModal() {
  modal.style.display = "none";
  document.body.style.overflow = "";
}

clickableImages.forEach(img => {
  if (img.closest(".reflection-gallery")) {
    img.tabIndex = 0;
    img.setAttribute("role", "button");
    img.setAttribute("aria-label", `Open full-size image: ${img.alt}`);
    img.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openPhotoModal(img);
      }
    });
  }

  img.addEventListener("click", () => openPhotoModal(img));
});

activityCards.forEach(card => {
  const img = card.querySelector(".activity-image");

  card.addEventListener("click", () => {
    // In the carousel, clicking a side slide brings it to the center first
    if (card.classList.contains("carousel-slide") && !card.classList.contains("is-active")) return;
    openPhotoModal(img, card);
  });
  card.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (card.classList.contains("carousel-slide") && !card.classList.contains("is-active")) return;
      openPhotoModal(img, card);
    }
  });
});

closeModal.addEventListener("click", closePhotoModal);

// Close when clicking outside the image
modal.addEventListener("click", event => {
  if (event.target === modal) {
    closePhotoModal();
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && modal.style.display !== "none") {
    closePhotoModal();
  }
});

// ─── Reflection video: custom play button ────────────────────────────────────
document.querySelectorAll(".video-card").forEach(card => {
  const video = card.querySelector("video");
  const playBtn = card.querySelector(".video-play");
  if (!video || !playBtn) return;

  playBtn.addEventListener("click", () => video.play());
  video.addEventListener("play", () => card.classList.add("playing"));
  video.addEventListener("pause", () => card.classList.remove("playing"));
  video.addEventListener("ended", () => card.classList.remove("playing"));
});

// ─── Activities carousel (Teachers' Day) ─────────────────────────────────────
// Moves forward every 6 seconds through all 5 slides, then loops back to the
// first one without rewinding (clones of the first/last slides sit on each side).
(function () {
  const carousel = document.getElementById("activity-carousel");
  if (!carousel) return;

  const AUTOPLAY_MS = 6000;
  const CLONES = 2; // clones on each side of the real slides

  const viewport = carousel.querySelector(".carousel-viewport");
  const track = carousel.querySelector(".carousel-track");
  const realSlides = Array.from(carousel.querySelectorAll(".carousel-slide"));
  const prevBtn = carousel.querySelector(".carousel-prev");
  const nextBtn = carousel.querySelector(".carousel-next");
  const dotsWrap = carousel.querySelector(".carousel-dots");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const n = realSlides.length;

  // build clones: [last-2, last-1] + real slides + [first, second]
  function makeClone(slide) {
    const c = slide.cloneNode(true);
    c.classList.add("is-clone");
    c.removeAttribute("tabindex");
    c.removeAttribute("role");
    c.setAttribute("aria-hidden", "true");
    return c;
  }
  const before = realSlides.slice(-CLONES).map(makeClone);
  const after = realSlides.slice(0, CLONES).map(makeClone);
  before.forEach(c => track.insertBefore(c, realSlides[0]));
  after.forEach(c => track.appendChild(c));

  const all = Array.from(track.querySelectorAll(".carousel-slide"));
  let pos = CLONES;      // position inside "all"
  let timer = null;

  const dots = realSlides.map((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel-dot";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
    dot.addEventListener("click", () => { moveTo(i + CLONES); restartAuto(); });
    dotsWrap.appendChild(dot);
    return dot;
  });

  function logicalIndex() {
    return ((pos - CLONES) % n + n) % n;
  }

  function layout() {
    const slide = all[pos];
    const offset = viewport.clientWidth / 2 - (slide.offsetLeft + slide.offsetWidth / 2);
    track.style.transform = `translateX(${offset}px)`;
  }

  function paint() {
    all.forEach((s, i) => s.classList.toggle("is-active", i === pos));
    realSlides.forEach((s, i) => s.setAttribute("aria-current", i === logicalIndex() ? "true" : "false"));
    dots.forEach((d, i) => {
      d.classList.toggle("is-active", i === logicalIndex());
      d.setAttribute("aria-selected", String(i === logicalIndex()));
    });
  }

  // if we are sitting on a clone, silently jump to the identical real slide
  function normalize() {
    if (pos >= CLONES && pos < CLONES + n) return;
    pos = CLONES + logicalIndex();
    track.style.transition = "none";
    all.forEach(s => (s.style.transition = "none"));
    paint();
    layout();
    void track.offsetWidth; // flush
    track.style.transition = "";
    all.forEach(s => (s.style.transition = ""));
  }

  function moveTo(newPos) {
    normalize();
    pos = Math.max(0, Math.min(all.length - 1, newPos));
    paint();
    layout();
    clearTimeout(moveTo.fallback);
    moveTo.fallback = setTimeout(normalize, 750);
  }

  track.addEventListener("transitionend", e => {
    if (e.target === track && e.propertyName === "transform") normalize();
  });

  function next() { moveTo(pos + 1); }
  function prev() { moveTo(pos - 1); }

  function startAuto() {
    if (reduceMotion) return;
    stopAuto();
    timer = setInterval(next, AUTOPLAY_MS);
  }
  function stopAuto() { clearInterval(timer); timer = null; }
  function restartAuto() { startAuto(); }

  prevBtn.addEventListener("click", () => { prev(); restartAuto(); });
  nextBtn.addEventListener("click", () => { next(); restartAuto(); });

  // clicking a side slide (or its clone) brings it to the center
  all.forEach((slide, i) => {
    slide.addEventListener("click", () => {
      if (i !== pos) { moveTo(i); restartAuto(); }
    });
  });

  // keyboard arrows while focus is inside the carousel
  carousel.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") { prev(); restartAuto(); }
    if (event.key === "ArrowRight") { next(); restartAuto(); }
  });

  // touch swipe
  let touchStartX = null;
  viewport.addEventListener("touchstart", e => {
    touchStartX = e.touches[0].clientX;
    stopAuto();
  }, { passive: true });
  viewport.addEventListener("touchend", e => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
    touchStartX = null;
    startAuto();
  }, { passive: true });

  // pause autoplay while hovering / focused, resume afterwards
  carousel.addEventListener("mouseenter", stopAuto);
  carousel.addEventListener("mouseleave", startAuto);
  carousel.addEventListener("focusin", stopAuto);
  carousel.addEventListener("focusout", startAuto);

  window.addEventListener("resize", layout);
  window.addEventListener("load", layout);

  paint();
  layout();
  startAuto();
})();