'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Products from '@/components/Products'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="bg-premium-white">
      <Navigation />
      <Hero />
      <Products />
      <Footer />
    </div>
  )
} 