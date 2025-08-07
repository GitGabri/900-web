"use client"

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { DatabaseService, OrderData } from '@/lib/DatabaseService';
import { useRouter } from 'next/navigation';

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  const { state, clearCart } = useCart();
  const { items, total } = state;
  const tax = total * 0.08;
  const finalTotal = total + tax;
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
      await DatabaseService.submitOrder(orderData);
      setSuccess(true);
      clearCart();
      setTimeout(() => {
        router.push('/confirmation');
      }, 1500);
    } catch (err: any) {
      console.error('Error in handleSubmit:', err);
      setError(err.message || 'Order submission failed.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Navigation />
        <section className="checkout-section">
          <div className="container">
            <h1>Checkout</h1>
            <p>Your cart is empty.</p>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <section className="checkout-section">
        <div className="container">
          <h1>Checkout</h1>
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h2>Customer Information</h2>
            <div className="form-group">
              <input name="firstName" value={customer.firstName} onChange={e => handleInputChange(e, 'customer')} placeholder="First Name" required />
              <input name="lastName" value={customer.lastName} onChange={e => handleInputChange(e, 'customer')} placeholder="Last Name" required />
            </div>
            <div className="form-group">
              <input name="email" type="email" value={customer.email} onChange={e => handleInputChange(e, 'customer')} placeholder="Email" required />
              <input name="phone" value={customer.phone} onChange={e => handleInputChange(e, 'customer')} placeholder="Phone" />
            </div>
            <div className="form-group">
              <input name="organization" value={customer.organization} onChange={e => handleInputChange(e, 'customer')} placeholder="Organization" />
            </div>
            <h2>Shipping Address</h2>
            <div className="form-group">
              <input name="street" value={address.street} onChange={e => handleInputChange(e, 'address')} placeholder="Street Address" required />
            </div>
            <div className="form-group">
              <input name="city" value={address.city} onChange={e => handleInputChange(e, 'address')} placeholder="City" required />
              <input name="state" value={address.state} onChange={e => handleInputChange(e, 'address')} placeholder="State" required />
              <input name="zip" value={address.zip} onChange={e => handleInputChange(e, 'address')} placeholder="ZIP Code" required />
              <input name="country" value={address.country} onChange={e => handleInputChange(e, 'address')} placeholder="Country" required />
            </div>
            <h2>Order Notes</h2>
            <div className="form-group">
              <textarea name="notes" value={notes} onChange={handleNotesChange} placeholder="Notes (optional)" />
            </div>
            <h2>Order Review</h2>
            <div className="order-review">
              {items.map(item => (
                <div key={item.id} className="order-item">
                  <span>{item.name} by {item.composer}</span>
                  <span>Qty: {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="order-summary">
                <div>Subtotal: ${total.toFixed(2)}</div>
                <div>Tax: ${tax.toFixed(2)}</div>
                <div><strong>Total: ${finalTotal.toFixed(2)}</strong></div>
              </div>
            </div>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">Order submitted! Redirecting...</div>}
            <button type="submit" className="submit-btn" disabled={loading}>{loading ? 'Submitting...' : 'Submit Order'}</button>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
} 