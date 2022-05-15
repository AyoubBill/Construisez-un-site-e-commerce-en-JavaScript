const main = () => {
    // Show order number
    dispalayOrders();
}

// function for retrieving data
const showCart = () => {
    if (localStorage.getItem("cart") == null) {
        return [];
    } else {
        return JSON.parse(localStorage.getItem("cart"))
    }
}

// function to display the order number
const dispalayOrders = () => {
    const orderId = document.querySelector("#orderId");

    // display ids
    orderId.textContent = showCart();

    // emptying the storage
    localStorage.clear();
}

main();

