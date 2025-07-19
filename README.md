# Paolo Music - Premium Sheet Music Store

A beautiful, modern single-page website for selling premium sheet music online. Built with a sophisticated black, white, and beige color scheme that conveys elegance and musical sophistication.

## 🎵 Features

### Design & User Experience
- **Premium Design**: Clean, modern interface with a sophisticated color palette
- **Responsive Layout**: Fully responsive design that works on all devices
- **Smooth Animations**: Elegant animations and transitions throughout
- **Music-Themed Visuals**: Custom sheet music animations and musical symbols

### Product Showcase
- **Product Grid**: Beautiful card-based layout for sheet music items
- **Category Filtering**: Filter products by instrument type (Piano, Guitar, Violin, Ensemble)
- **Product Details**: Each item includes composer, difficulty level, page count, and price
- **Interactive Elements**: Hover effects and smooth transitions

### Navigation & Functionality
- **Fixed Navigation**: Sticky header with smooth scrolling
- **Mobile-Friendly**: Responsive navigation with hamburger menu
- **Buy Now Buttons**: Interactive purchase buttons with notifications
- **Smooth Scrolling**: Seamless navigation between sections

## 🎨 Color Scheme

The website uses a carefully selected premium color palette:
- **Primary Black**: `#1a1a1a` - Main text and buttons
- **Secondary Black**: `#2d2d2d` - Hover states
- **Primary White**: `#ffffff` - Background and cards
- **Off White**: `#f8f8f8` - Section backgrounds
- **Primary Beige**: `#f5f1e8` - Accent backgrounds
- **Secondary Beige**: `#e8e0d0` - Borders and subtle elements
- **Accent Beige**: `#d4c4a8` - Highlights and interactive elements

## 📁 Project Structure

```
paolo-web/
├── index.html          # Main HTML structure
├── styles.css          # Complete CSS styling
├── script.js           # JavaScript functionality
└── README.md          # Project documentation
```

## 🚀 Getting Started

1. **Clone or Download** the project files
2. **Open** `index.html` in your web browser
3. **Explore** the website and test all features

### Local Development

To run the project locally:

```bash
# Navigate to the project directory
cd paolo-web

# Open with a local server (optional but recommended)
# Using Python 3:
python -m http.server 8000

# Using Node.js (if you have http-server installed):
npx http-server

# Then open http://localhost:8000 in your browser
```

## 🎯 Key Sections

### Hero Section
- Eye-catching animated sheet music visualization
- Clear call-to-action button
- Elegant typography with Playfair Display font

### Products Section
- **Filter Tabs**: All, Piano, Guitar, Violin, Ensemble
- **Product Cards**: Each with preview image, details, and buy button
- **Responsive Grid**: Automatically adjusts to screen size

### About Section
- Information about Paolo Music
- Animated musical symbols
- Professional presentation

### Contact Section
- Contact information with icons
- Clean, accessible design

## 🛠️ Technical Features

### HTML5
- Semantic HTML structure
- Accessible markup
- SEO-friendly elements

### CSS3
- CSS Grid and Flexbox layouts
- CSS Custom Properties (variables)
- Smooth animations and transitions
- Mobile-first responsive design

### JavaScript
- Product filtering functionality
- Smooth scrolling navigation
- Interactive buy buttons with notifications
- Intersection Observer for scroll animations
- Performance optimizations

## 📱 Responsive Design

The website is fully responsive and optimized for:
- **Desktop**: Full feature set with hover effects
- **Tablet**: Adapted layouts and touch-friendly interactions
- **Mobile**: Simplified navigation and optimized spacing

## 🎨 Customization

### Adding New Products
To add new sheet music products, duplicate the product card structure in `index.html`:

```html
<div class="product-card" data-category="piano">
    <div class="product-image">
        <!-- Sheet music preview -->
    </div>
    <div class="product-info">
        <h3>Piece Title</h3>
        <p class="composer">Composer Name</p>
        <p class="description">Description here</p>
        <div class="product-meta">
            <span class="difficulty">Level</span>
            <span class="pages">X pages</span>
        </div>
        <div class="product-price">
            <span class="price">$XX.XX</span>
            <button class="buy-btn">Buy Now</button>
        </div>
    </div>
</div>
```

### Modifying Colors
Update the CSS variables in `styles.css`:

```css
:root {
    --primary-black: #your-color;
    --primary-beige: #your-color;
    /* ... other colors */
}
```

## 🔧 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 📄 License

This project is created for educational and commercial use. Feel free to modify and adapt for your own music business.

## 🎵 Future Enhancements

Potential features to add:
- Shopping cart functionality
- Payment processing integration
- User accounts and favorites
- Advanced search and filtering
- Product reviews and ratings
- Digital download system
- Newsletter signup
- Social media integration

---

**Created with ❤️ for musicians and music lovers everywhere** 