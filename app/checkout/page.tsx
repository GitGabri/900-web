"use client"

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

// Types for order data
interface OrderItem {
  name: string;
  price: number | string;
  quantity: number;
  composer: string;
}

interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  organization?: string;
}

interface Address {
  [key: string]: any;
}

interface OrderData {
  orderId: string;
  customer: Customer;
  address: Address;
  items: OrderItem[];
  notes?: string;
  orderDate: string;
}

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  const { state, clearCart } = useCart();
  const { items, total } = state;
  

  
  // Ensure total is a number and calculate tax
  const safeTotal = typeof total === 'number' ? total : 0
  const tax = safeTotal * 0.08;
  const finalTotal = safeTotal + tax;
  const router = useRouter();

  // Form state
  const [customer, setCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
  });
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'manual'>('manual');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, group: 'customer' | 'address') => {
    const { name, value } = e.target;
    if (group === 'customer') {
      setCustomer((prev) => ({ ...prev, [name]: value }));
    } else {
      setAddress((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  const handlePayPalApprove = async (data: any, actions: any) => {
    try {
      const orderData = {
        orderId: 'ORD-' + Date.now(),
        customer,
        address,
        items,
        notes,
        orderDate: new Date().toISOString(),
        total: finalTotal,
      };

      const response = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderID: data.orderID,
          orderData,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        clearCart();
        setTimeout(() => {
          router.push('/confirmation');
        }, 1500);
      } else {
        throw new Error(result.error || 'Payment failed');
      }
         } catch (error: any) {
       setError(error.message || 'Payment failed');
     }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const orderId = 'ORD-' + Date.now();
      const orderData: OrderData = {
        orderId,
        customer,
        address,
        items,
        notes,
        orderDate: new Date().toISOString(),
      };
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Order submission failed.');
      }

      const result = await response.json();
      if (result.success) {
        setSuccess(true);
        clearCart();
        setTimeout(() => {
          router.push('/confirmation');
        }, 1500);
      } else {
        throw new Error('Order submission failed.');
      }
         } catch (err: any) {
       setError(err.message || 'Order submission failed.');
     } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Navigation />
        <section className="pt-20 pb-16 bg-premium-cream min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-premium-warm-beige rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🛒</span>
              </div>
              <h1 className="text-4xl font-serif font-bold text-premium-black mb-4">Checkout</h1>
              <p className="text-premium-charcoal text-lg">Your cart is empty.</p>
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <section className="pt-20 pb-16 bg-premium-cream min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-serif font-bold text-premium-black mb-8 text-center">Checkout</h1>
          
          <form onSubmit={handleSubmit} className="bg-premium-white rounded-2xl shadow-premium p-8">
            {/* Customer Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-serif font-semibold text-premium-black mb-6">Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input 
                  name="firstName" 
                  value={customer.firstName} 
                  onChange={e => handleInputChange(e, 'customer')} 
                  placeholder="First Name" 
                  required 
                  className="w-full px-4 py-3 border border-premium-warm-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent"
                />
                <input 
                  name="lastName" 
                  value={customer.lastName} 
                  onChange={e => handleInputChange(e, 'customer')} 
                  placeholder="Last Name" 
                  required 
                  className="w-full px-4 py-3 border border-premium-warm-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input 
                  name="email" 
                  type="email" 
                  value={customer.email} 
                  onChange={e => handleInputChange(e, 'customer')} 
                  placeholder="Email" 
                  required 
                  className="w-full px-4 py-3 border border-premium-warm-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent"
                />
                <input 
                  name="phone" 
                  value={customer.phone} 
                  onChange={e => handleInputChange(e, 'customer')} 
                  placeholder="Phone" 
                  className="w-full px-4 py-3 border border-premium-warm-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent"
                />
              </div>
              <input 
                name="organization" 
                value={customer.organization} 
                onChange={e => handleInputChange(e, 'customer')} 
                placeholder="Organization (optional)" 
                className="w-full px-4 py-3 border border-premium-warm-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent"
              />
            </div>

            {/* Shipping Address */}
            <div className="mb-8">
              <h2 className="text-2xl font-serif font-semibold text-premium-black mb-6">Shipping Address</h2>
              <div className="mb-4">
                <input 
                  name="street" 
                  value={address.street} 
                  onChange={e => handleInputChange(e, 'address')} 
                  placeholder="Street Address" 
                  required 
                  className="w-full px-4 py-3 border border-premium-warm-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <input 
                  name="city" 
                  value={address.city} 
                  onChange={e => handleInputChange(e, 'address')} 
                  placeholder="City" 
                  required 
                  className="w-full px-4 py-3 border border-premium-warm-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent"
                />
                <input 
                  name="state" 
                  value={address.state} 
                  onChange={e => handleInputChange(e, 'address')} 
                  placeholder="State" 
                  required 
                  className="w-full px-4 py-3 border border-premium-warm-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent"
                />
                <input 
                  name="zip" 
                  value={address.zip} 
                  onChange={e => handleInputChange(e, 'address')} 
                  placeholder="ZIP Code" 
                  required 
                  className="w-full px-4 py-3 border border-premium-warm-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent"
                />
                <input 
                  name="country" 
                  value={address.country} 
                  onChange={e => handleInputChange(e, 'address')} 
                  placeholder="Country" 
                  required 
                  className="w-full px-4 py-3 border border-premium-warm-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent"
                />
              </div>
            </div>

            {/* Order Notes */}
            <div className="mb-8">
              <h2 className="text-2xl font-serif font-semibold text-premium-black mb-6">Order Notes</h2>
              <textarea 
                name="notes" 
                value={notes} 
                onChange={handleNotesChange} 
                placeholder="Special instructions or notes (optional)" 
                rows={4}
                className="w-full px-4 py-3 border border-premium-warm-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent resize-none"
              />
            </div>

            {/* Payment Method Selection */}
            <div className="mb-8">
              <h2 className="text-2xl font-serif font-semibold text-premium-black mb-6">Payment Method</h2>
              <div className="space-y-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="manual"
                    checked={paymentMethod === 'manual'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'manual')}
                    className="text-premium-gold focus:ring-premium-gold"
                  />
                  <span className="text-premium-black">Manual Order (Pay Later)</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'paypal')}
                    className="text-premium-gold focus:ring-premium-gold"
                  />
                  <span className="text-premium-black">PayPal</span>
                </label>
              </div>
            </div>

            {/* Order Review */}
            <div className="mb-8">
              <h2 className="text-2xl font-serif font-semibold text-premium-black mb-6">Order Review</h2>
              <div className="bg-premium-cream rounded-lg p-6">
                {items.map(item => {
                  // Ensure price is a number
                  const safePrice = typeof item.price === 'number' ? item.price : 0
                  return (
                    <div key={item.id} className="flex justify-between items-center py-3 border-b border-premium-warm-beige last:border-b-0">
                      <div>
                        <span className="font-semibold text-premium-black">{item.name}</span>
                        <span className="text-premium-charcoal ml-2">by {item.composer}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-premium-charcoal">Qty: {item.quantity}</span>
                        <span className="font-bold text-premium-gold">${(safePrice * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  )
                })}
                <div className="mt-6 pt-4 border-t-2 border-premium-warm-beige space-y-2">
                  <div className="flex justify-between text-premium-charcoal">
                    <span>Subtotal:</span>
                    <span className="font-semibold">${safeTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-premium-charcoal">
                    <span>Tax (8%):</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-premium-black text-xl font-bold">
                    <span>Total:</span>
                    <span className="text-premium-gold">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded-lg">
                Order submitted! Redirecting...
              </div>
            )}

            {/* Payment Section */}
            {paymentMethod === 'paypal' ? (
              <div className="mb-8">
                <h2 className="text-2xl font-serif font-semibold text-premium-black mb-6">PayPal Payment</h2>
                                 <PayPalScriptProvider options={{
                   clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test',
                   currency: "USD",
                   intent: "capture"
                 }}>
                  <PayPalButtons
                                         createOrder={async (data, actions) => {
                       try {
                         const response = await fetch('/api/paypal/create-order', {
                           method: 'POST',
                           headers: {
                             'Content-Type': 'application/json',
                           },
                           body: JSON.stringify({
                             order_price: finalTotal,
                             items,
                           }),
                         });
                         
                         if (!response.ok) {
                           const errorText = await response.text();
                           throw new Error(`API Error: ${response.status} - ${errorText}`);
                         }
                         
                         const result = await response.json();
                         
                         if (!result.success) {
                           throw new Error(result.message || 'Failed to create order');
                         }
                         
                         if (!result.data || !result.data.order || !result.data.order.id) {
                           throw new Error('Invalid order response structure');
                         }
                         
                         return result.data.order.id;
                       } catch (error) {
                         throw error;
                       }
                     }}
                    onApprove={handlePayPalApprove}
                                         onError={(err) => {
                       setError('PayPal payment failed. Please try again.');
                     }}
                    style={{
                      layout: 'vertical',
                      color: 'gold',
                      shape: 'rect',
                      label: 'pay'
                    }}
                  />
                </PayPalScriptProvider>
              </div>
            ) : (
              /* Manual Order Submit Button */
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-premium-black text-premium-white py-4 rounded-lg font-semibold text-lg hover:bg-premium-charcoal transition-all duration-300 shadow-premium hover:shadow-premium-lg transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="loading"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  'Submit Order'
                )}
              </button>
            )}
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
} 