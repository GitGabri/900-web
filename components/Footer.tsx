'use client'

export default function Footer() {
  return (
    <footer className="bg-premium-black text-premium-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-premium-gold rounded-full flex items-center justify-center">
                <span className="text-premium-black text-2xl font-serif">♪</span>
              </div>
              <span className="text-2xl font-serif font-semibold text-premium-white">
                '900 Music
              </span>
            </div>
            <p className="text-premium-beige text-lg leading-relaxed mb-6 max-w-md">
              Premium sheet music for discerning musicians. Hand-crafted arrangements 
              that bring classical and contemporary pieces to life.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-premium-charcoal rounded-full flex items-center justify-center hover:bg-premium-gold transition-colors duration-300">
                <span className="text-premium-white">📧</span>
              </a>
              <a href="#" className="w-10 h-10 bg-premium-charcoal rounded-full flex items-center justify-center hover:bg-premium-gold transition-colors duration-300">
                <span className="text-premium-white">📱</span>
              </a>
              <a href="#" className="w-10 h-10 bg-premium-charcoal rounded-full flex items-center justify-center hover:bg-premium-gold transition-colors duration-300">
                <span className="text-premium-white">🎵</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-premium-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#home" className="text-premium-beige hover:text-premium-gold transition-colors duration-300">
                  Home
                </a>
              </li>
              <li>
                <a href="#products" className="text-premium-beige hover:text-premium-gold transition-colors duration-300">
                  Sheet Music
                </a>
              </li>
              <li>
                <a href="#about" className="text-premium-beige hover:text-premium-gold transition-colors duration-300">
                  About
                </a>
              </li>
              <li>
                <a href="#contact" className="text-premium-beige hover:text-premium-gold transition-colors duration-300">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold text-premium-white mb-4">Categories</h3>
            <ul className="space-y-3">
              <li>
                <a href="#products" className="text-premium-beige hover:text-premium-gold transition-colors duration-300 flex items-center">
                  <span className="mr-2">🎹</span>
                  Piano
                </a>
              </li>
              <li>
                <a href="#products" className="text-premium-beige hover:text-premium-gold transition-colors duration-300 flex items-center">
                  <span className="mr-2">🎸</span>
                  Guitar
                </a>
              </li>
              <li>
                <a href="#products" className="text-premium-beige hover:text-premium-gold transition-colors duration-300 flex items-center">
                  <span className="mr-2">🎻</span>
                  Violin
                </a>
              </li>
              <li>
                <a href="#products" className="text-premium-beige hover:text-premium-gold transition-colors duration-300 flex items-center">
                  <span className="mr-2">🎼</span>
                  Ensemble
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-premium-charcoal mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-premium-beige text-sm">
              © 2024 '900 Music. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-premium-beige hover:text-premium-gold transition-colors duration-300 text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-premium-beige hover:text-premium-gold transition-colors duration-300 text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-premium-beige hover:text-premium-gold transition-colors duration-300 text-sm">
                Refund Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 