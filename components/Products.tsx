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
    <section id="products" className="products">
      <div className="container">
        <div className="section-header">
          <h2>Sheet Music Collection</h2>
          <p>Hand-picked arrangements for musicians of all levels</p>
        </div>
        
        <div className="filter-tabs">
          <button 
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'piano' ? 'active' : ''}`}
            onClick={() => setActiveFilter('piano')}
          >
            Piano
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'guitar' ? 'active' : ''}`}
            onClick={() => setActiveFilter('guitar')}
          >
            Guitar
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'violin' ? 'active' : ''}`}
            onClick={() => setActiveFilter('violin')}
          >
            Violin
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'ensemble' ? 'active' : ''}`}
            onClick={() => setActiveFilter('ensemble')}
          >
            Ensemble
          </button>
        </div>

        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card" data-category={product.category}>
              <div className="product-image">
                <div className="sheet-preview">
                  <div className="staff">
                    <div className="staff-line"></div>
                    <div className="staff-line"></div>
                    <div className="staff-line"></div>
                    <div className="staff-line"></div>
                    <div className="staff-line"></div>
                  </div>
                  <div className="clef">𝄞</div>
                  <div className="notes">♪ ♩ ♪ ♩</div>
                </div>
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="composer">{product.composer}</p>
                <p className="description">{product.description}</p>
                <div className="product-meta">
                  <span className="difficulty">{product.difficulty}</span>
                  <span className="pages">{product.pages}</span>
                </div>
                <div className="product-price">${product.price.toFixed(2)}</div>
                <button 
                  className="buy-button"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 