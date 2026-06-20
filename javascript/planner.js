let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskName = document.getElementById("taskName");
const taskDate = document.getElementById("taskDate");
const addTaskBtn = document.getElementById("addTaskBtn");

const taskList = document.getElementById("taskList");

const totalTasksEl = document.getElementById("totalTasks");
const completedTasksEl = document.getElementById("completedTasks");
const pendingTasksEl = document.getElementById("pendingTasks");

let editId = null;

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

addTaskBtn.addEventListener("click", function () {

  const name = taskName.value.trim();
  const date = taskDate.value;

  if (!name) return alert("Enter task name");

  if (editId !== null) {

    tasks = tasks.map(task => {
      if (task.id === editId) {
        return { ...task, name: name, date: date };
      }
      return task;
    });

    editId = null;

  } else {

    const task = {
      id: Date.now(),
      name: name,
      date: date,
      completed: false
    };

    tasks.push(task);

  }

  taskName.value = "";
  taskDate.value = "";

  saveTasks();
  renderTasks();
  updateStats();

});

function renderTasks() {

  taskList.innerHTML = "";

  if (tasks.length === 0) {
    taskList.innerHTML = `<p class="text-gray-400 text-sm">No tasks yet...</p>`;
    return;
  }

  tasks.forEach(task => {

    const item = document.createElement("div");

    item.className = "flex justify-between items-center border p-3 rounded-xl";

    item.innerHTML = `

      <div>
        <p class="font-semibold ${task.completed ? 'line-through text-gray-400' : ''}">
          ${task.name}
        </p>

        <p class="text-sm text-gray-500">
          ${task.date || "No date"}
        </p>
      </div>

      <div class="flex gap-3">

        <button onclick="toggleTask(${task.id})" class="text-green-500 hover:underline">
          ${task.completed ? "Undo" : "Done"}
        </button>

        <button onclick="editTask(${task.id})" class="text-blue-500 hover:underline">
          Edit
        </button>

        <button onclick="deleteTask(${task.id})" class="text-red-500 hover:underline">
          Delete
        </button>

      </div>

    `;

    taskList.appendChild(item);

  });

}

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

function editTask(id) {

  const task = tasks.find(t => t.id === id);

  taskName.value = task.name;
  taskDate.value = task.date;

  editId = id;

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