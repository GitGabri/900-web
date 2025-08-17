import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const publicClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  return NextResponse.json({
    hasClientId: !!clientId,
    hasClientSecret: !!clientSecret,
    hasPublicClientId: !!publicClientId,
    clientIdLength: clientId?.length || 0,
    clientSecretLength: clientSecret?.length || 0,
    publicClientIdLength: publicClientId?.length || 0,
    message: clientId && clientSecret && publicClientId 
      ? 'All PayPal environment variables are set' 
      : 'Missing some PayPal environment variables'
  });
}
