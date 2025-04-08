document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('editAccountForm');
    const passwordField = document.getElementById("password");
    const confirmPasswordField = document.getElementById("confirmPassword");
    //const showPassword = document.getElementById("showPassword");
    const showPassword = document.querySelector(".show-password i");

    /*document.getElementById('showPassword').onclick = () => {
        if(passwordField.type === "password" && confirmPasswordField.type === "password") {
            passwordField.type = "text";
            confirmPasswordField.type = "text";
        } else {
            passwordField.type = "password";
            confirmPasswordField.type = "password";
        }
    }*/

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

        if(!firstName.match(/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/)) {
            alert('First name should only contain characters and spaces.');
            return;
        }

        if(!lastName.match(/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/)) {
            alert('Last name should only contain characters and spaces.');
            return;
        }

        if(emailAddress.length > 37) {
            alert('Email address should not exceed 37 characters.');
            return;
        }

        if(firstName.length < 2) {
            alert('First name should contain at least two characters.');
            return;
        }

        if(firstName.length > 30) {
            alert('First name should not exceed 30 characters.');
            return;
        }

        if(lastName.length < 2) {
            alert('Last name should contain at least two characters.');
            return;
        }

        if(lastName.length > 30) {
            alert('Last name should not exceed 30 characters.');
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

        try {
            const response = await fetch(form.action, {
                method: form.method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if(response.ok) {
                alert('User updated successfully!');
                window.location.href = '/admin';
            } else {
                const errorData = await response.json();
                alert(`Error updating user: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error updating user.');
        }
    });

    /*const initializeAccPage = require('./initializeAccPage');
    initializeAccPage('/admin', 'editAccountForm');*/
});