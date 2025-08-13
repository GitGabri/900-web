"use client"

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function ConfirmationPage() {
  return (
    <>
      <Navigation />
      <section className="pt-20 pb-16 bg-premium-cream min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-premium-gold rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl text-premium-black">✓</span>
            </div>
            <h1 className="text-4xl font-serif font-bold text-premium-black mb-6">Order Confirmed!</h1>
            <div className="bg-premium-white rounded-2xl shadow-premium p-8 max-w-2xl mx-auto">
              <p className="text-premium-charcoal text-lg mb-4">
                Thank you for your order. We have received your order and will process it shortly.
              </p>
              <p className="text-premium-charcoal text-lg mb-8">
                You will receive a confirmation email with your order details.
              </p>
              <Link 
                href="/" 
                className="bg-premium-black text-premium-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-premium-charcoal transition-all duration-300 shadow-premium hover:shadow-premium-lg transform hover:-translate-y-1 inline-block"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
} 