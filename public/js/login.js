const emailField = document.getElementById("email-field");
const passwordField = document.getElementById("password-field");
const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const forgotPasswordBtn = document.getElementById("forgot-password-btn");
const showPassword = document.querySelector(".show-password i");
let errorBox = null;
let errorTimeout;

showPassword.addEventListener("click", function () {
    if (passwordField.type === "password") {
        passwordField.type = "text";
        showPassword.classList.remove("fa-eye");
        showPassword.classList.add("fa-eye-slash");
    } else {
        passwordField.type = "password";
        showPassword.classList.remove("fa-eye-slash");
        showPassword.classList.add("fa-eye");
    }
    if (showPassword.style.color === "rgb(201, 14, 14)") {
        showPassword.style.color = "#007bff";
    } else {
        showPassword.style.color = "rgb(201, 14, 14)";
    }
});

function displayLoginError(errorMessage) {
    if (!errorBox) {
        errorBox = document.createElement("div");
        errorBox.style.backgroundColor = "#f8d7da";
        errorBox.style.color = "#721c24";
        errorBox.style.padding = "10px";
        errorBox.style.border = "1px solid #f5c6cb";
        errorBox.style.borderRadius = "5px";
        errorBox.style.marginTop = "10px";
        const loginFormContainer = document.getElementById("login-form-container");
        loginFormContainer.appendChild(errorBox);
    }
    errorBox.textContent = errorMessage;
    errorBox.classList.add("shake");
    setTimeout(() => {
        errorBox.classList.remove("shake");
    }, 500);

    clearTimeout(errorTimeout);
    errorTimeout = setTimeout(() => {
        if (errorBox) {
            errorBox.remove();
            errorBox = null;
        }
    }, 3000);
}

loginBtn.addEventListener("click", (event) => {
    event.preventDefault();

    const email = emailField.value;
    const password = passwordField.value;

    if (passwordField.type === "text") {
        passwordField.type = "password";
    }

    fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                if (data.isAdmin) {
                    window.location.href = "/admin";
                } else {
                    window.location.href = "/";
                }
                if (errorBox) {
                    clearTimeout(errorTimeout);
                    errorBox.remove();
                    errorBox = null;
                }
            } else {
                displayLoginError(data.message || "Invalid username and/or password.");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            displayLoginError("Invalid username and/or password.");
        });
});

registerBtn.addEventListener("click", () => {
    window.location.href = "register";
});

forgotPasswordBtn.addEventListener("click", () => {
    window.location.href = "recovery";
});