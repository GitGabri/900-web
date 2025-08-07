import { createClient } from '@supabase/supabase-js';

// You may want to load these from environment variables in production
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if environment variables are available
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase environment variables are not properly configured. Database operations will fail.');
  console.warn('NEXT_PUBLIC_SUPABASE_URL:', SUPABASE_URL ? 'Set' : 'Not set');
  console.warn('NEXT_PUBLIC_SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? 'Set' : 'Not set');
}

// Create Supabase client only if environment variables are available
let supabase: any = null;
try {
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (error) {
  console.error('Failed to create Supabase client:', error);
}

// Types
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

export const DatabaseService = {
  // Submit order (public access)
  async submitOrder(orderData: OrderData) {
    if (!this.validateOrderData(orderData)) {
      throw new Error('Invalid order data');
    }
    
    // If Supabase is not available, throw a clear error
    if (!supabase) {
      throw new Error('Database connection is not available. Please check your environment configuration and try again later. If this problem persists, please contact support.');
    }
    
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
          order_total: this.calculateOrderTotal(orderData.items),
          notes: orderData.notes,
          order_date: orderData.orderDate,
          status: 'pending',
        },
      ]);
    if (error) {
      throw error;
    }
    return data;
  },

  // Helper functions
  validateOrderData(orderData: OrderData) {
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
  },

  calculateOrderTotal(items: OrderItem[]) {
    const subtotal = items.reduce((total, item) => total + (parseFloat(item.price as any) * item.quantity), 0);
    const tax = subtotal * 0.08;
    return subtotal + tax;
  },
};

 