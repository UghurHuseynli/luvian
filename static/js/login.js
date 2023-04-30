import { baseUrl } from "./setup.js";

let form = document.getElementById('login-form');
form.addEventListener('submit', async (e) => {
    e.preventDefault()
    let email = document.getElementById('exampleInputEmail1');
    let password = document.getElementById('exampleInputPassword1');

    let data = {
        'email': email.value,
        'password': password.value
    }

    let url = baseUrl + 'api/login/';
        await $.ajax({
            url: url,  
            type: 'POST',
            dataType: 'json',
            data: data,

            success: function(response) {
                let access = response.access;
                let refresh = response.refresh;
                localStorage.setItem('access', access);
                localStorage.setItem('refresh', refresh);
                window.location.href = baseUrl;
            },
            error: function(jqXHR) {
                if(document.querySelector('.login-field-danger')){
                    form.removeChild(document.querySelector('login-field-danger'))
                }
                let element = document.createElement('p');
                element.classList = 'alert alert-danger login-field-danger';
                element.innerText = Object.values(jqXHR.responseJSON)[0];

                form.insertBefore(element, form.children[0]);
            }
        });
})