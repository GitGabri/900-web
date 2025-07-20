// Supabase Configuration
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database operations
const DatabaseService = {
    // Submit order to database
    async submitOrder(orderData) {
        try {
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
                    order_total: calculateOrderTotal(orderData.items),
                    notes: orderData.notes,
                    order_date: orderData.orderDate,
                    status: 'pending'
                }]);

            if (error) {
                console.error('Error submitting order:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Database error:', error);
            throw error;
        }
    },

    // Get all orders (for admin panel)
    async getOrders() {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('order_date', { ascending: false });

            if (error) {
                console.error('Error fetching orders:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Database error:', error);
            throw error;
        }
    },

    // Update order status
    async updateOrderStatus(orderId, status) {
        try {
            const { data, error } = await supabase
                .from('orders')
                .update({ status: status })
                .eq('order_id', orderId);

            if (error) {
                console.error('Error updating order:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Database error:', error);
            throw error;
        }
    }
};

// Helper function to calculate order total
function calculateOrderTotal(items) {
    const subtotal = items.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
    const tax = subtotal * 0.08;
    return subtotal + tax;
}

export { DatabaseService, supabase }; 