import { baseUrl } from './setup.js';
let access = localStorage.getItem('access');
let cardSection = document.getElementById('card-section');
function createCardItem(productName, productImage, productQuantity, productId, productPrice, productStock){
    let parentDiv = document.createElement('div');
    let bodyDiv = document.createElement('div');
    let rowDiv = document.createElement('div');
    let imageDiv = document.createElement('div')
    let image = document.createElement('img');
    let nameDiv = document.createElement('div');
    let name = document.createElement('p');
    let quantityDiv = document.createElement('div');
    let minusButton = document.createElement('button');
    let minus = document.createElement('i');
    let quantityInput = document.createElement('input');
    let plusButton = document.createElement('button');
    let plus = document.createElement('i');
    let priceDiv = document.createElement('div');
    let price = document.createElement('h5');
    let trushDiv = document.createElement('div');
    let trush = document.createElement('img');

    parentDiv.className = 'card rounded-3 mb-4';
    bodyDiv.className = 'card-body p-4';
    rowDiv.className = 'row d-flex justify-content-between align-items-center';
    imageDiv.className = 'col-md-2 col-lg-2 col-xl-2';
    image.className = 'img-fluid rounded-3';
    nameDiv.className = 'col-md-3 col-lg-3 col-xl-3';
    name.className = 'lead fw-normal mb-2';
    quantityDiv.className = 'col-md-3 col-lg-3 col-xl-2 d-flex';
    minusButton.className = 'btn btn-link px-2';
    minus.className = 'fas fa-minus';
    quantityInput.className = 'form-control form-control-sm card-quantity-input';
    plusButton.className = 'btn btn-link px-2';
    plus.className = 'fas fa-plus';
    priceDiv.className = 'col-md-3 col-lg-2 col-xl-2 offset-lg-1';
    price.className = 'mb-0';
    trushDiv.className = 'col-md-1 col-lg-1 col-xl-1 text-end';
    trush.className = 'delete-card';

    image.setAttribute('src', productImage);
    image.setAttribute('alt', productName);

    name.innerText = productName;

    minusButton.setAttribute('onclick', "this.parentNode.querySelector('input[type=number]').stepDown()");

    quantityInput.setAttribute('min', 1);
    quantityInput.setAttribute('max', productStock);
    quantityInput.setAttribute('value', productQuantity);
    quantityInput.setAttribute('type', 'number');
    quantityInput.setAttribute('data-id', productId)

    plusButton.setAttribute('onclick', "this.parentNode.querySelector('input[type=number]').stepUp()");

    price.innerText = `$ ${productPrice * productQuantity}`;
    trush.setAttribute('src', "../static/images/trash.svg")
    trush.setAttribute('data-id', productId);

    trushDiv.appendChild(trush);
    priceDiv.appendChild(price);
    plusButton.appendChild(plus);
    minusButton.appendChild(minus);
    quantityDiv.appendChild(plusButton);
    quantityDiv.appendChild(quantityInput);
    quantityDiv.appendChild(minusButton);
    nameDiv.appendChild(name);
    imageDiv.appendChild(image);
    rowDiv.appendChild(imageDiv);
    rowDiv.appendChild(nameDiv);
    rowDiv.appendChild(quantityDiv);
    rowDiv.appendChild(priceDiv);
    rowDiv.appendChild(trushDiv);
    bodyDiv.appendChild(rowDiv);
    parentDiv.appendChild(bodyDiv);

    return parentDiv
}

if(access){
    $.ajax({
        url: baseUrl + 'api/card',
        type: 'GET',
        dataType: 'json',
    
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + access);
        },
    
        success: function(response){
            response.forEach(element => {
                cardSection.appendChild(createCardItem(element.product, element.img, element.quantity, element.id, element.price, element.stock))
            })
        }
    })
} else {
    let message = document.createElement('p');
    let parentDiv = document.createElement('div');
    let bodyDiv = document.createElement('div');
    let rowDiv = document.createElement('div');
    bodyDiv.className = 'card-body p-4';
    rowDiv.className = 'row d-flex justify-content-between align-items-center';
    message.innerText = 'if you want to see your saddle cart please login to your account';
    message.className = 'alert alert-danger mt-5 pt-5 fs-2 text-uppercase';
    rowDiv.appendChild(message);
    bodyDiv.appendChild(rowDiv);
    parentDiv.appendChild(bodyDiv);
    cardSection.appendChild(parentDiv)
}

document.addEventListener('click', (e) => {
    if(e.target.classList.contains('delete-card')){
        let cardId = e.target.dataset.id
        $.ajax({
            url: baseUrl + `api/card/${cardId}`,
            type: 'DELETE',
            dataType: 'json',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + access);
            },

            success: function(response){
                cardSection.removeChild(e.target.parentElement.parentElement.parentElement.parentElement)
            }
        })
    }
});
document.addEventListener('change', (e) => {
    if(e.target.classList.contains('card-quantity-input')) {
        $.ajax({
            url: baseUrl + `api/card/${e.target.dataset.id}/`,
            type: 'PATCH',
            dataType: 'json',
            data: {
                'quantity':  e.target.value
            },
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + access);
            },

            success: function(response){
                e.target.parentElement.nextElementSibling.children[0].innerText = `$ ${ response.quantity * response.price }`
            }
        })
    }
})