'use client'

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-premium overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 text-8xl text-premium-black font-serif">♪</div>
        <div className="absolute top-40 right-20 text-6xl text-premium-black font-serif">♫</div>
        <div className="absolute bottom-32 left-1/4 text-7xl text-premium-black font-serif">♬</div>
        <div className="absolute bottom-20 right-1/3 text-5xl text-premium-black font-serif">♩</div>
      </div>
      
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
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-premium-warm-beige rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-premium-black text-2xl">📝</span>
            </div>
            <h3 className="text-lg font-semibold text-premium-black mb-2">Hand-Edited</h3>
            <p className="text-premium-charcoal">Meticulously crafted with performance notes</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-premium-warm-beige rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-premium-black text-2xl">🎯</span>
            </div>
            <h3 className="text-lg font-semibold text-premium-black mb-2">All Levels</h3>
            <p className="text-premium-charcoal">From beginner to advanced arrangements</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-premium-warm-beige rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-premium-black text-2xl">⚡</span>
            </div>
            <h3 className="text-lg font-semibold text-premium-black mb-2">Instant Download</h3>
            <p className="text-premium-charcoal">Get your music immediately after purchase</p>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-premium-black rounded-full flex justify-center">
          <div className="w-1 h-3 bg-premium-black rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
} 