const habitName = document.getElementById("habitName");
const addHabitBtn = document.getElementById("addHabitBtn");
const habitList = document.getElementById("habitList");

const totalHabitsEl = document.getElementById("totalHabits");
const completedHabitsEl = document.getElementById("completedHabits");
const longestStreakEl = document.getElementById("longestStreak");

let habits = JSON.parse(localStorage.getItem("habits")) || [];

function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

function renderHabits() {
  habitList.innerHTML = "";

  if (habits.length === 0) {
    habitList.innerHTML = `<p class="text-gray-400 text-sm">No habits yet...</p>`;
    return;
  }

  habits.forEach(habit => {
    const item = document.createElement("div");

    item.className = "flex justify-between items-center border-b pb-2";

    item.innerHTML = `
      <div>
        <p class="font-semibold ${habit.completed ? 'line-through text-gray-400' : ''}">
          ${habit.name}
        </p>

        <p class="text-sm text-gray-500">
          Streak: ${habit.streak}
        </p>
      </div>

      <div class="flex gap-3">

        <button onclick="toggleHabit(${habit.id})"
          class="text-green-500 hover:underline">
          ${habit.completed ? "Undo" : "Done"}
        </button>

        <button onclick="deleteHabit(${habit.id})"
          class="text-red-500 hover:underline">
          Delete
        </button>

      </div>
    `;

    habitList.appendChild(item);
  });
}

function updateStats() {
  totalHabitsEl.textContent = habits.length;

  const completed = habits.filter(habit => habit.completed).length;
  completedHabitsEl.textContent = completed;

  const longestStreak =
    habits.length > 0
      ? Math.max(...habits.map(habit => habit.streak))
      : 0;

  longestStreakEl.textContent = longestStreak;
}

function toggleHabit(id) {
  habits = habits.map(habit => {
    if (habit.id === id) {

      if (!habit.completed) {
        return {
          ...habit,
          completed: true,
          streak: habit.streak + 1
        };
      }

      return {
        ...habit,
        completed: false,
        streak: Math.max(0, habit.streak - 1)
      };
    }

    return habit;
  });

  saveHabits();
  renderHabits();
  updateStats();
}

function deleteHabit(id) {
  habits = habits.filter(habit => habit.id !== id);

  saveHabits();
  renderHabits();
  updateStats();
}

addHabitBtn.addEventListener("click", function () {
  const name = habitName.value.trim();

  if (!name) {
    alert("Please enter a habit name");
    return;
  }

  const habit = {
    id: Date.now(),
    name: name,
    completed: false,
    streak: 0
  };

  habits.push(habit);

  habitName.value = "";

  saveHabits();
  renderHabits();
  updateStats();
});

renderHabits();
updateStats();