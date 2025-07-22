const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// JWT secret (in production, use a proper secret management service)
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-change-in-production';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

// Helper function to create response
const createResponse = (statusCode, body) => ({
  statusCode,
  headers: corsHeaders,
  body: JSON.stringify(body)
});

// Helper function to verify admin token
const verifyAdminToken = (event) => {
  try {
    const authHeader = event.headers.Authorization || event.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if token is not expired
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return null;
    }

    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

// Helper function to validate order data
const validateOrderData = (orderData) => {
  const required = ['orderId', 'customer', 'address', 'items'];
  const hasRequiredFields = required.every(field => orderData[field]);
  
  if (!hasRequiredFields) {
    return { valid: false, error: 'Missing required fields' };
  }

  // Validate customer data
  const customer = orderData.customer;
  if (!customer.email || !customer.firstName || !customer.lastName) {
    return { valid: false, error: 'Invalid customer data' };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(customer.email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  // Validate items
  if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
    return { valid: false, error: 'Invalid items array' };
  }

  // Validate each item
  for (const item of orderData.items) {
    if (!item.name || !item.price || !item.quantity || !item.composer) {
      return { valid: false, error: 'Invalid item data' };
    }
  }

  return { valid: true };
};

// Helper function to calculate order total
const calculateOrderTotal = (items) => {
  const subtotal = items.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  const tax = subtotal * 0.08;
  return subtotal + tax;
};

// Submit order (public access)
exports.submitOrder = async (event) => {
  try {
    console.log('Submit order event:', JSON.stringify(event, null, 2));

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
      return createResponse(200, { message: 'OK' });
    }

    const orderData = JSON.parse(event.body);

    // Validate order data
    const validation = validateOrderData(orderData);
    if (!validation.valid) {
      return createResponse(400, { error: validation.error });
    }

    // Rate limiting (basic implementation)
    // In production, use Redis or DynamoDB for proper rate limiting
    const clientIP = event.requestContext.identity.sourceIp;
    console.log(`Order submission from IP: ${clientIP}`);

    // Insert order into database
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
      console.error('Database error:', error);
      return createResponse(500, { error: 'Failed to submit order' });
    }

    // Log security event
    await supabase
      .from('security_events')
      .insert([{
        event_type: 'order_created',
        description: `Order ${orderData.orderId} created successfully`,
        ip_address: clientIP,
        user_agent: event.headers['User-Agent'] || 'Unknown'
      }]);

    return createResponse(200, {
      success: true,
      data: data[0],
      message: 'Order submitted successfully'
    });

  } catch (error) {
    console.error('Error in submitOrder:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
};

// Get orders (admin only)
exports.getOrders = async (event) => {
  try {
    console.log('Get orders event:', JSON.stringify(event, null, 2));

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
      return createResponse(200, { message: 'OK' });
    }

    // Verify admin access
    const adminUser = verifyAdminToken(event);
    if (!adminUser) {
      return createResponse(401, { error: 'Unauthorized access' });
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('order_date', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return createResponse(500, { error: 'Failed to fetch orders' });
    }

    // Log admin access
    await supabase
      .from('security_events')
      .insert([{
        event_type: 'admin_orders_viewed',
        description: `Admin ${adminUser.email} viewed ${data.length} orders`,
        ip_address: event.requestContext.identity.sourceIp,
        user_agent: event.headers['User-Agent'] || 'Unknown'
      }]);

    return createResponse(200, {
      success: true,
      data: data,
      count: data.length
    });

  } catch (error) {
    console.error('Error in getOrders:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
};

// Update order status (admin only)
exports.updateOrderStatus = async (event) => {
  try {
    console.log('Update order status event:', JSON.stringify(event, null, 2));

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
      return createResponse(200, { message: 'OK' });
    }

    // Verify admin access
    const adminUser = verifyAdminToken(event);
    if (!adminUser) {
      return createResponse(401, { error: 'Unauthorized access' });
    }

    const orderId = event.pathParameters.orderId;
    const { status } = JSON.parse(event.body);

    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'completed'];
    if (!validStatuses.includes(status)) {
      return createResponse(400, { 
        error: 'Invalid status. Must be one of: ' + validStatuses.join(', ') 
      });
    }

    // Get current order status for audit log
    const { data: currentOrder } = await supabase
      .from('orders')
      .select('status')
      .eq('order_id', orderId)
      .single();

    const oldStatus = currentOrder?.status || 'unknown';

    // Update order status
    const { data, error } = await supabase
      .from('orders')
      .update({ status: status })
      .eq('order_id', orderId);

    if (error) {
      console.error('Database error:', error);
      return createResponse(500, { error: 'Failed to update order status' });
    }

    // Log the change in audit log
    await supabase
      .from('order_audit_log')
      .insert([{
        order_id: orderId,
        action: 'status_update',
        old_status: oldStatus,
        new_status: status,
        admin_email: adminUser.email
      }]);

    // Log security event
    await supabase
      .from('security_events')
      .insert([{
        event_type: 'order_status_updated',
        description: `Order ${orderId} status changed from ${oldStatus} to ${status} by ${adminUser.email}`,
        ip_address: event.requestContext.identity.sourceIp,
        user_agent: event.headers['User-Agent'] || 'Unknown'
      }]);

    return createResponse(200, {
      success: true,
      data: data[0],
      message: 'Order status updated successfully'
    });

  } catch (error) {
    console.error('Error in updateOrderStatus:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
};

// Get order statistics (admin only)
exports.getOrderStats = async (event) => {
  try {
    console.log('Get order stats event:', JSON.stringify(event, null, 2));

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
      return createResponse(200, { message: 'OK' });
    }

    // Verify admin access
    const adminUser = verifyAdminToken(event);
    if (!adminUser) {
      return createResponse(401, { error: 'Unauthorized access' });
    }

    const { data, error } = await supabase
      .from('orders')
      .select('status, order_total');

    if (error) {
      console.error('Database error:', error);
      return createResponse(500, { error: 'Failed to fetch order statistics' });
    }

    const stats = {
      total: data.length,
      pending: data.filter(o => o.status === 'pending').length,
      processing: data.filter(o => o.status === 'processing').length,
      shipped: data.filter(o => o.status === 'shipped').length,
      completed: data.filter(o => o.status === 'completed').length,
      totalRevenue: data.reduce((sum, order) => sum + parseFloat(order.order_total), 0)
    };

    return createResponse(200, {
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error in getOrderStats:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
};

// Search orders (admin only)
exports.searchOrders = async (event) => {
  try {
    console.log('Search orders event:', JSON.stringify(event, null, 2));

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
      return createResponse(200, { message: 'OK' });
    }

    // Verify admin access
    const adminUser = verifyAdminToken(event);
    if (!adminUser) {
      return createResponse(401, { error: 'Unauthorized access' });
    }

    const searchTerm = event.queryStringParameters?.q || '';

    if (!searchTerm) {
      return createResponse(400, { error: 'Search term is required' });
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .or(`customer_name.ilike.%${searchTerm}%,customer_email.ilike.%${searchTerm}%,order_id.ilike.%${searchTerm}%`)
      .order('order_date', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return createResponse(500, { error: 'Failed to search orders' });
    }

    return createResponse(200, {
      success: true,
      data: data,
      count: data.length,
      searchTerm: searchTerm
    });

  } catch (error) {
    console.error('Error in searchOrders:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
}; 