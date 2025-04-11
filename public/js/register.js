document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addAccountForm');
    const passwordField = document.getElementById("password");
    const confirmPasswordField = document.getElementById("confirmPassword");
    const recoveryAnswerField = document.getElementById("recoveryAnswer");
    const showPassword = document.querySelector(".show-password i");
    const showRecoveryAnswer = document.querySelector(".show-password .recovery");

    loginBtn.addEventListener("click", () => {
        window.location.href = "login";
    });

    showPassword.addEventListener("click", function() {
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
        if (showPassword.style.color === "rgb(201, 14, 14)") {
            showPassword.style.color = "#333";
        } else {
            showPassword.style.color = "rgb(201, 14, 14)";
        }
    });

    showRecoveryAnswer.addEventListener("click", function() {
        if(recoveryAnswerField.type === "password") {
            recoveryAnswerField.type = "text";
            showRecoveryAnswer.classList.remove("fa-eye");
            showRecoveryAnswer.classList.add("fa-eye-slash");
        } else {
            recoveryAnswerField.type = "password";
            showRecoveryAnswer.classList.remove("fa-eye-slash");
            showRecoveryAnswer.classList.add("fa-eye");
        }
        if(showRecoveryAnswer.style.color === "rgb(201, 14, 14)") {
            showRecoveryAnswer.style.color = "#333";
        } else {
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
        const firstName = data.firstName.trim();
        const lastName = data.lastName.trim();
        const emailAddress = data.emailAddress.trim();
        const password = data.password.trim();
        const confirmPassword = data.confirmPassword.trim();
        const recoveryAnswer = data.recoveryAnswer.trim();

        if(!firstName.match(/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/)) {
            alert('First name should only contain characters and spaces.');
            $.post('/log-activity', {
                userId: '',
                status: 'FAIL',
                action: 'Register',
                details: '[First Name Complexity Not Met] Email: ' + emailAddress,
                role: ''
            });
            return;
        }

        if(!lastName.match(/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/)) {
            alert('Last name should only contain characters and spaces.');
            $.post('/log-activity', {
                userId: '',
                status: 'FAIL',
                action: 'Register',
                details: '[Last Name Complexity Not Met] Email: ' + emailAddress,
                role: ''
            });
            return;
        }

        if(emailAddress.length == 0) {
            alert('Please enter an email address.');
            $.post('/log-activity', {
                userId: '',
                status: 'FAIL',
                action: 'Register',
                details: '[Provided No Email]',
                role: ''
            });
            return;
        }

        if(emailAddress.length > 37) {
            alert('Email address should not exceed 37 characters.');
            $.post('/log-activity', {
                userId: '',
                status: 'FAIL',
                action: 'Register',
                details: '[Invalid Email Length] Email: ' + emailAddress,
                role: ''
            });
            return;
        }

        if (!emailAddress.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            alert('Please enter a valid email address.');
            $.post('/log-activity', {
                userId: '',
                status: 'FAIL',
                action: 'Register',
                details: '[Invalid Email Structure] Email: ' + emailAddress,
                role: ''
            });
            return;
        }

        if(firstName.length < 2) {
            alert('First name should contain at least two characters.');
            $.post('/log-activity', {
                userId: '',
                status: 'FAIL',
                action: 'Register',
                details: '[First Name Length Not Met] Email: ' + emailAddress,
                role: ''
            });
            return;
        }

        if(firstName.length > 30) {
            alert('First name should not exceed 30 characters.');
            $.post('/log-activity', {
                userId: '',
                status: 'FAIL',
                action: 'Register',
                details: '[First Name Length Exceeded] Email: ' + emailAddress,
                role: ''
            });
            return;
        }

        if(lastName.length < 2) {
            alert('Last name should contain at least two characters.');
            $.post('/log-activity', {
                userId: '',
                status: 'FAIL',
                action: 'Register',
                details: '[Last Name Length Not Met] Email: ' + emailAddress,
                role: ''
            });
            return;
        }

        if(lastName.length > 30) {
            alert('Last name should not exceed 30 characters.');
            $.post('/log-activity', {
                userId: '',
                status: 'FAIL',
                action: 'Register',
                details: '[Last Name Length Exceeded] Email: ' + emailAddress,
                role: ''
            });
            return;
        }

        if((password === confirmPassword) == false) {
            alert('Passwords do not match.');
            $.post('/log-activity', {
                userId: '',
                status: 'FAIL',
                action: 'Register',
                details: '[Passwords Do Not Match] Email: ' + emailAddress,
                role: ''
            });
            return;
        }

        if(password.length < 8) {
            alert('Password should be at least 8 characters long.');
            $.post('/log-activity', {
                userId: '',
                status: 'FAIL',
                action: 'Register',
                details: '[Password Length Not Met] Email: ' + emailAddress,
                role: ''
            });
            return;
        }

        if(password.length > 60) {
            alert('Password should not exceed 60 characters.');
            $.post('/log-activity', {
                userId: '',
                status: 'FAIL',
                action: 'Register',
                details: '[Password Length Exceeded] Email: ' + emailAddress,
                role: ''
            });
            return;
        }

        if(!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)) {
            alert('Password needs at least one uppercase letter, one lowercase letter, one number, and one special character.');
            $.post('/log-activity', {
                userId: '',
                status: 'FAIL',
                action: 'Register',
                details: '[Password Complexity Not Met] Email: ' + emailAddress,
                role: ''
            });
            return;
        }

        if(recoveryAnswer.length < 8) {
            alert('Recovery answer should be at least 8 characters long.');
            $.post('/log-activity', {
                userId: '',
                status: 'FAIL',
                action: 'Register',
                details: '[Recovery Answer Length Not Met] Email: ' + emailAddress,
                role: ''
            });
            return;
        }

        if(recoveryAnswer.length > 30) {
            alert('Recovery answer should not exceed 30 characters.');
            $.post('/log-activity', {
                userId: '',
                status: 'FAIL',
                action: 'Register',
                details: '[Recovery Answer Length Exceeded] Email: ' + emailAddress,
                role: ''
            });
            return;
        }

        $.get('/check-user', { email : emailAddress }).then(async res => {
            if(res.exists) {
                alert('Email already exists. Use a different email.');
                return;
            } else {
                try {
                    const response = await fetch('/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    });
        
                    if(response.ok) {
                        alert('User added successfully!');
                        window.location.href = '/login';
                    } else {
                        const errorData = await response.json();
                        alert(`Error adding user: ${errorData.message}`);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Error adding user.');
                }
            }
        });
    });

    /*const initializeAccPage = require('./initializeAccPage');
    initializeAccPage('/login', 'addAccountForm');

    loginBtn.addEventListener('click', () => {
        window.location.href = '/login';
    });*/
});