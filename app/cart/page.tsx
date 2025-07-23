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

  const tax = total * 0.08 // 8% tax
  const finalTotal = total + tax

  const handleQuantityChange = (id: string, newQuantity: number) => {
    updateQuantity(id, newQuantity)
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
        <section className="cart-section">
          <div className="container">
            <div className="cart-header">
              <h1>Shopping Cart</h1>
              <Link href="/" className="continue-shopping">
                <i className="fas fa-arrow-left"></i>
                Continue Shopping
              </Link>
            </div>
            
            <div className="empty-cart">
              <div className="empty-cart-content">
                <i className="fas fa-shopping-cart"></i>
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added any sheet music to your cart yet.</p>
                <Link href="/" className="cta-button">Start Shopping</Link>
              </div>
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
      <section className="cart-section">
        <div className="container">
          <div className="cart-header">
            <h1>Shopping Cart</h1>
            <Link href="/" className="continue-shopping">
              <i className="fas fa-arrow-left"></i>
              Continue Shopping
            </Link>
          </div>

          <div className="cart-content">
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-info">
                    <div className="cart-item-title">{item.name}</div>
                    <div className="cart-item-composer">{item.composer}</div>
                    <div className="cart-item-price">${item.price.toFixed(2)}</div>
                  </div>
                  
                  <div className="cart-item-quantity">
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  
                  <button 
                    className="quantity-btn"
                    onClick={() => handleRemoveItem(item.id)}
                    style={{ marginLeft: '1rem' }}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-header">
                <h3>Order Summary</h3>
              </div>
              <div className="summary-details">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Tax:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
              <div className="cart-actions">
                <button className="clear-cart-btn" onClick={handleClearCart}>
                  <i className="fas fa-trash"></i>
                  Clear Cart
                </button>
                <button className="checkout-btn" onClick={handleCheckout}>
                  <i className="fas fa-credit-card"></i>
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
} 