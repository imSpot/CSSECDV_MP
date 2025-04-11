document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('change-password-form');
    const passwordField = document.getElementById("password");
    const confirmPasswordField = document.getElementById("confirmPassword");
    const newPasswordField = document.getElementById("newPassword");
    const showNewPassword = document.querySelector(".show-password .new");
    const showPassword = document.querySelector(".show-password .confirm");

    // document.getElementById('showPassword').onclick = () => {
    //     if(passwordField.type === "password" && confirmPasswordField.type === "password") {
    //         passwordField.type = "text";
    //         confirmPasswordField.type = "text";
    //     } else {
    //         passwordField.type = "password";
    //         confirmPasswordField.type = "password";
    //     }
    // }

    showPassword.addEventListener("click", function() {
        // if(passwordField.type === "password") {
        //     passwordField.type = "text";
        //     showPassword.classList.remove("fa-eye");
        //     showPassword.classList.add("fa-eye-slash");
        // } 
        
        if(confirmPasswordField.type === "password" && passwordField.type === "password") {
            passwordField.type = "text";
            confirmPasswordField.type = "text";
            showPassword.classList.remove("fa-eye");
            showPassword.classList.add("fa-eye-slash");
        } else {
            passwordField.type = "password";
            confirmPasswordField.type = "password";
            showPassword.classList.remove("fa-eye-slash");
            showPassword.classList.add("fa-eye");
        }
        // if clicked, change the color of the icon to #007bff,
        // and if clicked again, change it back to rgb(201, 14, 14)
        if(showPassword.style.color === "rgb(201, 14, 14)") {
            showPassword.style.color = "#333";
        } else {
            // showPassword.style.hover.color = "#007bff";
            showPassword.style.color = "rgb(201, 14, 14)";
        }
    });

    showNewPassword.addEventListener("click", function() {
        // if(passwordField.type === "password") {
        //     passwordField.type = "text";
        //     showPassword.classList.remove("fa-eye");
        //     showPassword.classList.add("fa-eye-slash");
        // }
        if(newPasswordField.type === "password") {
            newPasswordField.type = "text";
            showNewPassword.classList.remove("fa-eye");
            showNewPassword.classList.add("fa-eye-slash");
        } else {
            newPasswordField.type = "password";
            showNewPassword.classList.remove("fa-eye-slash");
            showNewPassword.classList.add("fa-eye");
        }
        // if clicked, change the color of the icon to #007bff,
        // and if clicked again, change it back to rgb(201, 14, 14)
        if(showNewPassword.style.color === "rgb(201, 14, 14)") {
            showNewPassword.style.color = "#333";
        } else {
            // showPassword.style.hover.color = "#007bff";
            showNewPassword.style.color = "rgb(201, 14, 14)";
        }
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission
        passwordField.type = "password";
        confirmPasswordField.type = "password";
        newPasswordField.type = "password";

        if(showPassword.checked) {
            showPassword.checked = !showPassword.checked;
        }

        if(showNewPassword.checked) {
            showNewPassword.checked = !showNewPassword.checked;
        }

        const formData = new FormData(form);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Input validation
        const emailAddress = data.email.trim();
        const password = data.password.trim();
        const confirmPassword = data.confirmPassword.trim();
        const newPassword = data.newPassword.trim();

        if(emailAddress.length > 37) {
            alert('Email address should not exceed 37 characters.');
            return;
        }

        if((password === confirmPassword) == false) {
            alert('Passwords do not match.');
            return;
        }

        if(newPassword.length < 8) {
            alert('New password should be at least 8 characters long.');
            return;
        }

        if(newPassword.length > 60) {
            alert('New password should not exceed 60 characters.');
            return;
        }

        if(!newPassword.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)) {
            alert('New password needs at least one uppercase letter, one lowercase letter, one number, and one special character.');
            return;
        }

        $.get('/validate-user', { email : emailAddress, password: password}).then(async res => {
            if(res.exists) {
                try {
                    const response = await fetch(form.action, {
                        method: form.method,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        
                        body: JSON.stringify(data),
                    });
                    console.log(JSON.stringify(data));
                    if(response.ok) {
                        alert('Password changed successfully! Please log in again.');
                        window.location.href = '/login';
                    } else {
                        const errorData = await response.json();
                        alert(`Error: ${errorData.message}`);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert(`Error: ${errorData.message}`);
                }
            } else {
                alert('Error: Incorrect input/s. Please try again.');
                return;
            }
        });
    });
})