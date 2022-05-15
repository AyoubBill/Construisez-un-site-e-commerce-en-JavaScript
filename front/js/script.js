const displayOfResult = document.querySelector("#items");

// function for inserting products
const insertProducts = (products) => {
    for (let product of products) {
        displayOfResult.innerHTML += `
            <a href="./product.html?id=${product._id}">
                <article>
                    <img src="${product.imageUrl}" alt="${product.altTxt}">
                    <h3 class="productName">${product.name}</h3>
                    <p class="productDescription">${product.description}</p>
                </article>
            </a>
        `
    }
};

fetch("http://localhost:3000/api/products")
    .then(res => res.json())
    .then(datas => {
        // Insert products in the home page 
        insertProducts(datas);
    })
    .catch(err => {
        alert("Il y a eu une erreur : " + err);
    })




