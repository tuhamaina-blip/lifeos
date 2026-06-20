let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

const expenseName = document.getElementById("expenseName");
const expenseAmount = document.getElementById("expenseAmount");
const expenseCategory = document.getElementById("expenseCategory");
const addExpenseBtn = document.getElementById("addExpenseBtn");

const expenseList = document.getElementById("expenseList");

const totalSpentEl = document.getElementById("totalSpent");
const highestCategoryEl = document.getElementById("highestCategory");
const transactionCountEl = document.getElementById("transactionCount");

function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

addExpenseBtn.addEventListener("click", function () {

  const name = expenseName.value.trim();
  const amount = Number(expenseAmount.value);
  const category = expenseCategory.value;

  if (!name || isNaN(amount) || amount <= 0) {
    alert("Please enter valid expense details");
    return;
  }

  const expense = {
    id: Date.now(),
    name,
    amount,
    category
  };

  expenses.push(expense);

  expenseName.value = "";
  expenseAmount.value = "";

  saveExpenses();
  renderExpenses();
  updateStats();

});

function renderExpenses() {

  expenseList.innerHTML = "";

  if (expenses.length === 0) {
    expenseList.innerHTML = `<p class="text-gray-400 text-sm">No expenses yet...</p>`;
    return;
  }

  expenses.forEach(exp => {

    const item = document.createElement("div");

    item.className = "flex justify-between items-center border p-3 rounded-xl";

    item.innerHTML = `

      <div>
        <p class="font-semibold">${exp.name}</p>
        <p class="text-sm text-gray-500">${exp.category}</p>
      </div>

      <div class="flex items-center gap-4">

        <p class="font-bold text-orange-500">${exp.amount}</p>

        <button onclick="editExpense(${exp.id})" class="text-blue-500 hover:underline">
          Edit
        </button>

        <button onclick="deleteExpense(${exp.id})" class="text-red-500 hover:underline">
          Delete
        </button>

      </div>

    `;

    expenseList.appendChild(item);

  });

}

// SIMPLE EDIT (same style as your Goals page)
function editExpense(id) {

  const exp = expenses.find(e => e.id === id);

  const newName = prompt("Edit expense name:", exp.name);
  if (newName === null) return;

  const trimmedName = newName.trim();
  if (!trimmedName) {
    alert("Expense name cannot be empty");
    return;
  }

  const newAmount = prompt("Edit amount:", exp.amount);
  if (newAmount === null) return;

  const amountNumber = Number(newAmount);
  if (isNaN(amountNumber) || amountNumber <= 0) {
    alert("Enter a valid amount");
    return;
  }

  const newCategory = prompt(
    "Edit category (Food, Transport, School, Entertainment, Other):",
    exp.category
  );

  if (newCategory === null) return;

  const validCategories = ["Food", "Transport", "School", "Entertainment", "Other"];

  if (!validCategories.includes(newCategory)) {
    alert("Invalid category");
    return;
  }

  exp.name = trimmedName;
  exp.amount = amountNumber;
  exp.category = newCategory;

  saveExpenses();
  renderExpenses();
  updateStats();

}

function deleteExpense(id) {

  expenses = expenses.filter(exp => exp.id !== id);

  saveExpenses();
  renderExpenses();
  updateStats();

}

function updateStats() {

  transactionCountEl.textContent = expenses.length;

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  totalSpentEl.textContent = total;

  const categoryTotals = {};

  expenses.forEach(exp => {
    categoryTotals[exp.category] =
      (categoryTotals[exp.category] || 0) + exp.amount;
  });

  let highest = "-";
  let max = 0;

  for (let cat in categoryTotals) {
    if (categoryTotals[cat] > max) {
      max = categoryTotals[cat];
      highest = cat;
    }
  }

  highestCategoryEl.textContent = highest;

}

renderExpenses();
updateStats();