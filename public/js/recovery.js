document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('recovery-form');
    const passwordField = document.getElementById("password");
    const confirmPasswordField = document.getElementById("confirmPassword");
    const recoveryAnswerField = document.getElementById("recoveryAnswer");
    const loginBtn = document.getElementById("login-btn");
    const showRecoveryAnswer = document.querySelector(".show-password .recovery");
    const showPassword = document.querySelector(".show-password .confirm");

    loginBtn.addEventListener("click", () => {
        window.location.href = "login";
    });

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

    showRecoveryAnswer.addEventListener("click", function() {
        // if(passwordField.type === "password") {
        //     passwordField.type = "text";
        //     showPassword.classList.remove("fa-eye");
        //     showPassword.classList.add("fa-eye-slash");
        // }
        if(recoveryAnswerField.type === "password") {
            recoveryAnswerField.type = "text";
            showRecoveryAnswer.classList.remove("fa-eye");
            showRecoveryAnswer.classList.add("fa-eye-slash");
        } else {
            recoveryAnswerField.type = "password";
            showRecoveryAnswer.classList.remove("fa-eye-slash");
            showRecoveryAnswer.classList.add("fa-eye");
        }
        // if clicked, change the color of the icon to #007bff,
        // and if clicked again, change it back to rgb(201, 14, 14)
        if(showRecoveryAnswer.style.color === "rgb(201, 14, 14)") {
            showRecoveryAnswer.style.color = "#333";
        } else {
            // showPassword.style.hover.color = "#007bff";
            showRecoveryAnswer.style.color = "rgb(201, 14, 14)";
        }
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission
        passwordField.type = "password";
        confirmPasswordField.type = "password";

        if(showPassword.checked) {
            showPassword.checked = !showPassword.checked;
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
        const recoveryAnswer = data.recoveryAnswer.trim();
        const recoveryQuestion = data.recoveryQuestion.trim();

        if(emailAddress.length > 37) {
            alert('Email address should not exceed 37 characters.');
            return;
        }

        if((password === confirmPassword) == false) {
            alert('Passwords do not match.');
            return;
        }

        if(password.length < 8) {
            alert('Password should be at least 8 characters long.');
            return;
        }

        if(password.length > 60) {
            alert('Password should not exceed 60 characters.');
            return;
        }

        if(recoveryAnswer.length < 8) {
            alert('Recovery answer should be at least 8 characters long.');
            return;
        }

        if(recoveryAnswer.length > 30) {
            alert('Recovery answer should not exceed 30 characters.');
            return;
        }

        $.get('/validate-recovery-info', { email : emailAddress, password: password, securityQuestionID: recoveryQuestion, securityQuestionAnswer: recoveryAnswer}).then(async res => {
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
                        alert('Password recovered successfully!');
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