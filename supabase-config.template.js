// Template file - will be processed during build
// DO NOT add real credentials to this file
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Enhanced Database Service with Security
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

            const { data, error } = await supabase
                .from('orders')
                .insert([{
                    order_id: orderData.orderId,
                    customer_name: `${orderData.customer.firstName} ${orderData.customer.lastName}`,
                    customer_email: orderData.customer.email,
                    customer_phone: orderData.customer.phone,
                    customer_organization: orderData.customer.organization,
                    shipping_address: JSON.stringify(orderData.address),
                    order_items: JSON.stringify(orderData.items),
                    order_total: this.calculateOrderTotal(orderData.items),
                    notes: orderData.notes,
                    order_date: orderData.orderDate,
                    status: 'pending'
                }]);

            if (error) {
                console.error('Error submitting order:', error);
                throw error;
            }

            // Log successful order creation
            this.logSecurityEvent('order_created', `Order ${orderData.orderId} created successfully`);

            return data;
        } catch (error) {
            console.error('Database error:', error);
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

            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('order_date', { ascending: false });

            if (error) {
                console.error('Error fetching orders:', error);
                throw error;
            }

            // Log admin access
            this.logSecurityEvent('admin_orders_viewed', `Admin viewed ${data.length} orders`);

            return data;
        } catch (error) {
            console.error('Database error:', error);
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

            // Get current order status for audit log
            const { data: currentOrder } = await supabase
                .from('orders')
                .select('status')
                .eq('order_id', orderId)
                .single();

            const oldStatus = currentOrder?.status || 'unknown';

            const { data, error } = await supabase
                .from('orders')
                .update({ status: status })
                .eq('order_id', orderId);

            if (error) {
                console.error('Error updating order:', error);
                throw error;
            }

            // Log the change in audit log
            await this.logOrderChange(orderId, 'status_update', oldStatus, status);

            // Log security event
            this.logSecurityEvent('order_status_updated', `Order ${orderId} status changed from ${oldStatus} to ${status}`);

            return data;
        } catch (error) {
            console.error('Database error:', error);
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
            const decoded = atob(adminToken);
            const parts = decoded.split(':');
            
            if (parts.length !== 3) {
                return false;
            }
            
            const [, timestamp, ] = parts;
            const tokenAge = Date.now() - parseInt(timestamp);
            
            // Token expires after 24 hours
            return tokenAge < 24 * 60 * 60 * 1000;
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
            
            await supabase
                .from('order_audit_log')
                .insert([{
                    order_id: orderId,
                    action: action,
                    old_status: oldValue,
                    new_status: newValue,
                    admin_email: adminEmail
                }]);
        } catch (error) {
            console.error('Error logging audit:', error);
        }
    },

    async logSecurityEvent(eventType, description) {
        try {
            await supabase
                .from('security_events')
                .insert([{
                    event_type: eventType,
                    description: description,
                    ip_address: 'client_ip', // In production, get actual IP
                    user_agent: navigator.userAgent
                }]);
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

            const { data, error } = await supabase
                .from('orders')
                .select('status, order_total');

            if (error) {
                throw error;
            }

            const stats = {
                total: data.length,
                pending: data.filter(o => o.status === 'pending').length,
                processing: data.filter(o => o.status === 'processing').length,
                shipped: data.filter(o => o.status === 'shipped').length,
                completed: data.filter(o => o.status === 'completed').length,
                totalRevenue: data.reduce((sum, order) => sum + parseFloat(order.order_total), 0)
            };

            return stats;
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

            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .or(`customer_name.ilike.%${searchTerm}%,customer_email.ilike.%${searchTerm}%,order_id.ilike.%${searchTerm}%`)
                .order('order_date', { ascending: false });

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error searching orders:', error);
            throw error;
        }
    }
};

// Export for use in other files
export { DatabaseService, supabase }; 