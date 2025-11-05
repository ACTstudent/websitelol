// Main Application Logic
let currentPage = 'home';
let currentProduct = null;
let currentFilters = {
    category: 'all',
    priceRange: 'all',
    search: ''
};

function navigateTo(page, productId = null) {
    currentPage = page;
    if (productId) {
        currentProduct = products.find(p => p.id === productId);
    }
    renderPage();
    window.scrollTo(0, 0);
}

function renderPage() {
    const mainContent = document.getElementById('main-content');
    switch (currentPage) {
        case 'home':
            mainContent.innerHTML = renderHomePage();
            break;
        case 'products':
            mainContent.innerHTML = renderProductsPage();
            break;
        case 'product-details':
            mainContent.innerHTML = renderProductDetailsPage();
            break;
        case 'cart':
            mainContent.innerHTML = renderCartPage();
            break;
        case 'login':
            mainContent.innerHTML = renderLoginPage();
            break;
        case 'signup':
            mainContent.innerHTML = renderSignupPage();
            break;
        case 'account':
            mainContent.innerHTML = renderAccountPage();
            break;
        case 'about':
            mainContent.innerHTML = renderAboutPage();
            break;
        case 'contact':
            mainContent.innerHTML = renderContactPage();
            break;
        default:
            mainContent.innerHTML = renderHomePage();
    }
    // Re-initialize any dynamic elements
    initPage();
}

function initPage() {
    // Add event listeners for dynamically created elements
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });

    const quantityInputs = document.querySelectorAll('.quantity-input');
    quantityInputs.forEach(input => {
        // Removed change listener as we now use +/- buttons with the fixed logic
        // If a change listener is needed, it must be updated to pass size/color
    });

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContact);
    }
}

function renderHomePage() {
    const featuredProducts = loadFeaturedProducts();
    return `
        <section class="hero">
            <div class="hero-container">
                <div class="hero-content">
                    <h1>Step into Style</h1>
                    <p>Discover premium shoes that blend comfort, quality, and fashion. Find your perfect pair today.</p>
                    <button class="btn-primary" onclick="navigateTo('products')">Shop Now</button>
                </div>
                <div class="hero-image">
                    <img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9lc3xlbnwxfHx8fDE3NjIyMTkxNjl8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="Premium Shoes">
                </div>
            </div>
        </section>

        <section class="features">
            <div class="features-container">
                <div class="feature-card">
                    <div class="feature-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"/>
                            <polygon points="12,15 17,21 7,21"/>
                        </svg>
                    </div>
                    <h3>Premium Quality</h3>
                    <p>Handcrafted with the finest materials for lasting comfort and style.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12,6 12,12 16,14"/>
                        </svg>
                    </div>
                    <h3>Fast Delivery</h3>
                    <p>Free shipping on orders over $100. Get your shoes delivered quickly.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                        </svg>
                    </div>
                    <h3>Easy Returns</h3>
                    <p>Not satisfied? Return within 30 days for a full refund.</p>
                </div>
            </div>
        </section>

        <section class="featured-products">
            <div class="section-container">
                <div class="section-header">
                    <h2>Featured Products</h2>
                    <p>Check out our most popular shoes</p>
                </div>
                <div class="products-grid">
                    ${featuredProducts.map(product => renderProductCard(product)).join('')}
                </div>
                <div class="view-all">
                    <button class="btn-secondary" onclick="navigateTo('products')">View All Products</button>
                </div>
            </div>
        </section>
    `;
}

function renderProductsPage() {
    const filteredProducts = filterProducts();
    return `
        <section class="products-page">
            <div class="section-container">
                <div class="section-header">
                    <h1>Our Products</h1>
                    <p>Find the perfect shoes for any occasion</p>
                </div>
                <div class="filter-bar">
                    <div class="search-bar">
                        <input type="text" id="search-input" placeholder="Search products..." value="${currentFilters.search}" oninput="updateSearch(this.value)">
                    </div>
                    <div class="filters">
                        <select id="category-filter" onchange="updateCategory(this.value)">
                            <option value="all" ${currentFilters.category === 'all' ? 'selected' : ''}>All Categories</option>
                            <option value="Running" ${currentFilters.category === 'Running' ? 'selected' : ''}>Running</option>
                            <option value="Casual" ${currentFilters.category === 'Casual' ? 'selected' : ''}>Casual</option>
                            <option value="Athletic" ${currentFilters.category === 'Athletic' ? 'selected' : ''}>Athletic</option>
                            <option value="Formal" ${currentFilters.category === 'Formal' ? 'selected' : ''}>Formal</option>
                        </select>
                        <select id="price-filter" onchange="updatePriceRange(this.value)">
                            <option value="all" ${currentFilters.priceRange === 'all' ? 'selected' : ''}>All Prices</option>
                            <option value="0-50" ${currentFilters.priceRange === '0-50' ? 'selected' : ''}>Under $50</option>
                            <option value="50-100" ${currentFilters.priceRange === '50-100' ? 'selected' : ''}>$50 - $100</option>
                            <option value="100-150" ${currentFilters.priceRange === '100-150' ? 'selected' : ''}>$100 - $150</option>
                            <option value="150+" ${currentFilters.priceRange === '150+' ? 'selected' : ''}>Over $150</option>
                        </select>
                    </div>
                </div>
                <div class="products-grid">
                    ${filteredProducts.map(product => renderProductCard(product)).join('')}
                </div>
            </div>
        </section>
    `;
}

function renderProductDetailsPage() {
    if (!currentProduct) return renderProductsPage();

    return `
        <section class="product-details">
            <div class="product-details-grid">
                <div class="product-images">
                    <img src="${currentProduct.image}" alt="${currentProduct.name}" class="main-image">
                </div>
                <div class="product-info">
                    <h1>${currentProduct.name}</h1>
                    <div class="rating">
                        ${generateStars(currentProduct.rating)}
                        <span>(${currentProduct.reviews} reviews)</span>
                    </div>
                    <p class="price">$${currentProduct.price.toFixed(2)}</p>
                    <p class="description">${currentProduct.description}</p>
                    <div class="options">
                        <div class="option-group">
                            <label>Size:</label>
                            <select id="size-select">
                                ${currentProduct.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
                            </select>
                        </div>
                        <div class="option-group">
                            <label>Color:</label>
                            <select id="color-select">
                                ${currentProduct.colors.map(color => `<option value="${color}">${color}</option>`).join('')}
                            </select>
                        </div>
                        <div class="option-group">
                            <label>Quantity:</label>
                            <input type="number" id="quantity-input" value="1" min="1" max="10">
                        </div>
                    </div>
                    <button class="btn-primary add-to-cart-btn" data-product-id="${currentProduct.id}">Add to Cart</button>
                    <div class="product-meta">
                        <p><strong>Category:</strong> ${currentProduct.category}</p>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function renderCartPage() {
    const cartItems = cart; // FIX: Access global 'cart' variable from src/cart.js
    const total = getCartTotal();

    if (cartItems.length === 0) {
        return `
            <section class="empty-cart">
                <div class="section-container">
                    <h1>Your Cart is Empty</h1>
                    <p>Add some products to get started!</p>
                    <button class="btn-primary" onclick="navigateTo('products')">Shop Now</button>
                </div>
            </section>
        `;
    }

    return `
        <section class="cart-page">
            <div class="cart-grid">
                <div class="cart-items">
                    <h1>Shopping Cart</h1>
                    ${cartItems.map(item => `
                        <div class="cart-item">
                            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                            <div class="cart-item-info">
                                <h3>${item.name}</h3>
                                <div class="cart-item-details">
                                    <p>Size: ${item.selectedSize}</p>
                                    <p>Color: ${item.selectedColor}</p>
                                </div>
                            </div>
                            <div class="quantity-controls">
                                <button onclick="updateCartQuantity(${item.id}, '${item.selectedSize}', '${item.selectedColor}', ${item.quantity - 1})">-</button>
                                <input type="number" value="${item.quantity}" class="quantity-display" data-product-id="${item.id}" min="1" readonly>
                                <button onclick="updateCartQuantity(${item.id}, '${item.selectedSize}', '${item.selectedColor}', ${item.quantity + 1})">+</button>
                            </div>
                            <div class="item-total">$${(item.price * item.quantity).toFixed(2)}</div>
                            <button class="remove-btn btn-danger" onclick="removeFromCart(${item.id}, '${item.selectedSize}', '${item.selectedColor}')">Remove</button>
                        </div>
                    `).join('')}
                </div>
                <div class="cart-summary">
                    <h2>Order Summary</h2>
                    <div class="summary-row">
                        <span>Subtotal:</span>
                        <span>$${total.toFixed(2)}</span>
                    </div>
                    <div class="summary-row">
                        <span>Shipping:</span>
                        <span>Free</span>
                    </div>
                    <div class="summary-row total">
                        <span>Total:</span>
                        <span>$${total.toFixed(2)}</span>
                    </div>
                    <button class="btn-primary">Checkout</button>
                </div>
            </div>
        </section>
    `;
}

function renderLoginPage() {
    return `
        <section class="form-container">
            <div class="form-card">
                <div class="form-header">
                    <h1>Login</h1>
                </div>
                <form id="login-form">
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <button type="submit" class="btn-primary">Login</button>
                </form>
                <div class="form-footer">
                    Don't have an account? <a href="#" onclick="navigateTo('signup')">Sign up</a>
                </div>
            </div>
        </section>
    `;
}

function renderSignupPage() {
    return `
        <section class="form-container">
            <div class="form-card">
                <div class="form-header">
                    <h1>Sign Up</h1>
                </div>
                <form id="signup-form">
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <button type="submit" class="btn-primary">Sign Up</button>
                </form>
                <div class="form-footer">
                    Already have an account? <a href="#" onclick="navigateTo('login')">Login</a>
                </div>
            </div>
        </section>
    `;
}

function renderAccountPage() {
    if (!currentUser) {
        navigateTo('login');
        return '';
    }

    return `
        <section class="account-page">
            <div class="section-container">
                <h1>My Account</h1>
                <div class="tabs">
                    <button class="tab-btn active" onclick="switchTab('profile')">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>Profile</button>
                    <button class="tab-btn" onclick="switchTab('orders')">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <path d="M16 10a4 4 0 0 1-8 0"/>
                        </svg>Orders</button>
                </div>
                <div id="profile-tab" class="tab-content active card">
                    <div class="card-header">
                        <h2>Personal Information</h2>
                        <p>Update your personal details and contact information.</p>
                    </div>
                    <form id="profile-form">
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="profile-name">Name</label>
                                <input type="text" id="profile-name" name="name" value="${currentUser.name}" required>
                            </div>
                            <div class="form-group">
                                <label for="profile-email">Email</label>
                                <input type="email" id="profile-email" name="email" value="${currentUser.email}" required>
                            </div>
                            <div class="form-group">
                                <label for="profile-phone">Phone</label>
                                <input type="tel" id="profile-phone" name="phone" value="${currentUser.phone || ''}">
                            </div>
                            <div class="form-group">
                                <label for="profile-address">Address</label>
                                <textarea id="profile-address" name="address">${currentUser.address || ''}</textarea>
                            </div>
                        </div>
                        <button type="submit" class="btn-primary">Update Profile</button>
                    </form>
                </div>
                <div id="orders-tab" class="tab-content card">
                    <p>No orders yet. Start shopping now!</p>
                </div>
            </div>
        </section>
    `;
}

function renderAboutPage() {
    return `
        <section class="about-hero">
            <h1>Our Story</h1>
            <p>Blending comfort, quality, and fashion since day one.</p>
        </section>
        <section class="about-section">
            <div class="about-grid">
                <div class="about-content">
                    <h1>About StepStyle</h1>
                    <p>StepStyle was founded with a simple mission: to provide high-quality, stylish shoes that don't compromise on comfort. We believe that everyone deserves to look and feel their best, whether they're running errands, hitting the gym, or attending a formal event.</p>
                    <p>Our team of designers and craftsmen work tirelessly to create shoes that blend the latest fashion trends with cutting-edge technology. Every pair is carefully crafted using premium materials and undergoes rigorous quality testing.</p>
                </div>
                <div class="about-image">
                    <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxzaG9lJTIwZmFjdG9yeXxlbnwxfHx8fDE3NjIyMjAyNTd8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="Shoe Factory" class="about-image">
                </div>
            </div>
            <div class="section-header">
                <h2>Our Core Values</h2>
            </div>
            <div class="values-grid">
                <div class="value-card">
                    <div class="value-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                    </div>
                    <h3>Quality First</h3>
                    <p>We never compromise on the quality of our materials or craftsmanship.</p>
                </div>
                <div class="value-card">
                    <div class="value-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                    </div>
                    <h3>Customer Focused</h3>
                    <p>Your satisfaction is our top priority. We're here to help every step of the way.</p>
                </div>
                <div class="value-card">
                    <div class="value-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                            <polyline points="7.5,4.27 7.5,9.36"/>
                            <polyline points="16.5,4.27 16.5,9.36"/>
                        </svg>
                    </div>
                    <h3>Innovation</h3>
                    <p>We continuously innovate to bring you the latest in shoe technology and design.</p>
                </div>
            </div>
        </section>
    `;
}

function renderContactPage() {
    return `
        <section class="contact-page">
            <div class="contact-hero">
                <h1>Contact Us</h1>
                <p>Have a question? We'd love to hear from you.</p>
            </div>
            <div class="contact-content-grid">
                <div class="contact-form-container">
                    <h2>Send us a message</h2>
                    <form id="contact-form">
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="contact-name">Name</label>
                                <input type="text" id="contact-name" name="name" required>
                            </div>
                            <div class="form-group">
                                <label for="contact-email">Email</label>
                                <input type="email" id="contact-email" name="email" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="contact-subject">Subject</label>
                            <input type="text" id="contact-subject" name="subject" required>
                        </div>
                        <div class="form-group">
                            <label for="contact-message">Message</label>
                            <textarea id="contact-message" name="message" rows="5" required></textarea>
                        </div>
                        <button type="submit" class="btn-primary">Send Message</button>
                    </form>
                </div>
                <div class="contact-info-card">
                    <h2>Get in touch</h2>
                    <div class="contact-info-item">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                        <div>
                            <p><strong>Phone</strong></p>
                            <p>+1 (555) 123-4567</p>
                        </div>
                    </div>
                    <div class="contact-info-item">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                            <polyline points="22,6 12,13 2,6"/>
                        </svg>
                        <div>
                            <p><strong>Email</strong></p>
                            <p>support@stepstyle.com</p>
                        </div>
                    </div>
                    <div class="contact-info-item">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                        </svg>
                        <div>
                            <p><strong>Address</strong></p>
                            <p>123 Fashion Street<br>New York, NY 10001</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function renderProductCard(product) {
    return `
        <div class="product-card" onclick="navigateTo('product-details', ${product.id})">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-rating">
                    ${generateStars(product.rating)}
                </div>
            </div>
            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="btn-primary add-to-cart-btn" data-product-id="${product.id}" onclick="event.stopPropagation(); addToCartFromCard(${product.id})">Add to Cart</button>
            </div>
        </div>
    `;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    // FIX: Using the .star class from styles.css for solid stars
    return `
        ${'<svg class="star" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>'.repeat(fullStars)}
        ${hasHalfStar ? '<svg class="star" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2v15.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77z" fill="white" fill-opacity="0.5"/></svg>' : ''}
        ${'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>'.repeat(emptyStars)}
    `;
}

function loadFeaturedProducts() {
    return products.slice(0, 4);
}

function filterProducts() {
    return products.filter(product => {
        const matchesCategory = currentFilters.category === 'all' || product.category === currentFilters.category;
        const matchesSearch = currentFilters.search === '' || product.name.toLowerCase().includes(currentFilters.search.toLowerCase());
        let matchesPrice = true;

        if (currentFilters.priceRange !== 'all') {
            const [min, max] = currentFilters.priceRange.split('-').map(p => p === '+' ? Infinity : parseInt(p));
            matchesPrice = product.price >= min && (max === Infinity || product.price <= max);
        }

        return matchesCategory && matchesSearch && matchesPrice;
    });
}

function updateSearch(value) {
    currentFilters.search = value;
    renderPage();
}

function updateCategory(value) {
    currentFilters.category = value;
    renderPage();
}

function updatePriceRange(value) {
    currentFilters.priceRange = value;
    renderPage();
}

function handleAddToCart(event) {
    event.preventDefault();
    const productId = parseInt(event.target.dataset.productId);
    const product = products.find(p => p.id === productId);
    const size = document.getElementById('size-select')?.value || product.sizes[0];
    const color = document.getElementById('color-select')?.value || product.colors[0];
    const quantity = parseInt(document.getElementById('quantity-input')?.value || 1);

    addToCart(product, size, color, quantity);
    alert('Product added to cart!');
}

function addToCartFromCard(productId) {
    const product = products.find(p => p.id === productId);
    addToCart(product, product.sizes[0], product.colors[0], 1);
    alert('Product added to cart!');
}

// FIX: Updated wrapper function to pass size and color
function updateCartQuantity(productId, size, color, quantity) {
    updateQuantity(productId, size, color, quantity);
    renderPage();
}

function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => tab.classList.remove('active'));
    contents.forEach(content => content.classList.remove('active'));

    document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

function handleLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');

    if (login(email, password)) {
        navigateTo('home');
    } else {
        alert('Invalid credentials');
    }
}

function handleSignup(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');

    if (signup(name, email, password)) {
        navigateTo('home');
    } else {
        alert('Signup failed');
    }
}

function handleProfileUpdate(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    updateProfile(data);
    alert('Profile updated successfully!');
}

function handleContact(event) {
    event.preventDefault();
    alert('Thank you for your message! We\'ll get back to you soon.');
    event.target.reset();
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    renderPage();
});

// Mobile menu toggle
function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    mobileMenu.classList.toggle('active');
}
