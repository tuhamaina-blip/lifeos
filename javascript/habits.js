let habits = JSON.parse(localStorage.getItem("habits")) || [];

const habitName = document.getElementById("habitName");
const addHabitBtn = document.getElementById("addHabitBtn");
const habitList = document.getElementById("habitList");

const totalHabitsEl = document.getElementById("totalHabits");
const completedHabitsEl = document.getElementById("completedHabits");
const longestStreakEl = document.getElementById("longestStreak");

// TODAY STRING 
function getToday() {
  return new Date().toISOString().split("T")[0];
}

// SAVE
function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

function normalizeHabits() {
  habits = habits.map(h => ({
    id: h.id,
    name: h.name,
    streak: h.streak || 0,
    lastCompleted: h.lastCompleted || null,
    completedToday: h.lastCompleted === getToday()
  }));
}

normalizeHabits();

// ADD HABIT
addHabitBtn.addEventListener("click", function () {

  const name = habitName.value.trim();

  if (!name) {
    alert("Please enter a habit name");
    return;
  }

  const habit = {
    id: Date.now(),
    name,
    streak: 0,
    lastCompleted: null,
    completedToday: false
  };

  habits.push(habit);

  habitName.value = "";

  saveHabits();
  renderHabits();
  updateStats();

});

// RENDER
function renderHabits() {

  const today = getToday();

  habitList.innerHTML = "";

  if (habits.length === 0) {
    habitList.innerHTML = `<p class="text-gray-400 text-sm">No habits yet...</p>`;
    return;
  }

  habits.forEach(habit => {

    const completedToday = habit.lastCompleted === today;

    const item = document.createElement("div");

    item.className = "flex justify-between items-center border p-3 rounded-xl";

    item.innerHTML = `

      <div>
        <p class="font-semibold ${completedToday ? 'text-green-600' : ''}">
          ${habit.name}
        </p>

        <p class="text-sm text-gray-500">
          Streak: ${habit.streak} ${completedToday ? "(Done Today)" : ""}
        </p>
      </div>

      <div class="flex gap-3">

        <button onclick="toggleHabit(${habit.id})" class="text-green-500 hover:underline">
          ${completedToday ? "Undo" : "Done"}
        </button>

        <button onclick="editHabit(${habit.id})" class="text-blue-500 hover:underline">
          Edit
        </button>

        <button onclick="deleteHabit(${habit.id})" class="text-red-500 hover:underline">
          Delete
        </button>

      </div>

    `;

    habitList.appendChild(item);

  });

}

// TOGGLE HABIT 
function toggleHabit(id) {

  const today = getToday();

  habits = habits.map(habit => {

    if (habit.id !== id) return habit;

    const wasCompletedToday = habit.lastCompleted === today;

    if (wasCompletedToday) {
      // UNDO (same day)
      return {
        ...habit,
        lastCompleted: null,
        completedToday: false,
        streak: Math.max(0, habit.streak - 1)
      };
    }

    // FIRST TIME TODAY OR NEW DAY
    let newStreak = habit.streak;

    if (habit.lastCompleted !== today) {
      newStreak += 1;
    }

    return {
      ...habit,
      lastCompleted: today,
      completedToday: true,
      streak: newStreak
    };

  });

  saveHabits();
  renderHabits();
  updateStats();

}

// EDIT (simple prompt style)
function editHabit(id) {

  const habit = habits.find(h => h.id === id);

  const newName = prompt("Edit habit name:", habit.name);

  if (newName === null) return;

  const trimmed = newName.trim();

  if (!trimmed) {
    alert("Habit name cannot be empty");
    return;
  }

  habit.name = trimmed;

  saveHabits();
  renderHabits();
  updateStats();

}

// DELETE
function deleteHabit(id) {

  habits = habits.filter(habit => habit.id !== id);

  saveHabits();
  renderHabits();
  updateStats();

}

// STATS
function updateStats() {

  const today = getToday();

  totalHabitsEl.textContent = habits.length;

  const completedToday = habits.filter(
    h => h.lastCompleted === today
  ).length;

  completedHabitsEl.textContent = completedToday;

  const longest = habits.length > 0
    ? Math.max(...habits.map(h => h.streak))
    : 0;

  longestStreakEl.textContent = longest;

}

// AUTO DAILY RESET CHECK
setInterval(() => {
  renderHabits();
  updateStats();
}, 60000);

renderHabits();
updateStats();