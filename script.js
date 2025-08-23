// Manual Slideshow Portfolio JavaScript

(function () {
  "use strict";

  // Project data
  const projects = [
    {
      title: "Komponenty",
      description:
        "Komponenty na přání přímo pro váš web. Moderní, responzivní a snadno integrovatelné řešení pro každý projekt.",
      image: "pic/projekt1.svg",
    },
    {
      title: "Redesign aplikace",
      description:
        "Kompletní redesign mobilní aplikace s důrazem na uživatelskou přívětivost a intuitivní navigaci.",
      image: "pic/projekt2.svg",
    },
    {
      title: "Webové rozhraní",
      description:
        "Moderní webové rozhraní pro správu obsahu s intuitivním ovládáním a pokročilými funkcemi.",
      image: "pic/projekt3.webp",
    },
  ];

  // Slideshow state
  let currentSlide = 0;
  let totalSlides = projects.length;

  // DOM elements will be cached here
  let elements = {};

  // Initialize elements after DOM loads
  function initializeElements() {
    elements = {
      menuToggle: document.querySelector(".menu-toggle"),
      navMenu: document.querySelector(".nav-menu"),
      nav: document.querySelector("nav"),
      showcase: document.getElementById("showcase"),
      showcasePreview: document.getElementById("showcasePreview"),
      projectTitle: document.getElementById("projectTitle"),
      projectDescription: document.getElementById("projectDescription"),
      navArrows: document.querySelectorAll(".nav-arrow"),
      indicators: document.querySelectorAll(".indicator"),
      navLinks: document.querySelectorAll('a[href^="#"]'),
      slides: document.querySelectorAll(".slide"),
      slideBgs: document.querySelectorAll(".slide-bg"),
    };
  }

  // Mobile menu functionality
  function initializeMobileMenu() {
    if (!elements.menuToggle || !elements.navMenu) return;

    elements.menuToggle.addEventListener("click", toggleMobileMenu);
    document.addEventListener("click", handleOutsideClick);
    document.addEventListener("keydown", handleGlobalKeyDown);
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

  function handleGlobalKeyDown(event) {
    if (event.key === "Escape") {
      closeMobileMenu();
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

    event.currentTarget.blur();

    const targetPosition =
      targetElement.getBoundingClientRect().top + window.pageYOffset - 80;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });

    closeMobileMenu();
  }

  // Initialize slideshow functionality
  function initializeSlideshow() {
    // Set background images for all slides
    if (elements.slideBgs && elements.slideBgs.length > 0) {
      elements.slideBgs.forEach((bg, index) => {
        if (projects[index]) {
          bg.style.backgroundImage = `url(${projects[index].image})`;
        }
      });
    }

    // Set initial project
    updateProject(0);

    // Add navigation arrow listeners
    if (elements.navArrows) {
      elements.navArrows.forEach((arrow) => {
        arrow.addEventListener("click", (event) => {
          event.stopPropagation();

          if (arrow.classList.contains("prev")) {
            prevSlide();
          } else {
            nextSlide();
          }
        });
      });
    }
  }

  function nextSlide() {
    const prevIndex = currentSlide;
    currentSlide = (currentSlide + 1) % totalSlides;
    updateProject(currentSlide, "next", prevIndex);
  }

  function prevSlide() {
    const prevIndex = currentSlide;
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateProject(currentSlide, "prev", prevIndex);
  }

  function updateProject(index, direction = null, prevIndex = null) {
    const project = projects[index];

    if (!project) return;

    // Update text immediately
    if (elements.projectTitle) {
      elements.projectTitle.textContent = project.title;
    }

    if (elements.projectDescription) {
      elements.projectDescription.textContent = project.description;
    }

    // Handle slide animation
    if (elements.slides && elements.slides.length > 0) {
      if (direction && prevIndex !== null) {
        // Animated transition
        const currentSlideEl = elements.slides[prevIndex];
        const newSlideEl = elements.slides[index];

        // Clear all animation classes
        elements.slides.forEach((slide) => {
          slide.classList.remove(
            "active",
            "exit-left",
            "exit-right",
            "enter-from-left",
            "enter-from-right"
          );
        });

        if (direction === "next") {
          // Klik na PRAVOU šipku: současný odejde doprava, nový přijde zleva
          newSlideEl.classList.add("enter-from-left");

          requestAnimationFrame(() => {
            currentSlideEl.classList.add("exit-right");
            newSlideEl.classList.remove("enter-from-left");
            newSlideEl.classList.add("active");
          });
        } else if (direction === "prev") {
          // Klik na LEVOU šipku: současný odejde doleva, nový přijde zprava
          newSlideEl.classList.add("enter-from-right");

          requestAnimationFrame(() => {
            currentSlideEl.classList.add("exit-left");
            newSlideEl.classList.remove("enter-from-right");
            newSlideEl.classList.add("active");
          });
        }
      } else {
        // Initial load - just set active
        elements.slides.forEach((slide, i) => {
          slide.classList.remove(
            "active",
            "exit-left",
            "exit-right",
            "enter-from-left",
            "enter-from-right"
          );
          if (i === index) {
            slide.classList.add("active");
          }
        });
      }
    }

    // Update indicators
    if (elements.indicators) {
      elements.indicators.forEach((indicator, i) => {
        indicator.classList.toggle("active", i === index);
      });
    }
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

    // Observe elements
    const observedElements = document.querySelectorAll(
      ".showcase-container, .about-card, .contact-card"
    );
    observedElements.forEach((el) => observer.observe(el));
  }

  // Preload project images
  function preloadImages() {
    const criticalImages = ["pic/logo.svg", "pic/Pic.jpg"];
    const projectImages = projects.map((project) => project.image);
    const allImages = [...criticalImages, ...projectImages];

    allImages.forEach((src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      document.head.appendChild(link);
    });
  }

  // Performance optimization: Throttled scroll handler
  let scrollTimeout;
  function handleScroll() {
    if (scrollTimeout) return;

    scrollTimeout = setTimeout(() => {
      scrollTimeout = null;
    }, 16);
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

    safeExecute(() => initializeMobileMenu(), "initializeMobileMenu");
    safeExecute(() => initializeSmoothScrolling(), "initializeSmoothScrolling");
    safeExecute(() => initializeSlideshow(), "initializeSlideshow");
    safeExecute(
      () => initializeIntersectionObserver(),
      "initializeIntersectionObserver"
    );
    safeExecute(() => preloadImages(), "preloadImages");

    window.addEventListener("scroll", handleScroll, { passive: true });
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Expose functions for debugging
  window.portfolioSlideshow = {
    nextSlide,
    prevSlide,
    projects,
    currentSlide: () => currentSlide,
    elements: () => elements,
  };
})();
