/**
 * ================================
 * Auth Module - Registration & Login
 * ================================
 * 
 * This script handles user authentication for a local browser-based to-do list app.
 * It supports user registration and login without any server.
 * 
 * All user data is stored in localStorage:
 * - Registered users are saved as an array under the key "users"
 * - The currently logged-in user is stored under "loggedInUser"
 * 
 * Main features:
 * - User registration with duplicate username check
 * - User login with username + password validation
 * - Redirects on successful login or registration
 * 
 * Security Note:
 * This is for local/offline use only. Passwords are stored in plain text in the browser.
 * Never use this approach for real authentication in production environments.
 */

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");

    if (registerForm) registerForm.addEventListener("submit", handleRegister);
    if (loginForm) loginForm.addEventListener("submit", handleLogin);
});


function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const validUser = users.find(user => user.username === username && user.password === password);

    if (validUser) {
        localStorage.setItem("loggedInUser", JSON.stringify(validUser));
        alert("Login successful!");
        window.location.href = "index.html";
    } else {
        alert("Invalid username or password.");
    }
}

function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        alert("Please fill in all fields.");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const userExists = users.some(user => user.username === username);
    if (userExists) {
        alert("Username already exists. Please choose another one.");
        return;
    }

    const newUser = { username, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration successful! You can now log in.");
    window.location.href = "login.html";
}
