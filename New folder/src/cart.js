// Shopping Cart System
let cart = [];

function initCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

function addToCart(product, size, color, quantity = 1) {
    // Check if item with same ID, size, and color already exists
    const existingItem = cart.find(
        item => item.id === product.id && item.selectedSize === size && item.selectedColor === color
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            selectedSize: size,
            selectedColor: color,
            quantity: quantity
        });
    }

    saveCart();
    updateCartUI();
}

// FIX: Added size and color to uniquely identify the item
function removeFromCart(productId, size, color) {
    cart = cart.filter(item => 
        !(item.id === productId && item.selectedSize === size && item.selectedColor === color)
    );
    saveCart();
    updateCartUI();
}

// FIX: Added size and color to uniquely identify the item
function updateQuantity(productId, size, color, quantity) {
    if (quantity <= 0) {
        removeFromCart(productId, size, color); // Use the fixed removeFromCart
        return;
    }
    
    // FIX: Find item using all unique properties
    const item = cart.find(item => 
        item.id === productId && item.selectedSize === size && item.selectedColor === color
    );
    if (item) {
        item.quantity = quantity;
        saveCart();
        updateCartUI();
    }
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartUI();
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getCartCount() {
    return cart.reduce((count, item) => count + item.quantity, 0);
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const mobileCartCounts = document.querySelectorAll('.mobile-cart-count');
    const count = getCartCount();
    
    if (cartCount) {
        cartCount.textContent = count;
        // Ensure visibility only if count > 0
        cartCount.style.display = count > 0 ? 'flex' : 'none';
    }
    
    mobileCartCounts.forEach(element => {
        element.textContent = count;
    });
}

// Initialize cart on page load
initCart();
