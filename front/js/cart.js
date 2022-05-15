// function for retrieving data
const showCart = () => {
    if (localStorage.getItem("cart") == null) {
        return [];
    } else {
        return JSON.parse(localStorage.getItem("cart"))
    }
}

// display the cart
const cart = showCart();

// function for storing data
const saveCart = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// function to display a summary table of purchases in the Shopping Cart page
const displayProducts = (products) => {
    const displayProduct = document.querySelector("#cart__items");

    for (let product of products) {
        displayProduct.innerHTML += `
            <article class="cart__item" data-id="${product.id}" data-color="${product.color}">
                <div class="cart__item__img">
                    <img src="${product.image}" alt="${product.altTxt}">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${product.name}</h2>
                        <p>${product.color}</p>
                        <p>${product.price} €</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                </div>
            </article>
        `
    }
}

// function for calculating total price and quantity
const calculateTheTotal = (products) => {
    const displayTotalQuantity = document.querySelector("#totalQuantity");
    const displayTotalPrice = document.querySelector("#totalPrice");
    let totalQuantity = 0;
    let totalPrice = 0;

    products.map(element => {
        totalQuantity += element.quantity;
        totalPrice += (element.price * element.quantity);
    })

    displayTotalQuantity.textContent = totalQuantity;
    displayTotalPrice.textContent = totalPrice;
}

// function for Managing the modification and deletion of products in the Shopping Cart page
const browseProducts = (products) => {
    const productChanges = document.querySelectorAll(".cart__item__content__settings__quantity");
    const productToRemove = document.querySelectorAll(".cart__item__content__settings__delete");

    // function to change the quantity of a product
    const manageChange = (e) => {
        const parentItem = e.target.closest(".cart__item");
        products.map(element => {
            if (element.id == parentItem.dataset.id && element.color == parentItem.dataset.color) {
                element.quantity = parseInt(e.target.value);
            }
        });

        // save data
        saveCart(products);

        // calculate the total
        calculateTheTotal(products);
    }

    for (let balise of productChanges) {
        // Manage the modification
        balise.addEventListener("change", manageChange);
    }

    // function to delete a product
    const removeProduct = (e) => {
        const parentItem = e.target.closest(".cart__item");
        const index = products.findIndex(element => (element.id == parentItem.dataset.id && element.color == parentItem.dataset.color));
        products.splice(index, 1);

        // delete a product in the DOM
        parentItem.remove();

        // calculate the total
        calculateTheTotal(products);

        // save data
        saveCart(products);
    }

    for (balise of productToRemove) {
        // Manage the deletion
        balise.addEventListener("click", removeProduct)
    }
}

// function to check first name, last name and city
const isValidFirstNameLastNAmeCity = (value) => {
    return /^[A-Za-z\é\è\ê\-]+$/.test(value);
}

// function to check the address
const isValidAddress = (value) => {
    return /^[a-zA-Z0-9\s,'-]*$/.test(value);
}

// function to check the email
const isValidEmail = (value) => {
    return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9-]{2,}[.][a-zA-Z]{2,3}$/.test(value);
}

// function to check the first name, last name and city fields
const validateFirstNameLastNAmeCity = (input, output) => {
    input.addEventListener("change", (e) => {
        let value = e.target.value;
        (isValidFirstNameLastNAmeCity(value) ? output.textContent = "Champ valide"
            : output.textContent = "Champ invalide");
    })
}

// function to check the address field
const validateAddress = (input, output) => {
    input.addEventListener("change", (e) => {
        let value = e.target.value;
        (isValidAddress(value) ? output.textContent = "Champ valide"
            : output.textContent = "Champ invalide");
    })
}

// function to check the email field
const validateEmail = (input, output) => {
    input.addEventListener("change", (e) => {
        let value = e.target.value;
        (isValidEmail(value) ? output.textContent = "Champ valide"
            : output.textContent = "Champ invalide");
    })
}

// function to check the data
const verifyTheData = () => {
    const formParent = document.querySelectorAll(".cart__order__form");
    const firstNameErrorMsg = document.querySelector("#firstNameErrorMsg");
    const lastNameErrorMsg = document.querySelector("#lastNameErrorMsg");
    const cityErrorMsg = document.querySelector("#cityErrorMsg");
    const addressErrorMsg = document.querySelector("#addressErrorMsg");
    const emailErrorMsg = document.querySelector("#emailErrorMsg");

    for (let balise of formParent) {
        validateFirstNameLastNAmeCity(balise.firstName, firstNameErrorMsg);
        validateFirstNameLastNAmeCity(balise.lastName, lastNameErrorMsg);
        validateFirstNameLastNAmeCity(balise.city, cityErrorMsg);
        validateAddress(balise.address, addressErrorMsg);
        validateEmail(balise.email, emailErrorMsg);
    }
}

// place the order
const submitButton = document.querySelector("#order");
submitButton.addEventListener("click", (e) => {
    e.preventDefault();
    const firstName = document.querySelector("#firstName");
    const lastName = document.querySelector("#lastName");
    const address = document.querySelector("#address");
    const city = document.querySelector("#city");
    const email = document.querySelector("#email");

    // retrieve product ids
    const productsSold = [];
    for (let product of cart) {
        productsSold.push(product.id);
    }

    const order = {
        contact: {
            firstName: firstName.value,
            lastName: lastName.value,
            address: address.value,
            city: city.value,
            email: email.value
        },
        products: productsSold
    }

    const options = {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
    }

    if (
        isValidFirstNameLastNAmeCity(firstName.value) &&
        isValidFirstNameLastNAmeCity(lastName.value) &&
        isValidFirstNameLastNAmeCity(city.value) &&
        isValidAddress(address.value) &&
        isValidEmail(email.value)
    ) {
        fetch("http://localhost:3000/api/products/order", options)
            .then((res) => res.json())
            .then((datas) => {
                // emptying the storage
                localStorage.clear();

                // register product ids
                saveCart(datas.orderId);
                document.location.href = "confirmation.html";
            })
            .catch((err) => {
                alert("Il y a eu une erreur : " + err);
            });
    } else {
        alert("Merci de bien vouloir renseigner tous les champs !");
    }
});

const main = (products) => {

    // Display a summary table of purchases in the Shopping Cart page
    displayProducts(products);

    // Manage the modification and deletion of products in the Shopping Cart page
    browseProducts(products);

    // update total items and prices
    calculateTheTotal(products);

    // Retrieve and analyze the data entered by the user in the the form
    verifyTheData();
}

main(cart);



