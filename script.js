// Wait for DOM to load
document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const nav = document.querySelector("nav");

  // Toggle mobile menu
  menuToggle.addEventListener("click", function () {
    navMenu.classList.toggle("active");
    menuToggle.classList.toggle("active");
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", function (e) {
    if (!nav.contains(e.target)) {
      navMenu.classList.remove("active");
      menuToggle.classList.remove("active");
    }
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      // Remove focus from the clicked link
      this.blur();

      const targetId = this.getAttribute("href");
      const target = document.querySelector(targetId);

      if (target) {
        // Try multiple methods for better compatibility
        if ("scrollBehavior" in document.documentElement.style) {
          // Modern browsers
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
          });
        } else {
          // Fallback for older browsers
          const targetPosition =
            target.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }

        // Close mobile menu if open
        navMenu.classList.remove("active");
        menuToggle.classList.remove("active");
      }
    });
  });

  // Close menu on escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      navMenu.classList.remove("active");
      menuToggle.classList.remove("active");
      closeModal(); // Also close modal if open
    }
  });

  // Modal functionality
  const modal = document.getElementById("imageModal");
  const closeBtn = document.querySelector(".close");

  // Close modal when clicking the X
  closeBtn.addEventListener("click", closeModal);

  // Close modal when clicking outside the content
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });
});

// Modal functions (global scope so they can be called from HTML onclick)
function openModal(imageSrc, title, description) {
  const modal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  const modalDescription = document.getElementById("modalDescription");

  modalImage.src = imageSrc;
  modalTitle.textContent = title;
  modalDescription.textContent = description;

  modal.style.display = "block";
  document.body.style.overflow = "hidden"; // Prevent background scrolling

  // Trigger animation
  setTimeout(() => {
    modal.classList.add("show");
  }, 10);
}

function closeModal() {
  const modal = document.getElementById("imageModal");
  modal.classList.remove("show");

  // Wait for animation to complete before hiding
  setTimeout(() => {
    modal.style.display = "none";
    document.body.style.overflow = "auto"; // Restore scrolling
  }, 300);
}
// Add this to your script.js file

// Set background images from data attributes
document.addEventListener("DOMContentLoaded", function () {
  const projectCards = document.querySelectorAll(".project-card[data-bg]");

  projectCards.forEach((card) => {
    const bgImage = card.dataset.bg;
    if (bgImage) {
      card.style.backgroundImage = `url(${bgImage})`;
    }
  });
});

// Modal functionality (if you don't have it already)
function openModal(imageSrc, title, description) {
  const modal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  const modalDescription = document.getElementById("modalDescription");

  modalImage.src = imageSrc;
  modalImage.alt = title;
  modalTitle.textContent = title;
  modalDescription.textContent = description;

  modal.style.display = "block";
  modal.setAttribute("aria-hidden", "false");

  // Add show class after display block for animation
  setTimeout(() => modal.classList.add("show"), 10);
}

// Close modal functionality
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("imageModal");
  const closeBtn = document.querySelector(".close");

  // Close on X button click
  closeBtn.addEventListener("click", closeModal);

  // Close on outside click
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("show")) {
      closeModal();
    }
  });

  // Project cards click handlers
  const projectCards = document.querySelectorAll(
    ".project-card[data-modal-img]"
  );
  projectCards.forEach((card) => {
    card.addEventListener("click", function () {
      const imageSrc = this.dataset.modalImg;
      const title = this.dataset.modalTitle;
      const description = this.dataset.modalDesc;
      openModal(imageSrc, title, description);
    });
  });
});

function closeModal() {
  const modal = document.getElementById("imageModal");
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");

  // Hide modal after animation completes
  setTimeout(() => {
    modal.style.display = "none";
  }, 300);
}
