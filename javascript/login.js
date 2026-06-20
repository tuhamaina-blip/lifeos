const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", function () {

  const input = loginUsername.value.trim();
  const password = loginPassword.value;

  if (!input || !password) {
    alert("Please fill in all fields.");
    return;
  }

  const savedUser = JSON.parse(localStorage.getItem("lifeosUser"));

  if (!savedUser) {
    alert("No account found. Please sign up first.");
    return;
  }

  const isMatch =
    (input === savedUser.username || input === savedUser.email) &&
    password === savedUser.password;

  if (!isMatch) {
    alert("Invalid login details.");
    return;
  }

  localStorage.setItem("lifeosLoggedIn", JSON.stringify({
    username: savedUser.username,
    email: savedUser.email
  }));

  alert("Login successful.");

  window.location.href = "index.html";

});