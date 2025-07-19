// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initProductFilter();
    initSmoothScrolling();
    initCart();
    initBuyButtons();
    initAnimations();
    updateCartCount();
});

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

// Product filtering functionality
function initProductFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter products
            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.6s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Cart functionality
function initCart() {
    // Quantity selector functionality
    const qtyButtons = document.querySelectorAll('.qty-btn');
    qtyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            const input = this.parentNode.querySelector('.qty-input');
            let value = parseInt(input.value);
            
            if (action === 'minus') {
                value = Math.max(1, value - 1);
            } else if (action === 'plus') {
                value = Math.min(99, value + 1);
            }
            
            input.value = value;
        });
    });
    
    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productCard = this.closest('.product-card');
            const productName = this.getAttribute('data-product');
            const productPrice = this.getAttribute('data-price');
            const productComposer = this.getAttribute('data-composer');
            const qtyInput = productCard.querySelector('.qty-input');
            const quantity = parseInt(qtyInput.value);
            
            addToCart(productName, productPrice, productComposer, quantity);
            showAddToCartNotification(productName, quantity);
            
            // Reset quantity to 1
            qtyInput.value = 1;
        });
    });
}

function addToCart(name, price, composer, quantity) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => item.name === name);
    
    if (existingItemIndex !== -1) {
        // Update quantity if item already exists
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Add new item to cart
        cart.push({
            name: name,
            price: price,
            composer: composer,
            quantity: quantity
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function showAddToCartNotification(productName, quantity) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'purchase-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-music"></i>
            <h4>Added to Cart</h4>
            <p>${productName} (${quantity}x) - $${(parseFloat(document.querySelector(`[data-product="${productName}"]`).getAttribute('data-price')) * quantity).toFixed(2)}</p>
            <button class="notification-close">×</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--primary-white);
        border: 2px solid var(--accent-beige);
        border-radius: 10px;
        padding: 1rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// Buy button functionality (redirects to cart)
function initBuyButtons() {
    const buyNowButtons = document.querySelectorAll('.buy-now-btn');
    
    buyNowButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productCard = this.closest('.product-card');
            const productName = this.previousElementSibling.getAttribute('data-product');
            const productPrice = this.previousElementSibling.getAttribute('data-price');
            const productComposer = this.previousElementSibling.getAttribute('data-composer');
            const qtyInput = productCard.querySelector('.qty-input');
            const quantity = parseInt(qtyInput.value);
            
            // Add to cart first
            addToCart(productName, productPrice, productComposer, quantity);
            
            // Then redirect to cart
            window.location.href = 'cart.html';
        });
    });
}

// Show purchase notification
function showPurchaseNotification(productName, price) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'purchase-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-music"></i>
            <h4>Added to Cart</h4>
            <p>${productName} - ${price}</p>
            <button class="notification-close">×</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--primary-white);
        border: 2px solid var(--accent-beige);
        border-radius: 10px;
        padding: 1rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// Initialize animations
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.product-card, .about-content, .contact-content');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Add loading animation for product cards
function addLoadingAnimation() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.style.animation = 'fadeInUp 0.6s ease both';
    });
}

// Initialize loading animation when page loads
window.addEventListener('load', function() {
    addLoadingAnimation();
});

// Add hover effects for product cards
document.addEventListener('DOMContentLoaded', function() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close any open modals or notifications
        const notifications = document.querySelectorAll('.purchase-notification');
        notifications.forEach(notification => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        });
    }
});

// Add touch support for mobile devices
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', function() {}, {passive: true});
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(function() {
    // Any scroll-based functionality can go here
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Update cart count in navigation
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountElement = document.getElementById('cartCount');
    
    if (cartCountElement) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        
        // Hide count if cart is empty
        if (totalItems === 0) {
            cartCountElement.style.display = 'none';
        } else {
            cartCountElement.style.display = 'flex';
        }
    }
} 