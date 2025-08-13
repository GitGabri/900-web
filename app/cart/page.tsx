'use client'

import { useCart } from '@/contexts/CartContext'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export const dynamic = "force-dynamic";

export default function CartPage() {
  const { state, removeItem, updateQuantity, clearCart } = useCart()
  const { items, total } = state

  // Ensure total is a number and calculate tax
  const safeTotal = typeof total === 'number' ? total : 0
  const tax = safeTotal * 0.08 // 8% tax
  const finalTotal = safeTotal + tax

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity)
    }
  }

  const handleRemoveItem = (id: string) => {
    removeItem(id)
  }

  const handleClearCart = () => {
    clearCart()
  }

  const router = useRouter()

  const handleCheckout = () => {
    router.push('/checkout')
  }

  if (items.length === 0) {
    return (
      <>
        <Navigation />
        <section className="pt-20 pb-16 bg-premium-cream min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-serif font-bold text-premium-black">Shopping Cart</h1>
              <Link href="/" className="flex items-center space-x-2 text-premium-gold hover:text-premium-charcoal transition-colors duration-300">
                <span>←</span>
                <span>Continue Shopping</span>
              </Link>
            </div>
            
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-premium-warm-beige rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🛒</span>
              </div>
              <h2 className="text-3xl font-serif font-semibold text-premium-black mb-4">Your cart is empty</h2>
              <p className="text-premium-charcoal text-lg mb-8 max-w-md mx-auto">
                Looks like you haven't added any sheet music to your cart yet.
              </p>
              <Link href="/" className="bg-premium-black text-premium-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-premium-charcoal transition-all duration-300 shadow-premium hover:shadow-premium-lg transform hover:-translate-y-1">
                Start Shopping
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navigation />
      <section className="pt-20 pb-16 bg-premium-cream min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-serif font-bold text-premium-black">Shopping Cart</h1>
            <Link href="/" className="flex items-center space-x-2 text-premium-gold hover:text-premium-charcoal transition-colors duration-300">
              <span>←</span>
              <span>Continue Shopping</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-premium-white rounded-2xl shadow-premium p-6">
                <h2 className="text-2xl font-serif font-semibold text-premium-black mb-6">Cart Items</h2>
                <div className="space-y-4">
                  {items.map((item) => {
                    // Ensure price is a number
                    const safePrice = typeof item.price === 'number' ? item.price : 0
                    return (
                      <div key={item.id} className="flex items-center justify-between p-4 border border-premium-warm-beige rounded-lg">
                        <div className="flex-1">
                          <div className="font-semibold text-premium-black text-lg">{item.name}</div>
                          <div className="text-premium-charcoal italic">{item.composer}</div>
                          <div className="text-premium-gold font-bold text-lg">${safePrice.toFixed(2)}</div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <button 
                              className="w-8 h-8 bg-premium-warm-beige text-premium-black rounded-full flex items-center justify-center hover:bg-premium-dark-beige transition-colors duration-200"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-semibold text-premium-black">{item.quantity}</span>
                            <button 
                              className="w-8 h-8 bg-premium-warm-beige text-premium-black rounded-full flex items-center justify-center hover:bg-premium-dark-beige transition-colors duration-200"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                          
                          <button 
                            className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors duration-200"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-premium-white rounded-2xl shadow-premium p-6 sticky top-24">
                <h3 className="text-2xl font-serif font-semibold text-premium-black mb-6">Order Summary</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-premium-charcoal">
                    <span>Subtotal:</span>
                    <span className="font-semibold">${safeTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-premium-charcoal">
                    <span>Tax (8%):</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-premium-warm-beige pt-4 flex justify-between text-premium-black">
                    <span className="text-xl font-bold">Total:</span>
                    <span className="text-xl font-bold text-premium-gold">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <button 
                    className="w-full bg-premium-warm-beige text-premium-black py-3 rounded-lg font-semibold hover:bg-premium-dark-beige transition-colors duration-300"
                    onClick={handleClearCart}
                  >
                    Clear Cart
                  </button>
                  <Link 
                    href="/checkout"
                    className="w-full bg-premium-black text-premium-white py-3 rounded-lg font-semibold hover:bg-premium-charcoal transition-colors duration-300 shadow-premium hover:shadow-premium-lg transform hover:-translate-y-1 block text-center"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
} 