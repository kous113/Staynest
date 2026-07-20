console.log("signIn.js loaded");
document.addEventListener("DOMContentLoaded", () => {
  // Exit immediately if this isn't the authentication page
  console.log("DOM loaded");

  const buttons = document.querySelectorAll(".toggle-password");
  console.log(buttons);
  const authModal = document.querySelector(".authModal");
  if (!authModal) return;

  // Form Containers
  const signInBox = authModal.querySelector("#signInBox");
  const signUpBox = authModal.querySelector("#signUpBox");

  // Switch Links
  const toSignUp = authModal.querySelector("#toSignUp");
  const toSignIn = authModal.querySelector("#toSignIn");

  // Forms
  const loginForm = authModal.querySelector("#loginForm");
  const signUpForm = authModal.querySelector("#signUpForm");

  // Switch to Sign Up
  if (toSignUp) {
    toSignUp.addEventListener("click", (e) => {
      e.preventDefault();
      if (loginForm) loginForm.reset();

      signInBox.classList.add("hidden");
      signUpBox.classList.remove("hidden");
    });
  }

  // Switch to Sign In
  if (toSignIn) {
    toSignIn.addEventListener("click", (e) => {
      e.preventDefault();
      if (signUpForm) signUpForm.reset();

      signUpBox.classList.add("hidden");
      signInBox.classList.remove("hidden");
    });
  }

  // Show / Hide Password
  document.querySelectorAll(".toggle-password").forEach((button) => {
    button.addEventListener("click", function () {
      const input = this.closest(".password-wrapper").querySelector("input");

      if (input.type === "password") {
        input.setAttribute("type", "text");
        this.textContent = "Hide";
      } else {
        input.setAttribute("type", "password");
        this.textContent = "Show";
      }
    });
  });

  // Small click animation when forms are submitted
  [loginForm, signUpForm].forEach((form) => {
    if (!form) return;

    form.addEventListener("submit", () => {
      const container = authModal.querySelector(".login-container");

      container.style.transform = "scale(0.98)";

      setTimeout(() => {
        container.style.transform = "scale(1)";
      }, 150);
    });
  });
});
// Bootstrap Validation
const forms = document.querySelectorAll(".needs-validation");

Array.from(forms).forEach((form) => {
  form.addEventListener("submit", (event) => {
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    }

    form.classList.add("was-validated");

    form.querySelectorAll(".auth-input-group").forEach((group) => {
      const input = group.querySelector("input");

      if (input.checkValidity()) {
        group.classList.remove("invalid");
      } else {
        group.classList.add("invalid");
      }
    });
  });
});
