/**
 * =====================================
 * App Initialization & Routing Module
 * =====================================
 *
 * This module handles:
 * - Dynamic loading of shared layout fragments (header, footer)
 * - Single-page application routing via URL hash (#add, #list)
 * - Initialization of TaskManager class if present
 * - Responsive UI behavior on focus (scroll to form)
 *
 * Features:
 * - Smooth section scrolling
 * - Handles back/forward navigation
 * - Auto-pushes URL hash when input fields gain focus
 * - Gracefully degrades if certain sections or modules are missing
 *
 * Dependencies:
 * - App.TaskManager
 * - App.checkNetworkStatus (optional)
 * - App.loadHTML
 */

window.App = window.App || {};

App.loadHTML = function(url, elementId) {
  const container = document.getElementById(elementId);
  if (!container) return;

  fetch(url)
    .then(response => response.text())
    .then(data => {
      container.innerHTML = data;
    })
    .catch(error => console.error(`Error loading ${url}:`, error));
};

App.handleRouting = function(hash) {
  if (hash === "#add") {
    document.getElementById("addTaskSection")?.scrollIntoView({ behavior: "smooth" });
  } else if (hash === "#list") {
    document.getElementById("taskSection")?.scrollIntoView({ behavior: "smooth" });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  App.loadHTML("partials/header.html", "header");
  App.loadHTML("partials/footer.html", "footer");

  App.checkNetworkStatus?.();

  if (typeof App.TaskManager === "function" && document.getElementById("taskList")) {
    App.taskManager = new App.TaskManager();
    App.taskManager.init();
  }

  App.handleRouting(location.hash);

  window.addEventListener("popstate", () => {
    App.handleRouting(location.hash);
  });
});

const formFields = ["taskText", "taskNote", "taskImage", "taskAudio"];
formFields.forEach(id => {
  const field = document.getElementById(id);
  if (field) {
    field.addEventListener("focus", () => {
      if (location.hash !== "#add") {
        history.pushState(null, "", "#add");
        App.handleRouting("#add");
      }
    });
  }
});

