// Optimized Portfolio JavaScript - Removed duplicates and improved performance

(function () {
  "use strict";

  // Cache DOM elements for better performance
  const elements = {
    menuToggle: null,
    navMenu: null,
    nav: null,
    modal: null,
    modalImage: null,
    modalTitle: null,
    modalDescription: null,
    closeBtn: null,
    projectCards: null,
    navLinks: null,
  };

  // Initialize elements after DOM loads
  function initializeElements() {
    elements.menuToggle = document.querySelector(".menu-toggle");
    elements.navMenu = document.querySelector(".nav-menu");
    elements.nav = document.querySelector("nav");
    elements.modal = document.getElementById("imageModal");
    elements.modalImage = document.getElementById("modalImage");
    elements.modalTitle = document.getElementById("modalTitle");
    elements.modalDescription = document.getElementById("modalDescription");
    elements.closeBtn = document.querySelector(".close");
    elements.projectCards = document.querySelectorAll(
      ".project-card[data-modal-img]"
    );
    elements.navLinks = document.querySelectorAll('a[href^="#"]');
  }

  // Mobile menu functionality
  function initializeMobileMenu() {
    if (!elements.menuToggle || !elements.navMenu) return;

    elements.menuToggle.addEventListener("click", toggleMobileMenu);

    // Close menu when clicking outside
    document.addEventListener("click", handleOutsideClick);

    // Handle escape key
    document.addEventListener("keydown", handleKeyDown);
  }

  function toggleMobileMenu() {
    const isExpanded =
      elements.menuToggle.getAttribute("aria-expanded") === "true";

    elements.navMenu.classList.toggle("active");
    elements.menuToggle.classList.toggle("active");
    elements.menuToggle.setAttribute("aria-expanded", !isExpanded);
  }

  function closeMobileMenu() {
    elements.navMenu.classList.remove("active");
    elements.menuToggle.classList.remove("active");
    elements.menuToggle.setAttribute("aria-expanded", "false");
  }

  function handleOutsideClick(event) {
    if (!elements.nav.contains(event.target)) {
      closeMobileMenu();
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Escape") {
      closeMobileMenu();
      closeModal();
    }
  }

  // Smooth scrolling functionality
  function initializeSmoothScrolling() {
    elements.navLinks.forEach((anchor) => {
      anchor.addEventListener("click", handleSmoothScroll);
    });
  }

  function handleSmoothScroll(event) {
    event.preventDefault();

    const targetId = event.currentTarget.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    if (!targetElement) return;

    // Remove focus from clicked link for better UX
    event.currentTarget.blur();

    // Smooth scroll with better browser support
    const targetPosition =
      targetElement.getBoundingClientRect().top + window.pageYOffset - 80;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });

    // Close mobile menu
    closeMobileMenu();
  }

  // Modal functionality
  function initializeModal() {
    if (!elements.modal || !elements.closeBtn) return;

    elements.closeBtn.addEventListener("click", closeModal);
    elements.modal.addEventListener("click", handleModalClick);

    // Project cards click handlers
    elements.projectCards.forEach((card) => {
      card.addEventListener("click", handleProjectCardClick);
      card.addEventListener("keydown", handleProjectCardKeydown);
    });
  }

  function handleProjectCardClick(event) {
    const card = event.currentTarget;
    const imageSrc = card.dataset.modalImg;
    const title = card.dataset.modalTitle;
    const description = card.dataset.modalDesc;

    openModal(imageSrc, title, description);
  }

  function handleProjectCardKeydown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleProjectCardClick(event);
    }
  }

  function handleModalClick(event) {
    if (event.target === elements.modal) {
      closeModal();
    }
  }

  function openModal(imageSrc, title, description) {
    if (!elements.modal || !imageSrc || !title) return;

    elements.modalImage.src = imageSrc;
    elements.modalImage.alt = title;
    elements.modalTitle.textContent = title;
    elements.modalDescription.textContent = description;

    elements.modal.style.display = "block";
    elements.modal.setAttribute("aria-hidden", "false");

    // Prevent body scrolling
    document.body.style.overflow = "hidden";

    // Focus management for accessibility
    elements.modal.focus();

    // Trigger animation after display is set
    requestAnimationFrame(() => {
      elements.modal.classList.add("show");
    });
  }

  function closeModal() {
    if (!elements.modal) return;

    elements.modal.classList.remove("show");
    elements.modal.setAttribute("aria-hidden", "true");

    // Hide modal after animation completes
    setTimeout(() => {
      elements.modal.style.display = "none";
      document.body.style.overflow = "auto";
    }, 300);
  }

  // Set project background images
  function setProjectBackgrounds() {
    const projectCards = document.querySelectorAll(".project-card[data-bg]");

    projectCards.forEach((card) => {
      const bgImage = card.dataset.bg;
      if (bgImage) {
        // Use CSS custom property for better performance
        card.style.setProperty("--bg-image", `url(${bgImage})`);
        card.style.backgroundImage = "var(--bg-image)";
      }
    });
  }

  // Performance optimization: Throttled scroll handler
  let scrollTimeout;
  function handleScroll() {
    if (scrollTimeout) return;

    scrollTimeout = setTimeout(() => {
      // Add any scroll-based functionality here
      scrollTimeout = null;
    }, 16); // ~60fps
  }

  // Intersection Observer for performance optimization
  function initializeIntersectionObserver() {
    if (!("IntersectionObserver" in window)) return;

    const observerOptions = {
      rootMargin: "50px 0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, observerOptions);

    // Observe elements that can benefit from lazy animations
    const observedElements = document.querySelectorAll(
      ".project-card, .about-card, .contact-card"
    );
    observedElements.forEach((el) => observer.observe(el));
  }

  // Preload critical images
  function preloadImages() {
    const criticalImages = ["pic/temp-logo.svg", "pic/Pic.jpg"];

    criticalImages.forEach((src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      document.head.appendChild(link);
    });
  }

  // Error handling wrapper
  function safeExecute(fn, context = "Unknown") {
    try {
      fn();
    } catch (error) {
      console.warn(`Error in ${context}:`, error);
    }
  }

  // Main initialization
  function init() {
    initializeElements();

    safeExecute(() => setProjectBackgrounds(), "setProjectBackgrounds");
    safeExecute(() => initializeMobileMenu(), "initializeMobileMenu");
    safeExecute(() => initializeSmoothScrolling(), "initializeSmoothScrolling");
    safeExecute(() => initializeModal(), "initializeModal");
    safeExecute(
      () => initializeIntersectionObserver(),
      "initializeIntersectionObserver"
    );
    safeExecute(() => preloadImages(), "preloadImages");

    // Add scroll handler if needed
    window.addEventListener("scroll", handleScroll, { passive: true });
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Expose necessary functions globally for backward compatibility
  window.openModal = openModal;
  window.closeModal = closeModal;
})();
