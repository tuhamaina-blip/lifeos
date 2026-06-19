const totalExpensesEl = document.getElementById("totalExpenses");
const tasksDoneEl = document.getElementById("tasksDone");
const habitsDoneEl = document.getElementById("habitsDone");

function loadDashboard() {

  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const habits = JSON.parse(localStorage.getItem("habits")) || [];

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount, 0
  );

  const completedTasks = tasks.filter(
    task => task.completed
  ).length;

  const completedHabits = habits.filter(
    habit => habit.completed
  ).length;

  totalExpensesEl.textContent = `KSh ${totalExpenses}`;
  tasksDoneEl.textContent = completedTasks;
  habitsDoneEl.textContent = completedHabits;
}

loadDashboard();