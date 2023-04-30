import { baseUrl } from "./setup.js";
let form = document.getElementById('register-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault()
    if (document.getElementById('register-warning-message')){
        document.getElementById('register-warning-message').remove()
    }
    if ( document.getElementById('success-response-message')){
        document.getElementById('success-response-message').remove();
    }

    let name = document.getElementById('register-name');
    let email = document.getElementById('register-email');
    let password = document.getElementById('register-password');
    let confirmPassword = document.getElementById('register-confirm-password');

    if (password.value !== confirmPassword.value){
        let parent = document.getElementById('register-confirm-div');
        let warning = document.createElement('div');
        warning.className = 'd-flex flex-row align-items-center mb-4"';
        warning.id = 'register-warning-message';
        let icons = document.createElement('i');
        icons.className = 'fas fa-key fa-lg me-3 fa-fw';
        let innerDiv = document.createElement('div');
        innerDiv.className = 'form-outline flex-fill mb-0';
        let p = document.createElement('p');
        p.innerText = 'Your confirmation password does not match your password. Please enter your confirmation password correctly.';
        p.className = 'alert alert-warning form-control';
        innerDiv.appendChild(p);
        warning.appendChild(icons);
        warning.appendChild(innerDiv);

        form.insertBefore(warning, parent.nextSibling);

    } else {
        let data = {
            'name': name.value,
            'email': email.value,
            'password': password.value,
        }
        let url = baseUrl + 'api/user/';
        await $.ajax({
            url: url,  
            type: 'POST',
            dataType: 'json',
            data: data,

            success: function(response) {
                let message = response.message;
                let createWarning = document.createElement('p');
                createWarning.className = 'form-control alert alert-success mt-5';
                createWarning.innerText = message + '\nYou will be redirected to the login page in 3 seconds!';
                createWarning.id = 'success-response-message'
                form.parentElement.insertBefore(createWarning, form.parentElement.firstChild);
                name.value = '';
                email.value = '';
                password.value = '';
                confirmPassword.value = '';
                setTimeout(function() {
                    window.location.href = baseUrl + 'login/';
                }, 3000);
            },
            error: function(jqXHR) {
                let parent = document.getElementById('register-confirm-div');
                let warning = document.createElement('div');
                warning.className = 'd-flex flex-row align-items-center mb-4"';
                warning.id = 'register-warning-message';
                let icons = document.createElement('i');
                icons.className = 'fas fa-key fa-lg me-3 fa-fw';
                let innerDiv = document.createElement('div');
                innerDiv.className = 'form-outline flex-fill mb-0';
                let p = document.createElement('p');
                p.innerText = Object.values(jqXHR.responseJSON)[0][0];
                p.className = 'alert alert-warning form-control';
                innerDiv.appendChild(p);
                warning.appendChild(icons);
                warning.appendChild(innerDiv);
                form.insertBefore(warning, parent.nextSibling);
            }
        });
    }
})
