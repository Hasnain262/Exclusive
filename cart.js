const CART_KEY = "cart";

function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateCartBadge() {
    const badge = document.getElementById("cart-count");
    if (!badge) return;
    const cart = getCart();

    const totalItems = cart.length;

    badge.textContent = totalItems;
    badge.classList.toggle("hidden", totalItems === 0);
}


function addToCart(productId, productData = null, quantity = 1) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        showRedNotification("Product is already in cart");
        return false;
    }

    cart.push({
        id: productId,
        quantity: quantity,
        price: productData?.price || 0,
        title: productData?.title || "Unknown",
        thumbnail: productData?.thumbnail || ""
    });

    saveCart(cart);
    updateCartBadge();
    showNotification("Product added to cart");
    return true;
}


function removeFromCart(productId) {
    const cart = getCart().filter(item => item.id !== productId);
    saveCart(cart);
    updateCartBadge();
}

function updateCartQuantity(productId, newQuantity) {
    const cart = getCart();
    const index = cart.findIndex(item => item.id === productId);
    if (index >= 0) {
        if (newQuantity > 0) {
            cart[index].quantity = newQuantity;
        } else {
            cart.splice(index, 1);
        }
    }
    saveCart(cart);
    updateCartBadge();
}

function showNotification(message) {
    const notify = document.createElement("div");
    notify.className = "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 transition-all duration-300";
    notify.textContent = message;
    document.body.appendChild(notify);
    setTimeout(() => {
        notify.style.opacity = 0;
        setTimeout(() => notify.remove(), 300);
    }, 2000);
}

function showRedNotification(message) {
    const notify = document.createElement("div");
    notify.className = "fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50 transition-all duration-300";
    notify.textContent = message;
    document.body.appendChild(notify);
    setTimeout(() => {
        notify.style.opacity = 0;
        setTimeout(() => notify.remove(), 300);
    }, 2000);
}

document.addEventListener("DOMContentLoaded", () => {
    updateCartBadge();

    const isProductDetailPage = window.location.pathname.includes("AllProductsDP.html");

    document.addEventListener("click", e => {
        const addBtn = e.target.closest(".cart-btn");
        if (addBtn) {
            e.preventDefault();

            if (isProductDetailPage) return;

            const productId = Number(addBtn.dataset.id);
            addToCart(productId);
        }


        const removeBtn = e.target.closest(".remove-from-cart");
        if (removeBtn) {
            e.preventDefault();
            const productId = Number(removeBtn.dataset.id);
            removeFromCart(productId);
            if (typeof displayCartItems === "function") displayCartItems();
        }

        const quantityUp = e.target.closest(".quantity-up");
        const quantityDown = e.target.closest(".quantity-down");
        if (quantityUp || quantityDown) {
            const row = e.target.closest(".cart-item");
            const productId = Number(row.dataset.id);
            const quantityEl = row.querySelector(".quantity-value");
            let quantity = parseInt(quantityEl.textContent);

            quantityEl.textContent = quantity;
            updateCartQuantity(productId, quantity);

            const price = parseFloat(row.dataset.price);
            const totalEl = row.querySelector(".item-total");
            if (totalEl) totalEl.textContent = `$${(price * quantity).toFixed(2)}`;
            if (typeof updateCartTotals === "function") updateCartTotals();
        }
    });
});

