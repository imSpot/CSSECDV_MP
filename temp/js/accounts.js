function initializeAccPage(route, formName) {
    const form = document.getElementById(formName);
    const passwordField = document.getElementById("password");
    const confirmPasswordField = document.getElementById("confirmPassword");
    const showPassword = document.getElementById("showPassword");    

    document.getElementById('showPassword').onclick = () => {
        if(passwordField.type === "password" && confirmPasswordField.type === "password") {
            passwordField.type = "text";
            confirmPasswordField.type = "text";
        } else {
            passwordField.type = "password";
            confirmPasswordField.type = "password";
        }
    }

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

        if((password === confirmPassword) == false) {
            alert('Passwords do not match.');
            return;
        }

        if(password.length <= 7) {
            alert('Password should be at least 8 characters long.');
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
                alert('User added successfully!');
                window.location.href = route;
            } else {
                const errorData = await response.json();
                alert(`Error adding user: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error adding user.');
        }
    });
}

module.exports = initializeAccPage;