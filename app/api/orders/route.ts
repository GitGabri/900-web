import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export interface OrderItem {
  name: string;
  price: number | string;
  quantity: number;
  composer: string;
}

export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  organization?: string;
}

export interface Address {
  [key: string]: any;
}

export interface OrderData {
  orderId: string;
  customer: Customer;
  address: Address;
  items: OrderItem[];
  notes?: string;
  orderDate: string;
}

function validateOrderData(orderData: OrderData) {
  const required = ['orderId', 'customer', 'address', 'items'];
  const hasRequiredFields = required.every((field) => (orderData as any)[field]);
  if (!hasRequiredFields) return false;
  const customer = orderData.customer;
  if (!customer.email || !customer.firstName || !customer.lastName) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(customer.email)) return false;
  if (!Array.isArray(orderData.items) || orderData.items.length === 0) return false;
  for (const item of orderData.items) {
    if (!item.name || !item.price || !item.quantity || !item.composer) return false;
  }
  return true;
}

function calculateOrderTotal(items: OrderItem[]) {
  const subtotal = items.reduce((total, item) => total + (parseFloat(item.price as any) * item.quantity), 0);
  const tax = subtotal * 0.08;
  return subtotal + tax;
}

export async function POST(request: Request) {
  try {
    const orderData: OrderData = await request.json();

    // Validate order data
    if (!validateOrderData(orderData)) {
      return new Response(
        JSON.stringify({ error: 'Invalid order data' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if Supabase is available
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      return new Response(
        JSON.stringify({ error: 'Database configuration is not available' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Insert order into database
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
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
          status: 'pending',
        },
      ]);

    if (error) {
      console.error('Supabase error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to submit order to database' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Order submission error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
