// Confirmation page functionality
document.addEventListener('DOMContentLoaded', function() {
    initConfirmation();
    initNavigation();
});

function initConfirmation() {
    loadOrderDetails();
    updateCartCount();
}

function loadOrderDetails() {
    const orderData = JSON.parse(localStorage.getItem('currentOrder'));
    const orderDetailsContainer = document.getElementById('orderDetails');
    
    if (!orderData) {
        // Redirect to home if no order data
        window.location.href = 'index.html';
        return;
    }
    
    // Calculate totals
    const subtotal = orderData.items.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    
    // Create order details HTML
    orderDetailsContainer.innerHTML = `
        <div class="order-summary-card">
            <div class="order-header">
                <h3>Order Summary</h3>
                <div class="order-id">Order ID: ${orderData.orderId}</div>
            </div>
            
            <div class="customer-info">
                <h4>Customer Information</h4>
                <p><strong>Name:</strong> ${orderData.customer.firstName} ${orderData.customer.lastName}</p>
                <p><strong>Email:</strong> ${orderData.customer.email}</p>
                <p><strong>Phone:</strong> ${orderData.customer.phone}</p>
                ${orderData.customer.organization ? `<p><strong>Organization:</strong> ${orderData.customer.organization}</p>` : ''}
            </div>
            
            <div class="shipping-info">
                <h4>Shipping Address</h4>
                <p>${orderData.address.line1}</p>
                ${orderData.address.line2 ? `<p>${orderData.address.line2}</p>` : ''}
                <p>${orderData.address.city}, ${orderData.address.state} ${orderData.address.zipCode}</p>
                <p>${orderData.address.country}</p>
            </div>
            
            <div class="order-items">
                <h4>Order Items</h4>
                ${orderData.items.map(item => `
                    <div class="order-item">
                        <div class="item-info">
                            <span class="item-name">${item.name}</span>
                            <span class="item-composer">by ${item.composer}</span>
                        </div>
                        <div class="item-details">
                            <span class="item-qty">Qty: ${item.quantity}</span>
                            <span class="item-price">$${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="order-totals">
                <div class="total-row">
                    <span>Subtotal:</span>
                    <span>$${subtotal.toFixed(2)}</span>
                </div>
                <div class="total-row">
                    <span>Tax:</span>
                    <span>$${tax.toFixed(2)}</span>
                </div>
                <div class="total-row total">
                    <span>Total:</span>
                    <span>$${total.toFixed(2)}</span>
                </div>
            </div>
            
            ${orderData.notes ? `
                <div class="order-notes">
                    <h4>Notes for Seller</h4>
                    <p>${orderData.notes}</p>
                </div>
            ` : ''}
        </div>
    `;
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