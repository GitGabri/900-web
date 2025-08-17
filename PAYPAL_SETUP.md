# PayPal Integration Setup

## Environment Variables

Add these to your `.env.local` file:

```env
# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id_here
```

## Getting PayPal Credentials

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Create a new app or use an existing one
3. Get your Client ID and Client Secret
4. Use Sandbox credentials for testing, Live credentials for production

## Database Schema Update

You'll need to add payment-related fields to your orders table in Supabase:

```sql
ALTER TABLE orders 
ADD COLUMN payment_method VARCHAR(50),
ADD COLUMN payment_id VARCHAR(255),
ADD COLUMN paypal_order_id VARCHAR(255);
```

## Features Added

1. **PayPal Express Checkout** on cart page
2. **PayPal Payment Option** on checkout page
3. **Manual Order Option** (existing flow)
4. **Order Creation** in Supabase for all PayPal payments
5. **Payment Status Tracking** with PayPal order IDs

## Testing

1. Use PayPal Sandbox for testing
2. Test both payment flows:
   - Express checkout from cart
   - PayPal payment from checkout page
3. Verify orders are created in Supabase
4. Check payment status and PayPal order IDs

## Production Deployment

1. Switch to Live PayPal credentials
2. Update environment variables
3. Test with real PayPal accounts
4. Monitor payment success rates
