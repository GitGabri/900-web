'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Products from '@/components/Products'
import Footer from '@/components/Footer'
import { CartProvider } from '@/contexts/CartContext'

export default function Home() {
  return (
    <CartProvider>
      <div className="min-h-screen">
        <Navigation />
        <Hero />
        <Products />
        <Footer />
      </div>
    </CartProvider>
  )
} 