'use client'

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1>Premium Sheet Music</h1>
          <p>Discover beautifully crafted arrangements for piano, guitar, and more</p>
          <a href="#products" className="cta-button">Explore Collection</a>
        </div>
        <div className="hero-visual">
          <div className="sheet-music-animation">
            <div className="staff-line"></div>
            <div className="staff-line"></div>
            <div className="staff-line"></div>
            <div className="staff-line"></div>
            <div className="staff-line"></div>
            <div className="note note-1">♪</div>
            <div className="note note-2">♩</div>
            <div className="note note-3">♬</div>
          </div>
        </div>
      </div>
    </section>
  )
} 