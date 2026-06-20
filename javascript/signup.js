const signupUsername = document.getElementById("signupUsername");
const signupEmail = document.getElementById("signupEmail");
const signupPassword = document.getElementById("signupPassword");
const confirmPassword = document.getElementById("confirmPassword");
const signupBtn = document.getElementById("signupBtn");

signupBtn.addEventListener("click", function () {

  const username = signupUsername.value.trim();
  const email = signupEmail.value.trim();
  const password = signupPassword.value;
  const confirm = confirmPassword.value;

  if (!username || !email || !password || !confirm) {
    alert("Please fill in all fields.");
    return;
  }

  if (!email.includes("@")) {
    alert("Please enter a valid email.");
    return;
  }

  if (password !== confirm) {
    alert("Passwords do not match.");
    return;
  }

  const user = {
    username,
    email,
    password
  };

localStorage.setItem("lifeosUser", JSON.stringify(user));

localStorage.setItem("lifeosLoggedIn", JSON.stringify({
  username,
  email
}));

alert("Account created successfully.");

window.location.href = "index.html";
});