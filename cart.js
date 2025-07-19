// Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    initCart();
    initNavigation();
});

function initCart() {
    loadCart();
    updateCartDisplay();
    
    // Event listeners
    document.getElementById('clearCart').addEventListener('click', clearCart);
    document.getElementById('checkoutBtn').addEventListener('click', proceedToCheckout);
    
    // Update cart count on page load
    updateCartCount();
}

function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    return cart;
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartDisplay() {
    const cart = loadCart();
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCartDiv = document.getElementById('emptyCart');
    const cartContent = document.querySelector('.cart-content');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (cart.length === 0) {
        // Show empty cart
        emptyCartDiv.style.display = 'block';
        cartContent.style.display = 'none';
        checkoutBtn.disabled = true;
    } else {
        // Show cart content
        emptyCartDiv.style.display = 'none';
        cartContent.style.display = 'grid';
        checkoutBtn.disabled = false;
        
        // Clear existing items
        cartItemsContainer.innerHTML = '';
        
        // Add each cart item
        cart.forEach((item, index) => {
            const cartItem = createCartItemElement(item, index);
            cartItemsContainer.appendChild(cartItem);
        });
        
        updateCartSummary();
    }
    
    // Always update cart count at the end
    updateCartCount();
}

function createCartItemElement(item, index) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
        <div class="cart-item-image">
            <i class="fas fa-music"></i>
        </div>
        <div class="cart-item-info">
            <div class="cart-item-title">${item.name}</div>
            <div class="cart-item-composer">${item.composer}</div>
            <div class="cart-item-price">$${item.price}</div>
        </div>
        <div class="cart-item-actions">
            <div class="cart-quantity">
                <button class="cart-qty-btn minus" data-index="${index}">-</button>
                <input type="number" class="cart-qty-input" value="${item.quantity}" min="1" max="99" data-index="${index}">
                <button class="cart-qty-btn plus" data-index="${index}">+</button>
            </div>
            <button class="remove-item-btn" data-index="${index}">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    // Add event listeners
    const minusBtn = cartItem.querySelector('.minus');
    const plusBtn = cartItem.querySelector('.plus');
    const qtyInput = cartItem.querySelector('.cart-qty-input');
    const removeBtn = cartItem.querySelector('.remove-item-btn');
    
    minusBtn.addEventListener('click', () => updateQuantity(index, -1));
    plusBtn.addEventListener('click', () => updateQuantity(index, 1));
    qtyInput.addEventListener('change', (e) => updateQuantityDirect(index, parseInt(e.target.value)));
    removeBtn.addEventListener('click', () => removeItem(index));
    
    return cartItem;
}

function updateQuantity(index, change) {
    const cart = loadCart();
    if (cart[index]) {
        cart[index].quantity = Math.max(1, cart[index].quantity + change);
        saveCart(cart);
        updateCartDisplay();
        updateCartCount();
    }
}

function updateQuantityDirect(index, newQuantity) {
    const cart = loadCart();
    if (cart[index] && newQuantity > 0) {
        cart[index].quantity = newQuantity;
        saveCart(cart);
        updateCartDisplay();
        updateCartCount();
    }
}

function removeItem(index) {
    const cart = loadCart();
    cart.splice(index, 1);
    saveCart(cart);
    updateCartDisplay();
    updateCartCount();
}

function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        localStorage.removeItem('cart');
        updateCartDisplay();
        updateCartCount();
    }
}

function updateCartSummary() {
    const cart = loadCart();
    const subtotal = cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax rate
    const total = subtotal + tax;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

function proceedToCheckout() {
    const cart = loadCart();
    if (cart.length > 0) {
        window.location.href = 'checkout.html';
    }
}

// Navigation functionality
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            });
}

// Update cart count in navigation
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountElement = document.getElementById('cartCount');
    
    console.log('updateCartCount called');
    console.log('Cart from localStorage:', cart);
    console.log('Cart count element found:', !!cartCountElement);
    
    if (cartCountElement) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        
        // Hide count if cart is empty
        if (totalItems === 0) {
            cartCountElement.style.display = 'none';
        } else {
            cartCountElement.style.display = 'flex';
        }
        
        console.log('Cart count updated:', totalItems, 'items');
    } else {
        console.log('Cart count element not found - trying again in 50ms');
        // Try again after a short delay
        setTimeout(() => {
            const retryElement = document.getElementById('cartCount');
            if (retryElement) {
                const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
                retryElement.textContent = totalItems;
                
                if (totalItems === 0) {
                    retryElement.style.display = 'none';
                } else {
                    retryElement.style.display = 'flex';
                }
                console.log('Cart count updated on retry:', totalItems, 'items');
            } else {
                console.log('Cart count element still not found on retry');
            }
        }, 50);
    }
}

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });
} 