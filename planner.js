const taskList = document.getElementById("taskList");
const taskName = document.getElementById("taskName");
const taskDate = document.getElementById("taskDate");
const addTaskBtn = document.getElementById("addTaskBtn");

const totalTasksEl = document.getElementById("totalTasks");
const completedTasksEl = document.getElementById("completedTasks");
const pendingTasksEl = document.getElementById("pendingTasks");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    taskList.innerHTML = `<p class="text-gray-400 text-sm">No tasks yet...</p>`;
    return;
  }

  tasks.forEach(task => {
    const item = document.createElement("div");

    item.className = "flex justify-between items-center border-b pb-2";

    item.innerHTML = `
      <div>
        <p class="font-semibold ${task.completed ? 'line-through text-gray-400' : ''}">
          ${task.name}
        </p>
        <p class="text-sm text-gray-500">${task.date || "No date"}</p>
      </div>

      <div class="flex gap-3 items-center">

        <button onclick="toggleTask(${task.id})"
          class="text-green-500 text-sm hover:underline">
          ${task.completed ? "Undo" : "Done"}
        </button>

        <button onclick="deleteTask(${task.id})"
          class="text-red-500 text-sm hover:underline">Delete
        </button>

      </div>
      `;

    taskList.appendChild(item);
  });
}

addTaskBtn.addEventListener("click", function () {
  const name = taskName.value;
  const date = taskDate.value;

  if (!name) {
    alert("Please enter a task name");
    return;
  }

  const task = {
    id: Date.now(),
    name,
    date,
    completed: false
  };

  tasks.push(task);

  taskName.value = "";
  taskDate.value = "";

  saveTasks();
  renderTasks();
  updateStats();
});

function toggleTask(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });

  saveTasks();
  renderTasks();
  updateStats();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);

  saveTasks();
  renderTasks();
  updateStats();
}

function updateStats() {
  totalTasksEl.textContent = tasks.length;

  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.length - completed;

  completedTasksEl.textContent = completed;
  pendingTasksEl.textContent = pending;
}

renderTasks();
updateStats();