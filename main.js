window.addEventListener('load', () => {
    const form = document.querySelector("#new-task-form");
    const input = document.querySelector("#new-task-input");
    const list_el = document.querySelector("#tasks");
    const filterOption = document.querySelector(".filter-todo");

    filterOption.addEventListener("change", filterTodo);

    // Load tasks from local storage on page load
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(savedTask => {
        addTaskToDOM(savedTask);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const task = input.value;

        if (!task) {
            alert("Please fill out the task");
            return;
        }

        const taskObject = { task, readonly: true, filter: "all" };

        addTaskToDOM(taskObject);

        // Save tasks to local storage
        saveData();
        input.value = "";
    });

    function addTaskToDOM(taskObject) {
        const task_el = document.createElement("div");
        task_el.classList.add("task");
        task_el.setAttribute("data-filter", taskObject.filter);

        const task_content_el = document.createElement("div");
        task_content_el.classList.add("content");

        task_el.appendChild(task_content_el);

        const task_input_el = document.createElement("input");
        task_input_el.classList.add("text");
        task_input_el.type = "text";
        task_input_el.value = taskObject.task;
        task_input_el.setAttribute("readonly", taskObject.readonly);

        task_content_el.appendChild(task_input_el);

        const task_actions_el = document.createElement("div");
        task_actions_el.classList.add("actions");

        const task_edit_el = document.createElement("button");
        task_edit_el.classList.add("edit");
        task_edit_el.innerHTML = "Edit";

        const task_delete_el = document.createElement("button");
        task_delete_el.classList.add("delete");
        task_delete_el.innerHTML = "Delete";

        task_actions_el.appendChild(task_edit_el);
        task_actions_el.appendChild(task_delete_el);

        task_el.appendChild(task_actions_el);

        list_el.appendChild(task_el);

        task_edit_el.addEventListener('click', () => {
            if (task_edit_el.innerText.toLowerCase() == "edit") {
                task_input_el.removeAttribute("readonly");
                task_input_el.focus();
                task_edit_el.innerText = "Save";
            } else {
                task_input_el.setAttribute("readonly", "readonly");
                task_edit_el.innerText = "Edit";
            }

            // Update taskObject properties
            taskObject.readonly = !taskObject.readonly;

            // Save tasks to local storage
            saveData();
        });

        task_delete_el.addEventListener('click', () => {
            list_el.removeChild(task_el);
            // Remove the task from savedTasks
            const index = savedTasks.findIndex(savedTask => savedTask.task === taskObject.task);
            if (index !== -1) {
                savedTasks.splice(index, 1);
                // Save updated tasks to local storage
                saveData();
            }
        });
    }

    function saveData() {
        const tasks = Array.from(list_el.children).map(task_el => {
            const input = task_el.querySelector('.text');
            return { task: input.value, readonly: input.hasAttribute('readonly'), filter: task_el.getAttribute("data-filter") };
        });

        // Save tasks to local storage
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function filterTodo() {
        const selectedFilter = filterOption.value;

        Array.from(list_el.children).forEach(task_el => {
            const taskFilter = task_el.getAttribute("data-filter");
            if (selectedFilter === "all" || selectedFilter === taskFilter) {
                task_el.style.display = "block";
            } else {
                task_el.style.display = "none";
            }
        });
    }
});