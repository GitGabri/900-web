// Template file - will be processed during build
// DO NOT add real credentials to this file
const API_BASE_URL = 'YOUR_LAMBDA_API_URL';

// Lambda API Service (no credentials needed on client-side)
const DatabaseService = {
    // Submit order (public access - customers can create orders)
    async submitOrder(orderData) {
        try {
            // Validate order data
            if (!this.validateOrderData(orderData)) {
                throw new Error('Invalid order data');
            }

            // Rate limiting check (basic implementation)
            if (!this.checkRateLimit()) {
                throw new Error('Too many requests. Please try again later.');
            }

            const response = await fetch(`${API_BASE_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error || 'Failed to submit order');
            }

            // Log successful order creation
            this.logSecurityEvent('order_created', `Order ${orderData.orderId} created successfully`);

            return result.data;
        } catch (error) {
            console.error('Error submitting order:', error);
            throw error;
        }
    },

    // Admin functions (require authentication)
    async getOrders() {
        try {
            // Verify admin access
            const adminToken = this.getAdminToken();
            if (!this.verifyAdminAccess(adminToken)) {
                throw new Error('Unauthorized access. Please log in as admin.');
            }

            const response = await fetch(`${API_BASE_URL}/api/orders`, {
                headers: {
                    'Authorization': `Bearer ${adminToken}`
                }
            });

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error || 'Failed to fetch orders');
            }

            // Log admin access
            this.logSecurityEvent('admin_orders_viewed', `Admin viewed ${result.data.length} orders`);

            return result.data;
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    },

    async updateOrderStatus(orderId, status) {
        try {
            // Verify admin access
            const adminToken = this.getAdminToken();
            if (!this.verifyAdminAccess(adminToken)) {
                throw new Error('Unauthorized access. Please log in as admin.');
            }

            // Validate status
            const validStatuses = ['pending', 'processing', 'shipped', 'completed'];
            if (!validStatuses.includes(status)) {
                throw new Error('Invalid status. Must be one of: ' + validStatuses.join(', '));
            }

            const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify({ status })
            });

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error || 'Failed to update order status');
            }

            // Log the change
            await this.logOrderChange(orderId, 'status_update', 'previous_status', status);

            // Log security event
            this.logSecurityEvent('order_status_updated', `Order ${orderId} status changed to ${status}`);

            return result.data;
        } catch (error) {
            console.error('Error updating order status:', error);
            throw error;
        }
    },

    // Helper functions
    validateOrderData(orderData) {
        const required = ['orderId', 'customer', 'address', 'items'];
        const hasRequiredFields = required.every(field => orderData[field]);
        
        if (!hasRequiredFields) {
            console.error('Missing required fields:', required.filter(field => !orderData[field]));
            return false;
        }

        // Validate customer data
        const customer = orderData.customer;
        if (!customer.email || !customer.firstName || !customer.lastName) {
            console.error('Invalid customer data');
            return false;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customer.email)) {
            console.error('Invalid email format');
            return false;
        }

        // Validate items
        if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
            console.error('Invalid items array');
            return false;
        }

        // Validate each item
        for (const item of orderData.items) {
            if (!item.name || !item.price || !item.quantity || !item.composer) {
                console.error('Invalid item data:', item);
                return false;
            }
        }

        return true;
    },

    calculateOrderTotal(items) {
        const subtotal = items.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
        const tax = subtotal * 0.08;
        return subtotal + tax;
    },

    verifyAdminAccess(adminToken) {
        if (!adminToken) {
            return false;
        }

        try {
            // For Lambda API, we'll verify the token on the server side
            // This is just a basic check to ensure token exists
            return adminToken.length > 0;
        } catch (error) {
            console.error('Token verification failed:', error);
            return false;
        }
    },

    getAdminToken() {
        return localStorage.getItem('adminToken');
    },

    getAdminEmail() {
        return localStorage.getItem('adminEmail');
    },

    async logOrderChange(orderId, action, oldValue, newValue) {
        try {
            const adminEmail = this.getAdminEmail();
            
            // Log to console for now (in production, this would go to a logging service)
            console.log(`Order Change: ${orderId} - ${action} - ${oldValue} -> ${newValue} by ${adminEmail}`);
        } catch (error) {
            console.error('Error logging audit:', error);
        }
    },

    async logSecurityEvent(eventType, description) {
        try {
            // Log to console for now (in production, this would go to a logging service)
            console.log(`Security Event: ${eventType} - ${description}`);
        } catch (error) {
            console.error('Error logging security event:', error);
        }
    },

    checkRateLimit() {
        // Simple rate limiting implementation
        const now = Date.now();
        const lastRequest = localStorage.getItem('lastOrderRequest');
        
        if (lastRequest) {
            const timeSinceLastRequest = now - parseInt(lastRequest);
            // Allow max 5 orders per minute
            if (timeSinceLastRequest < 12000) { // 12 seconds between requests
                return false;
            }
        }
        
        localStorage.setItem('lastOrderRequest', now.toString());
        return true;
    },

    // Utility functions for admin panel
    async getOrderStats() {
        try {
            const adminToken = this.getAdminToken();
            if (!this.verifyAdminAccess(adminToken)) {
                throw new Error('Unauthorized access');
            }

            const response = await fetch(`${API_BASE_URL}/api/admin/stats`, {
                headers: {
                    'Authorization': `Bearer ${adminToken}`
                }
            });

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error || 'Failed to fetch order statistics');
            }

            return result.data;
        } catch (error) {
            console.error('Error getting order stats:', error);
            throw error;
        }
    },

    async searchOrders(searchTerm) {
        try {
            const adminToken = this.getAdminToken();
            if (!this.verifyAdminAccess(adminToken)) {
                throw new Error('Unauthorized access');
            }

            const response = await fetch(`${API_BASE_URL}/api/admin/search?q=${encodeURIComponent(searchTerm)}`, {
                headers: {
                    'Authorization': `Bearer ${adminToken}`
                }
            });

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error || 'Failed to search orders');
            }

            return result.data;
        } catch (error) {
            console.error('Error searching orders:', error);
            throw error;
        }
    }
};

// Export for use in other files
export { DatabaseService }; 