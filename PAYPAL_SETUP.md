# PayPal Integration Setup Guide

This guide will help you set up PayPal payments for your '900 Music website.

## Prerequisites

1. A PayPal Business account
2. Access to PayPal Developer Dashboard

## Step 1: Create PayPal Developer Account

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Sign in with your PayPal Business account
3. Navigate to "Apps & Credentials"

## Step 2: Create PayPal App

1. Click "Create App"
2. Give your app a name (e.g., "'900 Music Store")
3. Select "Business" account type
4. Click "Create App"

## Step 3: Get Credentials

1. In your app dashboard, you'll see two sets of credentials:
   - **Sandbox** (for testing)
   - **Live** (for production)

2. For development, use the **Sandbox** credentials:
   - Client ID
   - Client Secret

## Step 4: Configure Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# PayPal Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_sandbox_client_id_here
PAYPAL_CLIENT_ID=your_sandbox_client_id_here
PAYPAL_CLIENT_SECRET=your_sandbox_client_secret_here
```

**Important Notes:**
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID` is used in the frontend and must be public
- `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` are used in the backend and should be kept secret
- For production, replace with your Live credentials

## Step 5: Install PayPal Dependencies

Run the following command to install the PayPal React SDK:

```bash
npm install @paypal/react-paypal-js
```

## Step 6: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Add items to your cart and proceed to checkout

3. Select "PayPal" as payment method

4. Use PayPal Sandbox test accounts:
   - **Buyer Account**: Use the sandbox buyer account from your PayPal Developer Dashboard
   - **Seller Account**: Your sandbox business account will receive the payments

## Step 7: Production Setup

When ready for production:

1. Switch to **Live** credentials in your PayPal Developer Dashboard
2. Update your `.env.local` file with Live credentials
3. Deploy your application
4. Test with real PayPal accounts

## PayPal Sandbox Test Accounts

You can create test accounts in your PayPal Developer Dashboard:

1. Go to "Sandbox" → "Accounts"
2. Create test accounts for different scenarios
3. Use these accounts to test various payment flows

## Features Included

- ✅ PayPal Checkout integration
- ✅ Automatic tax calculation (8%)
- ✅ Payment capture and verification
- ✅ Error handling and user feedback
- ✅ Order tracking with PayPal transaction IDs
- ✅ Fallback to manual orders

## Security Considerations

- All PayPal API calls are made server-side
- Client credentials are never exposed to the frontend
- Payment verification happens on the server
- HTTPS is required for production

## Troubleshooting

### Common Issues:

1. **"PayPal is not configured" error**
   - Check that `NEXT_PUBLIC_PAYPAL_CLIENT_ID` is set correctly
   - Ensure the environment variable is loaded

2. **Payment creation fails**
   - Verify your PayPal credentials
   - Check that your PayPal account is properly configured
   - Ensure you're using the correct environment (sandbox vs live)

3. **Payment capture fails**
   - Verify the order ID is valid
   - Check PayPal account status
   - Review PayPal API error logs

### Debug Mode:

To enable debug logging, add this to your `.env.local`:

```env
DEBUG=paypal:*
```

## Support

For PayPal-specific issues:
- [PayPal Developer Documentation](https://developer.paypal.com/docs/)
- [PayPal Support](https://www.paypal.com/support/)

For application-specific issues:
- Check the browser console for errors
- Review server logs for API errors
- Verify environment variables are correctly set
