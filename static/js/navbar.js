import { baseUrl } from "./setup.js";

let authenticate = document.querySelectorAll('.navbar-authenticated-user');
let logout = document.querySelector('#logout');


if(localStorage.getItem('access')) {
    authenticate.forEach(element => {
        element.classList.add('d-none');
    });
    logout.classList.remove('d-none');
} else {
    authenticate.forEach(element => {
        element.classList.remove('d-none');
    });
    logout.classList.add('d-none');
}

logout.addEventListener('click', (e) => {
    let url = baseUrl + 'api/token/blacklist';
    let token = localStorage.getItem('refresh')
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: {
            'refresh': token
        },
    })
})