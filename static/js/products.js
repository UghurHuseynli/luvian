import { baseUrl } from './setup.js';

let categoryList = document.getElementById('category-list');
let productList = document.getElementById('product-list')

function createListItem(name, id) {
    let listItem = document.createElement('li');
    let button = document.createElement('button');
    listItem.className = 'mb-1';
    button.className = 'border-0 bg-transparent category-list-item';
    button.setAttribute('data-id', id);
    button.innerText = name;
    listItem.appendChild(button);
    return listItem
}

function createProductItem(id, name, desc, url, price, img, rating) {
  let outerDiv = document.createElement('div');
  let image = document.createElement('img');
  let innerDiv = document.createElement('div');
  let innerDiv2 = document.createElement('div');
  let header = document.createElement('h5');
  let header2 = document.createElement('h5');
  let header3 = document.createElement('h5');
  let paragraph = document.createElement('p');
  let link = document.createElement('a');

  link.setAttribute('href', url);
  link.style.cursor = 'pointer';
  link.className = 'text-decoration-none text-black'

  outerDiv.className = 'card';
  outerDiv.style.width = '30rem';
  outerDiv.setAttribute('data-id', id);

  image.className = 'card-img-top w-75 ps-5';
  image.setAttribute('alt', name);
  image.setAttribute('src', img);

  innerDiv.className = 'card-body';

  innerDiv2.className = 'd-flex justify-content-between'

  header.className = 'card-title';
  header.innerText = name;

  header2.className = 'card-title d-flex';
  header2.innerText = `price: $${price}`;

  header3.className = 'card-title';
  header3.innerText = `rating: ${rating}`;

  paragraph.className = 'card-text';
  paragraph.innerText = desc.substring(0, 50) + ' ...';

  innerDiv2.appendChild(header2);
  innerDiv2.appendChild(header3)
  innerDiv.appendChild(header);
  innerDiv.appendChild(innerDiv2)
  innerDiv.appendChild(paragraph);
  link.appendChild(image);
  link.appendChild(innerDiv);
  outerDiv.appendChild(link);
  
  return outerDiv
}

$.ajax({
    url: baseUrl + 'api/category/',
    dataType: 'json',
    type: 'GET',
    
    success: function(response) {
      response.forEach(element => {
        if(element.parent_menu == null){
            categoryList.appendChild(createListItem(element.name, element.id))
        }
      });
    }
});
let newPage = ''
$.ajax({
    url: baseUrl + 'api/product/',
    dataType: 'json',
    type: 'GET',
    
    success: function(response) {
      newPage = response.next
      Object.values(response)[3].forEach(element => {
            productList.appendChild(createProductItem(element.id, element.name, element.description, element.url, element.price, element.img, element.rating))
        })
    }
});


document.addEventListener('click', (e) => {
  if(e.target.classList.contains('category-list-item')){
    if(e.target.dataset.id == undefined){
      while (productList.firstChild) {
        productList.removeChild(productList.firstChild);
      }
      $.ajax({
        url: baseUrl + 'api/product/',
        dataType: 'json',
        type: 'GET',
        
        success: function(response) {
          newPage = response.next
          Object.values(response)[3].forEach(element => {
                productList.appendChild(createProductItem(element.id, element.name, element.description, element.url, element.price, element.img, element.rating))
            })
        }
    });
    } else{
      while (productList.firstChild) {
        productList.removeChild(productList.firstChild);
      }
      $.ajax({
        url: baseUrl + `api/product/?category=${e.target.dataset.id}`,
        dataType: 'json',
        type: 'GET',
        
        success: function(response) {
          newPage = response.next
          Object.values(response)[3].forEach(element => {
            productList.appendChild(createProductItem(element.id, element.name, element.description, element.url, element.price, element.img, element.rating))
          })
   
        }
    });
    }
  }
})

let quantityInput = document.getElementById('quantity-input');
let quantityRangeInput = document.getElementById('quantity-range');

quantityInput.addEventListener('input', () => {
  quantityRangeInput.value = quantityInput.value;
});

quantityRangeInput.addEventListener('input', () => {
  quantityInput.value = quantityRangeInput.value;
});

let priceFilterButton = document.getElementById('price-filter-button');

priceFilterButton.addEventListener('click', (e) => {
      while (productList.firstChild) {
        productList.removeChild(productList.firstChild);
      }
      $.ajax({
        url: baseUrl + `api/product/?price=${quantityInput.value}`,
        dataType: 'json',
        type: 'GET',
        
        success: function(response) {
          newPage = response.next
          Object.values(response)[3].forEach(element => {
                productList.appendChild(createProductItem(element.id, element.name, element.description, element.url, element.price, element.img, element.rating))
            })
        }
    });
})
 

window.addEventListener('scroll', (e) => {
  if(newPage != null) {
    let distanceToBottom = document.documentElement.scrollHeight - window.innerHeight - 5;
    let scrolledDistance = window.scrollY;
    if ((scrolledDistance) > distanceToBottom) {
      $.ajax({
        url: newPage,
        type: 'GET',
        dataType: 'json',
  
        success: function(response){
          newPage = response.next
          Object.values(response)[3].forEach(element => {
            productList.appendChild(createProductItem(element.id, element.name, element.description, element.url, element.price, element.img, element.rating))
        })
        }
      })
    }
  }
})