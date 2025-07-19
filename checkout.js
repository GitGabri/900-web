// Checkout functionality
document.addEventListener('DOMContentLoaded', function() {
    initCheckout();
    initNavigation();
});

function initCheckout() {
    loadOrderSummary();
    
    // Form submission
    document.getElementById('checkoutForm').addEventListener('submit', handleFormSubmission);
    
    // Form validation
    const formInputs = document.querySelectorAll('#checkoutForm input, #checkoutForm select, #checkoutForm textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
    
    // Update cart count on page load
    updateCartCount();
}

function loadOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderItemsContainer = document.getElementById('orderItems');
    
    if (cart.length === 0) {
        // Redirect to cart if empty
        window.location.href = 'cart.html';
        return;
    }
    
    // Clear existing items
    orderItemsContainer.innerHTML = '';
    
    // Add each order item
    cart.forEach(item => {
        const orderItem = createOrderItemElement(item);
        orderItemsContainer.appendChild(orderItem);
    });
    
    updateOrderSummary();
}

function createOrderItemElement(item) {
    const orderItem = document.createElement('div');
    orderItem.className = 'order-item';
    orderItem.innerHTML = `
        <div class="order-item-info">
            <div class="order-item-title">${item.name}</div>
            <div class="order-item-composer">${item.composer}</div>
            <div class="order-item-qty">Qty: ${item.quantity}</div>
        </div>
        <div class="order-item-price">$${(parseFloat(item.price) * item.quantity).toFixed(2)}</div>
    `;
    
    return orderItem;
}

function updateOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax rate
    const total = subtotal + tax;
    
    document.getElementById('orderSubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('orderTax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('orderTotal').textContent = `$${total.toFixed(2)}`;
}

function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    
    // Remove existing error
    clearFieldError(event);
    
    // Check if required field is empty
    if (isRequired && value === '') {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value !== '') {
        const phoneRegex = /^[\+]?[0-9][\d]{0,10}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    // Remove existing error
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '0.85rem';
    errorDiv.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = '#dc3545';
}

function clearFieldError(event) {
    const field = event.target;
    const errorDiv = field.parentNode.querySelector('.field-error');
    
    if (errorDiv) {
        errorDiv.remove();
    }
    
    field.style.borderColor = '';
}

function validateForm() {
    const form = document.getElementById('checkoutForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function handleFormSubmission(event) {
    event.preventDefault();
    
    if (!validateForm()) {
        showNotification('Please fix the errors in the form', 'error');
        return;
    }
    
    // Get form data
    const formData = new FormData(event.target);
    const orderData = {
        customer: {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            organization: formData.get('organization') || ''
        },
        address: {
            line1: formData.get('addressLine1'),
            line2: formData.get('addressLine2') || '',
            city: formData.get('city'),
            state: formData.get('state'),
            zipCode: formData.get('zipCode'),
            country: formData.get('country')
        },
        notes: formData.get('notes') || '',
        items: JSON.parse(localStorage.getItem('cart')) || [],
        orderDate: new Date().toISOString(),
        orderId: generateOrderId()
    };
    
    // Save order data locally
    localStorage.setItem('currentOrder', JSON.stringify(orderData));
    
    // Send order via email (using mailto link as a simple solution)
    sendOrderViaEmail(orderData);
    
    // Show success message
    showNotification('Order submitted successfully!', 'success');
    
    // Clear cart
    localStorage.removeItem('cart');
    
    // Redirect to confirmation page
    setTimeout(() => {
        window.location.href = 'confirmation.html';
    }, 2000);
}

function sendOrderViaEmail(orderData) {
    // Calculate totals
    const subtotal = orderData.items.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    
    // Create email content
    const emailSubject = `New Order: ${orderData.orderId}`;
    const emailBody = `
New Order Received

Order ID: ${orderData.orderId}
Date: ${new Date(orderData.orderDate).toLocaleDateString()}

CUSTOMER INFORMATION:
Name: ${orderData.customer.firstName} ${orderData.customer.lastName}
Email: ${orderData.customer.email}
Phone: ${orderData.customer.phone}
Organization: ${orderData.customer.organization || 'N/A'}

SHIPPING ADDRESS:
${orderData.address.line1}
${orderData.address.line2 ? orderData.address.line2 + '\n' : ''}
${orderData.address.city}, ${orderData.address.state} ${orderData.address.zipCode}
${orderData.address.country}

ORDER ITEMS:
${orderData.items.map(item => `- ${item.name} by ${item.composer} (${item.quantity}x) - $${(parseFloat(item.price) * item.quantity).toFixed(2)}`).join('\n')}

ORDER SUMMARY:
Subtotal: $${subtotal.toFixed(2)}
Tax: $${tax.toFixed(2)}
Total: $${total.toFixed(2)}

NOTES FOR SELLER:
${orderData.notes || 'No additional notes'}

---
This order was submitted through the 900 Music website.
    `.trim();
    
    // Create mailto link
    const mailtoLink = `mailto:hello@900music.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Open email client
    window.open(mailtoLink);
}

function generateOrderId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORDER-${timestamp}-${random}`;
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">×</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#d4edda' : '#f8d7da'};
        color: ${type === 'success' ? '#155724' : '#721c24'};
        border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};
        border-radius: 10px;
        padding: 1rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
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