# '900 Music - Premium Sheet Music Store

A modern Next.js application for selling premium sheet music with a beautiful, responsive design and secure backend integration.

## Features

- **Modern React/Next.js Architecture**: Built with Next.js 14, TypeScript, and modern React patterns
- **Responsive Design**: Beautiful, mobile-first design with smooth animations
- **Shopping Cart**: Full cart functionality with localStorage persistence
- **Product Filtering**: Filter sheet music by instrument type
- **Secure Backend**: Server-side API routes for secure Supabase integration
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Custom CSS with responsive design
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (ready for implementation)
- **Deployment**: Vercel, Netlify, or any Next.js-compatible platform

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd paolo-music-store
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
paolo-music-store/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   └── supabase/      # Supabase proxy API
│   ├── cart/              # Cart page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── Navigation.tsx     # Navigation component
│   ├── Hero.tsx          # Hero section
│   ├── Products.tsx      # Products grid
│   └── Footer.tsx        # Footer component
├── contexts/             # React contexts
│   └── CartContext.tsx   # Shopping cart context
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```

## API Routes

### `/api/orders`
Handles order submission to the database.

**POST Request Format:**
```json
{
  "orderId": "ORD-1234567890",
  "customer": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "123-456-7890",
    "organization": "Company Name"
  },
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zip": "12345",
    "country": "USA"
  },
  "items": [
    {
      "name": "Moonlight Sonata",
      "price": 29.99,
      "quantity": 1,
      "composer": "Beethoven"
    }
  ],
  "notes": "Optional order notes",
  "orderDate": "2024-01-01T00:00:00.000Z"
}
```

### `/api/supabase`
Secure proxy to Supabase database operations.

**POST Request Format:**
```json
{
  "table": "table_name",
  "action": "select|insert|update|delete",
  "values": {}, // for insert/update
  "filters": {} // for select/update/delete
}
```

**Example Usage:**
```javascript
// Select all users
const response = await fetch('/api/supabase', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    table: 'users',
    action: 'select'
  })
})

// Insert new order
const response = await fetch('/api/supabase', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    table: 'orders',
    action: 'insert',
    values: {
      user_id: 1,
      total: 99.99,
      items: ['moonlight-sonata', 'fur-elise']
    }
  })
})
```

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Build command: `npm run build`
2. Publish directory: `.next`
3. Add environment variables in Netlify dashboard

### Other Platforms
Any platform that supports Next.js applications can host this project.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Your Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_KEY` | Supabase service key (for API routes) | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Public Supabase URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Supabase anon key | Yes |

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Adding New Features

1. **New Pages**: Add to `app/` directory
2. **New Components**: Add to `components/` directory
3. **New API Routes**: Add to `app/api/` directory
4. **New Contexts**: Add to `contexts/` directory

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, email info@900music.com or create an issue in the repository. 