/**
 * =====================================
 * SVG Trash Icon Utilities
 * =====================================
 * 
 * This module defines two reusable functions for creating trash (delete) icons as SVGs.
 * These icons are used in the task list UI to allow deletion of tasks.
 * 
 * Features:
 * - `App.addSVGDeleteIcon` inserts a delete icon directly into a DOM element and links it to a specific task.
 * - `App.createSVGTrashIcon` returns a reusable SVG icon and lets you define a custom callback for deletion.
 * 
 * Icons are visually represented as red trash bins using SVG path syntax.
 * Designed for use in task cards, toolbars, and delete-all buttons.
 */

window.App = window.App || {};

App.addSVGDeleteIcon = function(parentElement, taskId, managerInstance) {
    const xmlns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(xmlns, "svg");
    svg.setAttribute("width", "24");
    svg.setAttribute("height", "24");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.style.cursor = "pointer";
    svg.style.marginLeft = "10px";

    const path = document.createElementNS(xmlns, "path");
    path.setAttribute("d", "M3 6h18M8 6v12m8-12v12M5 6l1-1h12l1 1");
    path.setAttribute("stroke", "red");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("fill", "none");

    svg.appendChild(path);
    svg.addEventListener("click", (e) => {
        e.stopPropagation();
        managerInstance.deleteTask(taskId);
    });

    parentElement.appendChild(svg);
};

App.createSVGTrashIcon = function(callback) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "20");
    svg.setAttribute("height", "20");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.style.cursor = "pointer";

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M3 6h18M8 6v12m8-12v12M5 6l1-1h12l1 1");
    path.setAttribute("stroke", "red");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("fill", "none");

    svg.appendChild(path);
    svg.addEventListener("click", (e) => {
        e.stopPropagation();
        callback();
    });

    return svg;
};

