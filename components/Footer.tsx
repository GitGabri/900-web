'use client'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>'900 Music</h3>
            <p>Premium sheet music for musicians of all levels. Discover beautifully crafted arrangements and timeless classics.</p>
          </div>
          
          <div className="footer-section">
            <h3>Quick Links</h3>
            <p><a href="#home">Home</a></p>
            <p><a href="#products">Sheet Music</a></p>
            <p><a href="#about">About</a></p>
            <p><a href="#contact">Contact</a></p>
          </div>
          
          <div className="footer-section">
            <h3>Contact Info</h3>
            <p>Email: info@900music.com</p>
            <p>Phone: +1 (555) 123-4567</p>
            <p>Address: 123 Music Street, Melody City</p>
          </div>
          
          <div className="footer-section">
            <h3>Follow Us</h3>
            <p><a href="#" target="_blank" rel="noopener noreferrer">Facebook</a></p>
            <p><a href="#" target="_blank" rel="noopener noreferrer">Instagram</a></p>
            <p><a href="#" target="_blank" rel="noopener noreferrer">Twitter</a></p>
            <p><a href="#" target="_blank" rel="noopener noreferrer">YouTube</a></p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 '900 Music. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  )
} 