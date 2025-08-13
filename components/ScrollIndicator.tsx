'use client'

import { useState, useEffect } from 'react'

export default function ScrollIndicator() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsVisible(scrollTop < 100) // Hide after scrolling 100px
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 animate-bounce">
      <div className="w-6 h-10 border-2 border-premium-black rounded-full flex justify-center bg-premium-white/90 backdrop-blur-sm">
        <div className="w-1 h-3 bg-premium-black rounded-full mt-2 animate-pulse"></div>
      </div>
    </div>
  )
}
