/**
 * =====================================
 * Drag & Drop Task Reordering Support
 * =====================================
 * 
 * This utility function enables drag-and-drop reordering of task elements
 * in a to-do list UI. It uses native HTML5 drag events to:
 * 
 * - Mark each task as draggable
 * - Track which task is being dragged
 * - Reorder the task list when a task is dropped onto another
 * - Persist the new task order in localStorage
 * 
 * Requires:
 * - Each task element must have a unique `data-id` attribute
 * - A reference to the current TaskManager instance to update state
 * 
 * This feature works entirely on the frontend (no server involved).
 */

window.App = window.App || {};

App.addDragAndDropSupport = function(taskElement, managerInstance) {
    taskElement.setAttribute("draggable", "true");

    taskElement.addEventListener("dragstart", e => {
        managerInstance.draggedTaskId = taskElement.dataset.id;
    });

    taskElement.addEventListener("dragover", e => {
        e.preventDefault();
    });

    taskElement.addEventListener("drop", e => {
        const targetId = taskElement.dataset.id;
        if (!managerInstance.draggedTaskId || managerInstance.draggedTaskId === targetId) return;

        let tasks = JSON.parse(localStorage.getItem(managerInstance.tasksKey)) || [];

        const fromIdx = tasks.findIndex(t => t.id === managerInstance.draggedTaskId);
        const toIdx = tasks.findIndex(t => t.id === targetId);

        const [moved] = tasks.splice(fromIdx, 1);
        tasks.splice(toIdx, 0, moved);

        localStorage.setItem(managerInstance.tasksKey, JSON.stringify(tasks));
        managerInstance.loadTasks();
    });
};
