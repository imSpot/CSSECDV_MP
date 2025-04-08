const firstNameField = document.getElementById("first-name");
const lastNameField = document.getElementById("last-name");
const emailField = document.getElementById("email-field");
const passwordField = document.getElementById("password-field");
const confirmPasswordField = document.getElementById("confirm-password-field");
const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");

registerBtn.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent page from refreshing
    
    const firstName = firstNameField.value;
    const lastName = lastNameField.value;
    const email = emailField.value;
    const password = passwordField.value;
    const confirmPassword = confirmPasswordField.value;

    if(password === confirmPassword) {
        // AJAX POST request for logging in
        $.ajax({
            url: "/login",
            type: "POST",
            data: { firstName: firstName, lastName: lastName, email: email, password: password },
            success: (data, status) => {
                if (status === "success") {
                    if (data.success) {
                        window.location.href = "/";
                    } else {
                        alert(data.message);
                    }    
                } else {
                    alert("Error occurred while processing the request.");
                }
            },
            error: () => {
                alert("Error occurred while processing the request.");
            }
        });
    } else {
        alert("Passwords do not match.");
    }
});

loginBtn.addEventListener("click", () => {
    window.location.href = "login";
});