const expenseList = document.getElementById("expenseList");
const expenseName = document.getElementById("expenseName");
const expenseAmount = document.getElementById("expenseAmount");
const expenseCategory = document.getElementById("expenseCategory");
const addExpenseBtn = document.getElementById("addExpenseBtn");

let expenses = [];

function renderExpenses() {
  expenseList.innerHTML = "";

  if (expenses.length === 0) {
    expenseList.innerHTML = `<p class="text-gray-400 text-sm">No expenses yet...</p>`;
    return;
  }

  expenses.forEach(exp => {
    const item = document.createElement("div");

    item.className = "flex justify-between items-center border-b pb-2";

    item.innerHTML = `
      <div>
        <p class="font-semibold">${exp.name}</p>
        <p class="text-sm text-gray-500">${exp.category}</p>
      </div>

      <div class="text-right flex items-center gap-3">
        <p class="font-bold text-orange-500">Ksh ${exp.amount}</p>

        <button 
          class="text-red-500 text-sm hover:underline"
          onclick="deleteExpense(${exp.id})">Delete
        </button>
      </div>`;

    expenseList.appendChild(item);
  });
}

addExpenseBtn.addEventListener("click", function () {
  const name = expenseName.value;
  const amount = expenseAmount.value;
  const category = expenseCategory.value;

  if (!name || !amount) {
    alert("Please fill in all fields");
    return;
  }

  const expense = {
    id: Date.now(),
    name,
    amount: Number(amount),
    category
  };

  expenses.push(expense);

  expenseName.value = "";
  expenseAmount.value = "";

  renderExpenses();
  updateTotal();
  updateHighestCategory();
});

function deleteExpense(id) {
  expenses = expenses.filter(exp => exp.id !== id);
  renderExpenses();
  updateTotal();
  updateHighestCategory();
}

function updateTotal() {
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  document.getElementById("totalSpent").textContent = total;
}

function updateHighestCategory() {
  if (expenses.length === 0) {
    document.getElementById("highestCategory").textContent = "-";
    return;
  }

  const categoryTotals = {};

  expenses.forEach(exp => {
    if (!categoryTotals[exp.category]) {
      categoryTotals[exp.category] = 0;
    }

    categoryTotals[exp.category] += exp.amount;
  });

  let highest = "";
  let max = 0;

  for (let cat in categoryTotals) {
    if (categoryTotals[cat] > max) {
      max = categoryTotals[cat];
      highest = cat;
    }
  }

  document.getElementById("highestCategory").textContent = highest;
}