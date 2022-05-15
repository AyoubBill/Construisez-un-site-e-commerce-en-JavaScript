// Link a product from the home page to the Product page
const params = new URLSearchParams(window.location.search);

// function for storing data
const saveCart = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// function for retrieving data
const showCart = () => {
    if (localStorage.getItem("cart") == null) {
        return [];
    } else {
        return JSON.parse(localStorage.getItem("cart"))
    }
}

// function to get the id of the product to display
const insertProduct = (products) => {
    for (let product of products) {
        if (product._id == params.get("id")) {
            const imageOfProduct = document.createElement("img");
            const productTitle = document.querySelector("#title");
            const productPrice = document.querySelector("#price");
            const productDescription = document.querySelector("#description");
            const productColor = document.querySelector("#colors");
            const addToCart = document.querySelector("#addToCart");
            const productQuantity = document.querySelector("#quantity");

            imageOfProduct.setAttribute("src", product.imageUrl);
            imageOfProduct.setAttribute("alt", product.altTxt);
            document.querySelector(".item__img").appendChild(imageOfProduct);
            productTitle.textContent = product.name;
            productPrice.textContent = product.price;
            productDescription.textContent = product.description;

            // browse the color chart
            for (let color of product.colors) {
                productColor.innerHTML += `<option value="${color}">${color}</option>`;
            }

            // Add products to the cart
            addToCart.addEventListener("click", () => {
                const data = {
                    id: product._id,
                    color: productColor.value,
                    quantity: parseInt(productQuantity.value),
                    name: product.name,
                    price: product.price,
                    image: product.imageUrl,
                    alt: product.altTxt
                }

                // display the cart
                const cart = showCart();

                const foundProduct = cart.find(element => (element.id == data.id && element.color == data.color));
                if (foundProduct == undefined) {
                    cart.push(data);
                } else {
                    foundProduct.quantity += data.quantity;
                }

                // save the cart
                saveCart(cart);
                alert("Produit a bien ete ajoute au panier")
            });
        }
    }
}

fetch("http://localhost:3000/api/products")
    .then(res => res.json())
    .then(datas => {
        // Get the id of the product to display
        insertProduct(datas);
    })
    .catch(err => {
        alert("Il y a eu une erreur : " + err);
    })




