const goalName = document.getElementById("goalName");
const goalTarget = document.getElementById("goalTarget");
const addGoalBtn = document.getElementById("addGoalBtn");

const goalsList = document.getElementById("goalsList");

const totalGoalsEl = document.getElementById("totalGoals");
const completedGoalsEl = document.getElementById("completedGoals");
const averageProgressEl = document.getElementById("averageProgress");

let goals = JSON.parse(localStorage.getItem("goals")) || [];

function saveGoals() {
  localStorage.setItem("goals", JSON.stringify(goals));
}

addGoalBtn.addEventListener("click", function () {
  const name = goalName.value.trim();
  const target = Number(goalTarget.value);

  if (!name || !target) {
    alert("Please fill in all fields");
    return;
  }

  const goal = {
    id: Date.now(),
    name,
    target,
    progress: 0
  };

  goals.push(goal);

  goalName.value = "";
  goalTarget.value = "";

  saveGoals();
  renderGoals();
  updateStats();
});

function renderGoals() {
  goalsList.innerHTML = "";

  if (goals.length === 0) {
    goalsList.innerHTML = `
      <p class="text-gray-400 text-sm">
        No goals yet...
      </p>
    `;
    return;
  }

  goals.forEach(goal => {
    const item = document.createElement("div");

    item.className = "border-b pb-4";

    item.innerHTML = `
      <div class="flex justify-between items-center mb-3">

        <div>
          <p class="font-semibold">${goal.name}</p>

          <p class="text-sm text-gray-500">
            Progress: ${goal.progress}% / ${goal.target}%
          </p>
        </div>

        <div class="flex gap-3">

          <button
            onclick="editGoal(${goal.id})"
            class="text-blue-500 hover:underline"
          >
            Edit
          </button>

          <button
            onclick="deleteGoal(${goal.id})"
            class="text-red-500 hover:underline"
          >
            Delete
          </button>

        </div>

      </div>

      <div class="flex items-center gap-3 mb-2">

        <input
          type="number"
          min="0"
          max="100"
          value="${goal.progress}"
          onchange="updateProgress(${goal.id}, this.value)"
          class="border rounded p-1 w-20"
        />

        <span class="text-sm text-gray-500">%</span>

      </div>

      <input
        type="range"
        min="0"
        max="100"
        value="${goal.progress}"
        onchange="updateProgress(${goal.id}, this.value)"
        class="w-full"
      >
    `;

    goalsList.appendChild(item);
  });
}

function updateProgress(id, value) {
  value = Number(value);

  if (value < 0) value = 0;
  if (value > 100) value = 100;

  goals = goals.map(goal => {
    if (goal.id === id) {
      return {
        ...goal,
        progress: value
      };
    }

    return goal;
  });

  saveGoals();
  renderGoals();
  updateStats();
}

function editGoal(id) {
  const goal = goals.find(goal => goal.id === id);

  const newName = prompt("Edit goal name:", goal.name);

  if (newName === null) {
    return;
  }

  const trimmedName = newName.trim();

  if (!trimmedName) {
    alert("Goal name cannot be empty");
    return;
  }

  const newTarget = prompt("Edit target percentage:", goal.target);

  if (newTarget === null) {
    return;
  }

  const targetNumber = Number(newTarget);

  if (isNaN(targetNumber) || targetNumber < 1 || targetNumber > 100) {
    alert("Target must be between 1 and 100");
    return;
  }

  goal.name = trimmedName;
  goal.target = targetNumber;

  saveGoals();
  renderGoals();
  updateStats();
}

function deleteGoal(id) {
  goals = goals.filter(goal => goal.id !== id);

  saveGoals();
  renderGoals();
  updateStats();
}

function updateStats() {
  totalGoalsEl.textContent = goals.length;

  const completed = goals.filter(
    goal => goal.progress >= goal.target
  ).length;

  completedGoalsEl.textContent = completed;

  const average =
    goals.length > 0
      ? Math.round(
          goals.reduce((sum, goal) => sum + goal.progress, 0) /
          goals.length
        )
      : 0;

  averageProgressEl.textContent = average + "%";
}

renderGoals();
updateStats();