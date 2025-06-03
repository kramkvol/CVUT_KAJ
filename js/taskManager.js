/**
 * =====================================
 * Task Manager Module
 * =====================================
 *
 * This class manages all core logic for the To-Do list application:
 * - Task creation, storage, display, and removal
 * - Integration with localStorage using user-specific keys
 * - Multimedia (image/audio) attachments per task
 * - Completion tracking and drag-and-drop support
 * - Dynamic task expansion and deletion via SVG controls
 *
 * Dependencies:
 * - App.readFileAsBase64 (for image/audio encoding)
 * - App.createSVGTrashIcon (trash button SVG generation)
 * - App.addDragAndDropSupport (for drag-and-drop reordering)
 *
 * Important Notes:
 * - This app is offline-first and stores all data locally.
 * - No server communication is used — designed for local browser execution.
 */

window.App = window.App || {};

App.TaskManager = class {
    constructor() {
        this.loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        this.tasksKey = this.loggedInUser ? `tasks_${this.loggedInUser.username}` : null;
        this.draggedTaskId = null;
    }

    init() {
        if (!this.loggedInUser) {
            alert("Please log in.");
            window.location.href = "login.html";
            return;
        }

        const addBtn = document.getElementById("addTaskButton");
        if (addBtn) addBtn.addEventListener("click", () => this.openTaskModal());

        this.loadTasks();
        this.setupFormHandler();
    }

    loadTasks() {
        const taskList = document.getElementById("taskList");
        const tasks = JSON.parse(localStorage.getItem(this.tasksKey)) || [];
        taskList.innerHTML = "";

        tasks.forEach(task => {
            const li = document.createElement("li");
            li.classList.add("task-card");
            li.dataset.id = task.id;
            li.style.display = "flex";
            li.style.flexDirection = "column";
            li.style.position = "relative";

            const headerRow = document.createElement("div");
            headerRow.style.display = "flex";
            headerRow.style.justifyContent = "space-between";
            headerRow.style.alignItems = "center";
            headerRow.style.width = "100%";

            const checkSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            checkSvg.setAttribute("width", "20");
            checkSvg.setAttribute("height", "20");
            checkSvg.setAttribute("viewBox", "0 0 24 24");
            checkSvg.style.cursor = "pointer";

            const checkPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            checkPath.setAttribute("fill", "none");
            checkPath.setAttribute("stroke", "green");
            checkPath.setAttribute("stroke-width", "2");
            checkPath.setAttribute("d", task.completed ? "M5 13l4 4L19 7" : "M4 4h16v16H4z");

            checkSvg.appendChild(checkPath);
            checkSvg.addEventListener("click", (e) => {
                e.stopPropagation();
                this.toggleTaskCompletion(task.id);
            });

            const title = document.createElement("span");
            title.textContent = task.text;
            title.style.fontWeight = "bold";
            title.style.marginLeft = "10px";
            title.style.flexGrow = "1";

            const toggleSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            toggleSvg.setAttribute("width", "20");
            toggleSvg.setAttribute("height", "20");
            toggleSvg.setAttribute("viewBox", "0 0 24 24");
            toggleSvg.style.cursor = "pointer";

            const togglePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            togglePath.setAttribute("d", "M6 9l6 6 6-6");
            togglePath.setAttribute("stroke", "black");
            togglePath.setAttribute("stroke-width", "2");
            togglePath.setAttribute("fill", "none");

            toggleSvg.appendChild(togglePath);

            const expandableWrapper = document.createElement("div");
            expandableWrapper.style.display = "none";

            if (task.note) {
                const note = document.createElement("p");
                note.textContent = task.note;
                note.style.fontSize = "0.9em";
                note.style.color = "#555";
                expandableWrapper.appendChild(note);
            }

            if (task.image) {
                const img = document.createElement("img");
                img.src = task.image;
                expandableWrapper.appendChild(img);
            }

            if (task.audio) {
                const audio = document.createElement("audio");
                audio.controls = true;
                audio.src = task.audio;
                expandableWrapper.appendChild(audio);
            }

            toggleSvg.addEventListener("click", (e) => {
                e.stopPropagation();
                expandableWrapper.style.display = expandableWrapper.style.display === "none" ? "block" : "none";
            });

            const deleteIcon = App.createSVGTrashIcon(() => {
                if (confirm("Delete this task?")) {
                    this.deleteTask(task.id);
                }
            });

            headerRow.appendChild(checkSvg);
            headerRow.appendChild(title);
            headerRow.appendChild(toggleSvg);
            headerRow.appendChild(deleteIcon);

            li.appendChild(headerRow);
            li.appendChild(expandableWrapper);

            if (task.completed) li.classList.add("completed");

            App.addDragAndDropSupport(li, this);
            taskList.appendChild(li);
        });
    }

    openTaskModal() {
        document.getElementById("taskModal").style.display = "block";
    }

    setupModalHandlers() {
        document.getElementById("saveTaskButton").onclick = () => this.saveTaskFromModal();
        document.getElementById("cancelTaskButton").onclick = () => {
            document.getElementById("taskModal").style.display = "none";
        };
    }

    saveTaskFromModal() {
        const title = document.getElementById("newTaskText").value.trim();
        const note = document.getElementById("newTaskNote").value.trim();
        const image = document.getElementById("newTaskImage").files[0];
        const audio = document.getElementById("newTaskAudio").files[0];

        if (!title) return alert("Task title is required.");

        Promise.all([
            App.readFileAsBase64(image),
            App.readFileAsBase64(audio)
        ]).then(([imgBase64, audioBase64]) => {
            const newTask = {
                id: Date.now().toString(),
                text: title,
                note,
                completed: false,
                image: imgBase64,
                audio: audioBase64
            };
            const tasks = JSON.parse(localStorage.getItem(this.tasksKey)) || [];
            tasks.push(newTask);
            localStorage.setItem(this.tasksKey, JSON.stringify(tasks));
            this.loadTasks();
        });

        document.getElementById("taskModal").style.display = "none";
    }

    toggleTaskCompletion(taskId) {
        let tasks = JSON.parse(localStorage.getItem(this.tasksKey)) || [];
        tasks = tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
        localStorage.setItem(this.tasksKey, JSON.stringify(tasks));
        this.loadTasks();
    }

    deleteTask(taskId) {
        if (!confirm("Are you sure?")) return;
        let tasks = JSON.parse(localStorage.getItem(this.tasksKey)) || [];
        tasks = tasks.filter(t => t.id !== taskId);
        localStorage.setItem(this.tasksKey, JSON.stringify(tasks));
        this.loadTasks();
    }

    setupFormHandler() {
        const form = document.getElementById("addTaskForm");
        if (!form) return;

        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            const title = document.getElementById("taskText").value.trim();
            const note = document.getElementById("taskNote").value.trim();
            const imageFile = document.getElementById("taskImage").files[0];
            const audioFile = document.getElementById("taskAudio").files[0];

            if (!title) {
                alert("Task title is required.");
                return;
            }

            const [imageBase64, audioBase64] = await Promise.all([
                App.readFileAsBase64(imageFile),
                App.readFileAsBase64(audioFile)
            ]);

            const newTask = {
                id: Date.now().toString(),
                text: title,
                note,
                completed: false,
                image: imageBase64,
                audio: audioBase64
            };

            const tasks = JSON.parse(localStorage.getItem(this.tasksKey)) || [];
            tasks.push(newTask);
            localStorage.setItem(this.tasksKey, JSON.stringify(tasks));

            form.reset();
            this.loadTasks();
            alert("Task added successfully!");
            window.location.hash = "#list";
        });
    }
};
