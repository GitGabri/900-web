'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Products from '@/components/Products'
import Footer from '@/components/Footer'
import ScrollIndicator from '@/components/ScrollIndicator'
import { useSearchParams } from 'next/navigation'

function HomeContent() {
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

export default function Home() {
  return (
    <Suspense fallback={
      <div className="bg-premium-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
} 