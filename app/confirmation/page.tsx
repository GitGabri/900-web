"use client"

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function ConfirmationPage() {
  return (
    <>
      <Navigation />
      <section className="confirmation-section">
        <div className="container">
          <h1>Order Confirmed!</h1>
          <p>Thank you for your order. We have received your order and will process it shortly.</p>
          <p>You will receive a confirmation email with your order details.</p>
          <a href="/" className="btn">Continue Shopping</a>
        </div>
      </section>
      <Footer />
    </>
  );
} 