'use client'

export default function Hero() {
  return (
    <section id="home" className="relative py-20 flex items-center justify-center bg-gradient-premium overflow-hidden">
      {/* Main content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="w-24 h-24 bg-premium-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-premium-lg">
            <span className="text-premium-white text-4xl font-serif">♪</span>
          </div>
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-premium-black mb-6 leading-tight">
          Premium Sheet Music
          <span className="block text-premium-gold">Collection</span>
        </h1>
        
        <p className="text-xl sm:text-2xl text-premium-charcoal mb-8 leading-relaxed max-w-2xl mx-auto">
          Discover hand-crafted arrangements for musicians of all levels. 
          From classical masterpieces to contemporary compositions.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a 
            href="#products" 
            className="bg-premium-black text-premium-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-premium-charcoal transition-all duration-300 shadow-premium hover:shadow-premium-lg transform hover:-translate-y-1"
          >
            Browse Collection
          </a>
          <a 
            href="#about" 
            className="border-2 border-premium-black text-premium-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-premium-black hover:text-premium-white transition-all duration-300"
          >
            Learn More
          </a>
        </div>
        
        {/* Feature highlights */}
        <div className="mt-24 border-t border-premium-warm-beige pt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="text-center group">
              <div className="mb-6">
                <div className="w-12 h-px bg-premium-gold mx-auto mb-4"></div>
                <h3 className="text-2xl font-serif font-semibold text-premium-black mb-4 tracking-wide">Hand-Edited</h3>
                <div className="w-12 h-px bg-premium-gold mx-auto"></div>
              </div>
              <p className="text-premium-charcoal leading-relaxed text-lg">Meticulously crafted with performance notes and detailed fingering for the perfect interpretation</p>
            </div>
            <div className="text-center group">
              <div className="mb-6">
                <div className="w-12 h-px bg-premium-gold mx-auto mb-4"></div>
                <h3 className="text-2xl font-serif font-semibold text-premium-black mb-4 tracking-wide">All Levels</h3>
                <div className="w-12 h-px bg-premium-gold mx-auto"></div>
              </div>
              <p className="text-premium-charcoal leading-relaxed text-lg">From beginner to advanced arrangements, carefully graded for every skill level and experience</p>
            </div>
            <div className="text-center group">
              <div className="mb-6">
                <div className="w-12 h-px bg-premium-gold mx-auto mb-4"></div>
                <h3 className="text-2xl font-serif font-semibold text-premium-black mb-4 tracking-wide">Instant Download</h3>
                <div className="w-12 h-px bg-premium-gold mx-auto"></div>
              </div>
              <p className="text-premium-charcoal leading-relaxed text-lg">Get your music immediately after purchase, ready to print and play without delay</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 