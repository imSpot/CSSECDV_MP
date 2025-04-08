const emailField = document.getElementById("email-field");
const passwordField = document.getElementById("password-field");
const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const showPassword = document.querySelector(".show-password i");

showPassword.addEventListener("click", function() {
    if(passwordField.type === "password") {
        passwordField.type = "text";
        showPassword.classList.remove("fa-eye");
        showPassword.classList.add("fa-eye-slash");
    } else {
        passwordField.type = "password";
        showPassword.classList.remove("fa-eye-slash");
        showPassword.classList.add("fa-eye");
    }
    // if clicked, change the color of the icon to #007bff, and if clicked again, change it back to rgb(201, 14, 14)
    if(showPassword.style.color === "rgb(201, 14, 14)") {
        showPassword.style.color = "#007bff";
    } else {
        showPassword.style.color = "rgb(201, 14, 14)";
    }
});

loginBtn.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent page from refreshing

    const email = emailField.value;
    const password = passwordField.value;

    if(passwordField.type === "text") {
        passwordField.type = "password";
    }
    
    // AJAX POST request for logging in
    /*$.post("/login", {email: email, password: password}, (res) => {
        console.log('sheesh');
        if(res.success) {
            if(res.isAdmin) {
                window.location.href = "/admin";
            } else {
                window.location.href = "/";
            }
        } else {
            alert("Invalid email or password");
        }
    })*/
    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => {
        /*console.log(data);
        console.log(data.success)*/
        if(data.success) { // Alert and render main page
            alert('Login successful!');
            if(data.isAdmin) {
                window.location.href = '/admin';
            } else {
                window.location.href = '/' ;
            }
        } else {
            alert('Invalid username or password.');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Invalid username or password.');
    });
});

registerBtn.addEventListener("click", () => {
    window.location.href = "register";
});