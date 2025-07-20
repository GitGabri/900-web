// Admin Panel functionality
document.addEventListener('DOMContentLoaded', function() {
    initAdmin();
});

function initAdmin() {
    loadOrders();
    setupEventListeners();
}

function setupEventListeners() {
    const refreshBtn = document.getElementById('refreshOrders');
    const statusFilter = document.getElementById('statusFilter');
    
    refreshBtn.addEventListener('click', loadOrders);
    statusFilter.addEventListener('change', filterOrders);
}

async function loadOrders() {
    try {
        const orders = await DatabaseService.getOrders();
        displayOrders(orders);
    } catch (error) {
        console.error('Failed to load orders:', error);
        showNotification('Failed to load orders', 'error');
    }
}

function displayOrders(orders) {
    const container = document.getElementById('ordersContainer');
    
    if (orders.length === 0) {
        container.innerHTML = `
            <div class="empty-orders">
                <i class="fas fa-inbox"></i>
                <h3>No orders found</h3>
                <p>Orders will appear here when customers place them.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = orders.map(order => createOrderCard(order)).join('');
}

function createOrderCard(order) {
    const orderDate = new Date(order.order_date).toLocaleDateString();
    const orderItems = JSON.parse(order.order_items);
    const shippingAddress = JSON.parse(order.shipping_address);
    
    return `
        <div class="order-card" data-order-id="${order.order_id}">
            <div class="order-header">
                <div class="order-info">
                    <h3>Order #${order.order_id}</h3>
                    <p class="order-date">${orderDate}</p>
                    <p class="customer-name">${order.customer_name}</p>
                    <p class="customer-email">${order.customer_email}</p>
                </div>
                <div class="order-status">
                    <span class="status-badge ${order.status}">${order.status}</span>
                    <p class="order-total">$${order.order_total.toFixed(2)}</p>
                </div>
            </div>
            
            <div class="order-details">
                <div class="order-items">
                    <h4>Items:</h4>
                    ${orderItems.map(item => `
                        <div class="order-item">
                            <span>${item.name} by ${item.composer}</span>
                            <span>Qty: ${item.quantity}</span>
                            <span>$${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="shipping-info">
                    <h4>Shipping Address:</h4>
                    <p>${shippingAddress.line1}</p>
                    ${shippingAddress.line2 ? `<p>${shippingAddress.line2}</p>` : ''}
                    <p>${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}</p>
                    <p>${shippingAddress.country}</p>
                </div>
                
                ${order.notes ? `
                    <div class="order-notes">
                        <h4>Customer Notes:</h4>
                        <p>${order.notes}</p>
                    </div>
                ` : ''}
            </div>
            
            <div class="order-actions">
                <select class="status-update" onchange="updateOrderStatus('${order.order_id}', this.value)">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                    <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                    <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
                </select>
                <button class="admin-btn" onclick="viewOrderDetails('${order.order_id}')">
                    <i class="fas fa-eye"></i>
                    View Details
                </button>
            </div>
        </div>
    `;
}

async function updateOrderStatus(orderId, newStatus) {
    try {
        await DatabaseService.updateOrderStatus(orderId, newStatus);
        showNotification(`Order status updated to ${newStatus}`, 'success');
        loadOrders(); // Refresh the list
    } catch (error) {
        console.error('Failed to update order status:', error);
        showNotification('Failed to update order status', 'error');
    }
}

function filterOrders() {
    const statusFilter = document.getElementById('statusFilter').value;
    const orderCards = document.querySelectorAll('.order-card');
    
    orderCards.forEach(card => {
        const statusBadge = card.querySelector('.status-badge');
        const orderStatus = statusBadge.textContent;
        
        if (statusFilter === 'all' || orderStatus === statusFilter) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function viewOrderDetails(orderId) {
    // You can implement a modal or redirect to a detailed view
    alert(`Viewing details for order ${orderId}`);
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">×</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
        color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
        border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : '#bee5eb'};
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