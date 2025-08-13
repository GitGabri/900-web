'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { state } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const cartItemCount = state.items.reduce((total, item) => total + item.quantity, 0)

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-premium-white/95 backdrop-blur-md shadow-premium border-b border-premium-warm-beige' 
        : 'bg-premium-white/90 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-premium-black rounded-full flex items-center justify-center">
              <span className="text-premium-white text-xl font-serif">♪</span>
            </div>
            <span className="text-premium-black text-xl font-serif font-semibold tracking-wide">
              '900 Music
            </span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-premium-black hover:text-premium-gold transition-colors duration-200 font-medium">
              Home
            </a>
            <a href="#products" className="text-premium-black hover:text-premium-gold transition-colors duration-200 font-medium">
              Sheet Music
            </a>
            <a href="#about" className="text-premium-black hover:text-premium-gold transition-colors duration-200 font-medium">
              About
            </a>
            <a href="#contact" className="text-premium-black hover:text-premium-gold transition-colors duration-200 font-medium">
              Contact
            </a>
            <Link href="/cart" className="relative group">
              <div className="w-10 h-10 bg-premium-black rounded-full flex items-center justify-center hover:bg-premium-charcoal transition-colors duration-200">
                <span className="text-premium-white text-lg">🛒</span>
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-premium-gold text-premium-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </div>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-premium-black hover:text-premium-gold transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-premium-white border-t border-premium-warm-beige">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#home" onClick={closeMenu} className="block px-3 py-2 text-premium-black hover:text-premium-gold transition-colors duration-200">
                Home
              </a>
              <a href="#products" onClick={closeMenu} className="block px-3 py-2 text-premium-black hover:text-premium-gold transition-colors duration-200">
                Sheet Music
              </a>
              <a href="#about" onClick={closeMenu} className="block px-3 py-2 text-premium-black hover:text-premium-gold transition-colors duration-200">
                About
              </a>
              <a href="#contact" onClick={closeMenu} className="block px-3 py-2 text-premium-black hover:text-premium-gold transition-colors duration-200">
                Contact
              </a>
              <Link href="/cart" onClick={closeMenu} className="block px-3 py-2 text-premium-black hover:text-premium-gold transition-colors duration-200">
                Cart ({cartItemCount})
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 