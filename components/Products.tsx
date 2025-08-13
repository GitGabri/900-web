'use client'

import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'

interface Product {
  id: string
  name: string
  composer: string
  description: string
  difficulty: string
  pages: string
  price: number
  category: string
}

const products: Product[] = [
  {
    id: 'moonlight-sonata',
    name: 'Moonlight Sonata',
    composer: 'Ludwig van Beethoven',
    description: 'Complete first movement with detailed fingering and performance notes.',
    difficulty: 'Advanced',
    pages: '12 pages',
    price: 24.99,
    category: 'piano'
  },
  {
    id: 'fur-elise',
    name: 'Für Elise',
    composer: 'Ludwig van Beethoven',
    description: 'Classic piece with modern fingering and performance guidance.',
    difficulty: 'Intermediate',
    pages: '6 pages',
    price: 14.99,
    category: 'piano'
  },
  {
    id: 'claire-de-lune',
    name: 'Clair de Lune',
    composer: 'Claude Debussy',
    description: 'Impressionist masterpiece with detailed pedal markings.',
    difficulty: 'Advanced',
    pages: '8 pages',
    price: 19.99,
    category: 'piano'
  },
  {
    id: 'asturias',
    name: 'Asturias',
    composer: 'Isaac Albéniz',
    description: 'Spanish guitar classic with fingerstyle arrangements.',
    difficulty: 'Advanced',
    pages: '10 pages',
    price: 22.99,
    category: 'guitar'
  },
  {
    id: 'romance',
    name: 'Romance',
    composer: 'Anonymous',
    description: 'Beautiful Spanish romance for classical guitar.',
    difficulty: 'Intermediate',
    pages: '4 pages',
    price: 12.99,
    category: 'guitar'
  },
  {
    id: 'four-seasons',
    name: 'The Four Seasons',
    composer: 'Antonio Vivaldi',
    description: 'Spring movement arranged for violin and piano.',
    difficulty: 'Advanced',
    pages: '16 pages',
    price: 29.99,
    category: 'violin'
  },
  {
    id: 'string-quartet',
    name: 'String Quartet No. 14',
    composer: 'Wolfgang Amadeus Mozart',
    description: 'Complete quartet with all four parts included.',
    difficulty: 'Advanced',
    pages: '32 pages',
    price: 39.99,
    category: 'ensemble'
  }
]

const categoryIcons = {
  piano: '🎹',
  guitar: '🎸',
  violin: '🎻',
  ensemble: '🎼'
}

const difficultyColors = {
  'Beginner': 'bg-green-100 text-green-800',
  'Intermediate': 'bg-yellow-100 text-yellow-800',
  'Advanced': 'bg-red-100 text-red-800'
}

export default function Products() {
  const [activeFilter, setActiveFilter] = useState('all')
  const { addItem } = useCart()

  const filteredProducts = activeFilter === 'all' 
    ? products 
    : products.filter(product => product.category === activeFilter)

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      composer: product.composer,
      price: product.price
    })
  }

  return (
    <section id="products" className="py-20 bg-premium-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-premium-black mb-4">
            Sheet Music Collection
          </h2>
          <p className="text-xl text-premium-charcoal max-w-2xl mx-auto">
            Hand-picked arrangements for musicians of all levels, crafted with precision and care
          </p>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {[
            { id: 'all', label: 'All', icon: '🎵' },
            { id: 'piano', label: 'Piano', icon: '🎹' },
            { id: 'guitar', label: 'Guitar', icon: '🎸' },
            { id: 'violin', label: 'Violin', icon: '🎻' },
            { id: 'ensemble', label: 'Ensemble', icon: '🎼' }
          ].map((filter) => (
            <button 
              key={filter.id}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeFilter === filter.id
                  ? 'bg-premium-black text-premium-white shadow-premium'
                  : 'bg-premium-white text-premium-black hover:bg-premium-warm-beige border border-premium-dark-beige'
              }`}
              onClick={() => setActiveFilter(filter.id)}
            >
              <span>{filter.icon}</span>
              <span>{filter.label}</span>
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group">
              <div className="bg-premium-white rounded-2xl shadow-premium hover:shadow-premium-lg transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
                {/* Product Image */}
                <div className="relative h-48 bg-gradient-to-br from-premium-beige to-premium-warm-beige flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 left-4 text-6xl text-premium-black font-serif">♪</div>
                    <div className="absolute bottom-4 right-4 text-4xl text-premium-black font-serif">♫</div>
                  </div>
                  <div className="relative z-10 text-center">
                    <div className="text-6xl mb-2">{categoryIcons[product.category as keyof typeof categoryIcons]}</div>
                    <div className="text-premium-black font-serif text-sm opacity-60">
                      {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                    </div>
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-serif font-semibold text-premium-black mb-1 group-hover:text-premium-gold transition-colors duration-300">
                      {product.name}
                    </h3>
                    <p className="text-premium-charcoal italic">{product.composer}</p>
                  </div>
                  
                  <p className="text-premium-charcoal text-sm mb-4 leading-relaxed">
                    {product.description}
                  </p>
                  
                  {/* Meta Info */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[product.difficulty as keyof typeof difficultyColors]}`}>
                      {product.difficulty}
                    </span>
                    <span className="text-premium-charcoal text-sm font-medium">
                      {product.pages}
                    </span>
                  </div>
                  
                  {/* Price and Button */}
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-serif font-bold text-premium-black">
                      ${product.price.toFixed(2)}
                    </div>
                    <button 
                      className="bg-premium-black text-premium-white px-6 py-2 rounded-lg font-medium hover:bg-premium-charcoal transition-all duration-300 transform hover:scale-105"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎵</div>
            <h3 className="text-2xl font-serif font-semibold text-premium-black mb-2">
              No music found
            </h3>
            <p className="text-premium-charcoal">
              Try selecting a different category or check back later for new arrangements.
            </p>
          </div>
        )}
      </div>
    </section>
  )
} 