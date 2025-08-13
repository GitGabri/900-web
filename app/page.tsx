'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Products from '@/components/Products'
import Footer from '@/components/Footer'
import ScrollIndicator from '@/components/ScrollIndicator'
import { useSearchParams } from 'next/navigation'

export default function Home() {
  const searchParams = useSearchParams()

  useEffect(() => {
    // Handle hash navigation when page loads
    const handleHashNavigation = () => {
      const hash = window.location.hash
      if (hash) {
        const element = document.querySelector(hash)
        if (element) {
          // Small delay to ensure page is fully loaded
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' })
          }, 100)
        }
      }
    }

    handleHashNavigation()
  }, [searchParams])

  return (
    <div className="bg-premium-white">
      <Navigation />
      <Hero />
      <Products />
      <Footer />
      <ScrollIndicator />
    </div>
  )
} 