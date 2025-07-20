# Supabase Database Setup Guide

## 🚀 Quick Setup

### 1. Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project

### 2. Get Your Credentials
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** and **anon public key**
3. Update `supabase-config.js` with your credentials:

```javascript
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

### 3. Create Database Table
Run this SQL in your Supabase SQL Editor:

```sql
-- Create orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_id TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    customer_organization TEXT,
    shipping_address JSONB NOT NULL,
    order_items JSONB NOT NULL,
    order_total DECIMAL(10,2) NOT NULL,
    notes TEXT,
    order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for demo - customize for production)
CREATE POLICY "Allow all operations" ON orders FOR ALL USING (true);
```

### 4. Update Your Files

#### Add Supabase Client to HTML files:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

#### Update checkout.html:
```html
<head>
    <!-- ... existing code ... -->
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
```

#### Update admin.html:
```html
<head>
    <!-- ... existing code ... -->
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
```

### 5. Test the Integration
1. Place a test order on your website
2. Check your Supabase dashboard → **Table Editor** → **orders**
3. Access admin panel at `admin.html`

## 🔧 Advanced Configuration

### Email Notifications
The system still sends email notifications as a backup. You can:
- Keep the email system for immediate notifications
- Use Supabase for data storage and management
- Add webhook notifications for real-time updates

### Security Considerations
For production:
1. **Row Level Security**: Customize RLS policies
2. **API Keys**: Use service role key for admin operations
3. **Authentication**: Add user authentication for admin panel
4. **Rate Limiting**: Implement request limits

### Database Schema Details

#### Orders Table Structure:
- `id`: Auto-incrementing primary key
- `order_id`: Unique order identifier
- `customer_name`: Full customer name
- `customer_email`: Customer email address
- `customer_phone`: Customer phone number
- `customer_organization`: Optional organization
- `shipping_address`: JSON object with address details
- `order_items`: JSON array of ordered items
- `order_total`: Calculated order total
- `notes`: Customer notes for seller
- `order_date`: Timestamp of order creation
- `status`: Order status (pending/processing/shipped/completed)
- `created_at`: Database record creation time

## 📊 Admin Panel Features

### Order Management:
- ✅ View all orders in real-time
- ✅ Filter orders by status
- ✅ Update order status
- ✅ View order details
- ✅ Refresh order list

### Status Options:
- **Pending**: New order received
- **Processing**: Order being prepared
- **Shipped**: Order shipped to customer
- **Completed**: Order fulfilled

## 🛠️ Troubleshooting

### Common Issues:

1. **"Database connection failed"**
   - Check your Supabase URL and API key
   - Verify your table exists
   - Check browser console for errors

2. **Orders not appearing in admin**
   - Check RLS policies
   - Verify table permissions
   - Check network connectivity

3. **Email still sending**
   - This is intentional as a backup
   - Orders are stored in both database and sent via email

### Debug Mode:
Add this to your browser console to see detailed logs:
```javascript
localStorage.setItem('debug', 'true');
```

## 🚀 Deployment

### For Production:
1. **Environment Variables**: Use environment variables for API keys
2. **HTTPS**: Ensure your site uses HTTPS
3. **CORS**: Configure CORS in Supabase if needed
4. **Backup**: Set up database backups
5. **Monitoring**: Add error tracking

### Hosting Options:
- **Netlify**: Easy deployment with form handling
- **Vercel**: Great for static sites
- **GitHub Pages**: Free hosting option
- **AWS S3**: Scalable static hosting

## 📈 Next Steps

### Potential Enhancements:
1. **Customer Accounts**: User registration and login
2. **Order Tracking**: Real-time order status updates
3. **Inventory Management**: Stock level tracking
4. **Payment Integration**: Stripe/PayPal integration
5. **Analytics**: Order analytics and reporting
6. **Email Automation**: Automated order confirmations
7. **SMS Notifications**: Text message updates

### Advanced Features:
- **Multi-currency Support**
- **Tax Calculation**
- **Shipping Rate Calculation**
- **Discount Codes**
- **Customer Reviews**
- **Product Reviews**

## 📞 Support

If you need help:
1. Check the Supabase documentation
2. Review browser console for errors
3. Test with a simple order first
4. Verify all files are properly linked

The system is designed to be robust with fallback to email if database connection fails! 