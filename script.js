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
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
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
