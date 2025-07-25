// Wishlist Logic
let savedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

document.addEventListener('DOMContentLoaded', () => {
    savedWishlist.forEach(savedId => {
        const btn = document.querySelector(`.wishlist-btn[data-id="${savedId}"]`);
        if (btn) {
            btn.querySelector('i').classList.add('text-red-600');
        }
    });
    updateWishlistBadge();
    updateWishlistCounter()
});

function updateWishlistBadge() {
    const badge = document.getElementById("wishlist-count");
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    if (badge) {
        badge.textContent = wishlist.length;
        badge.classList.toggle("hidden", wishlist.length === 0);
    }
}

function updateWishlistCounter() {
    const Counter = document.getElementById("wishlist-counter");
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    if (Counter) {
        Counter.textContent = `Wishlist (${wishlist.length})`;
    }
}

document.addEventListener('click', function (e) {
    const btn = e.target.closest('.wishlist-btn');
    if (!btn) return;

    const productId = btn.getAttribute('data-id');
    const icon = btn.querySelector('i');
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    if (wishlist.includes(productId)) {
        wishlist = wishlist.filter(id => id !== productId);
        icon.classList.remove('text-red-600');
    } else {
        wishlist.push(productId);
        icon.classList.add('text-red-600');
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistBadge();
    updateWishlistCounter()
});

document.addEventListener("DOMContentLoaded", updateWishlistBadge);
