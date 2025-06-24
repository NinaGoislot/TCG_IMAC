document.addEventListener("DOMContentLoaded", () => {
  const signupTab = document.getElementById("tab-signup");
  const loginTab = document.getElementById("tab-login");
  const signupForm = document.getElementById("signup-form");
  const loginForm = document.getElementById("login-form");

  signupTab.addEventListener("click", () => {
    signupTab.classList.add("border-green-500", "text-white");
    signupTab.classList.remove("text-gray-400");

    loginTab.classList.remove("border-green-500", "text-white");
    loginTab.classList.add("text-gray-400");

    signupForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
  });

  loginTab.addEventListener("click", () => {
    loginTab.classList.add("border-green-500", "text-white");
    loginTab.classList.remove("text-gray-400");

    signupTab.classList.remove("border-green-500", "text-white");
    signupTab.classList.add("text-gray-400");

    signupForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
  });
});

function signup() {
  const firstName = document.getElementById("signup-firstname").value;
  const lastName = document.getElementById("signup-lastname").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  fetch("/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstName, lastName, email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        localStorage.setItem("userId", data.userId);
        window.location.href = "/";
      } else {
        alert("Erreur: " + data.message);
      }
    });
}

function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        localStorage.setItem("userId", data.userId);
        window.location.href = "/";
      } else {
        alert("Erreur de connexion");
      }
    });
}

function trollMdpForget() {
    alert("Dommage, fallait le noter.");
}