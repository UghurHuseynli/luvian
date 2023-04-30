import { baseUrl } from './setup.js'

let slug = window.location.pathname.split('/')[2];

function createImage(name, image, active=false){
    let div = document.createElement('div');
    if(active) {
        div.className = 'carousel-item active w-75';
    } else {
        div.className = 'carousel-item';
    }

    let imageElement = document.createElement('img');
    imageElement.className = 'd-block w-100';
    imageElement.setAttribute('alt', name);
    imageElement.setAttribute('src', image);
    div.appendChild(imageElement);
    return div
}

function createInfo(rating, stock, price, discount){
    let div = document.createElement('div');
    let p = document.createElement('p');
    let p2 = document.createElement('p');
    let p3 = document.createElement('p');
    let span = document.createElement('span');



    p.innerText = `rating: ${rating}`;
    p2.innerText = `stock: ${stock}`;
    p3.innerText = `price: `
    span.innerText = `${price}`;

    if(discount != ''){
        let span2 = document.createElement('span');
        span.className = 'text-decoration-line-through';
        span2.innerText = `\t${discount}$`;
        p3.appendChild(span)
        p3.appendChild(span2)
        div.appendChild(p3)
        div.appendChild(p2)
        div.append(p)
        return div
    }else{ 
        p3.appendChild(span)
        div.appendChild(p3)
        div.appendChild(p2)
        div.append(p)
        return div
    }
}

$.ajax({
    url: baseUrl + `api/product/${slug}`,
    type: 'GET',
    dataType: 'json',

    success: function(response){
        let header = document.getElementById('page-header');
        let carusel = document.getElementById('page-carusel-div');
        let desc = document.getElementById('page-description-div');
        let info = document.getElementById('page-info-div');

        header.innerText = response.name
        header.setAttribute('data-id', response.id)

        for(let i = 0; i < response.images.length; i++){
            if(i == 0){
                let active = 'true'
                carusel.appendChild(createImage(response.name, response.images[i], active));
            } else {
                carusel.appendChild(createImage(response.name, response.images[i]));
            }
        }
        
        desc.innerText = response.description

        info.appendChild(createInfo(response.rating, response.stock_size, response.price, response.discounted_price))
    }
})

let button = document.getElementById('add-to-card');
let quantity = document.getElementById('product-quantity');
let header = document.getElementById('page-header');
let access = localStorage.getItem('access');

button.addEventListener('click', async()=>{
    $.ajax({
        url: baseUrl + 'api/card/',
        dataType: 'json',
        type: 'POST',
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + access);
        },
        data: {
            quantity: quantity.value,
        product: header.dataset.id
        },

        success: function(response){
            alert('Product added your card')
        },
    })
    })
