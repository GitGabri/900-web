import PayPalTest from '@/components/PayPalTest';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function PayPalTestPage() {
  return (
    <>
      <Navigation />
      <section className="pt-20 pb-16 bg-premium-cream min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-serif font-bold text-premium-black mb-4">
              PayPal Integration Test
            </h1>
            <p className="text-premium-charcoal text-lg">
              Test the PayPal payment integration before using it in production
            </p>
          </div>
          
          <PayPalTest />
          
          <div className="mt-8 text-center">
            <p className="text-premium-charcoal text-sm">
              This page is for testing purposes only. Use PayPal Sandbox accounts for testing.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
