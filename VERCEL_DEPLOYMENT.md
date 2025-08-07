# Vercel Deployment Setup

## Environment Variables

To fix the "DatabaseService is not defined" error, you need to set up the following environment variables in your Vercel deployment:

### Required Environment Variables

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Your Supabase project URL
   - Format: `https://your-project-id.supabase.co`

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Your Supabase anonymous/public key
   - Found in your Supabase project settings under API

### How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add the following variables:
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: Your Supabase project URL
   - Environment: Production (and Preview if needed)

   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: Your Supabase anonymous key
   - Environment: Production (and Preview if needed)

5. Click "Save"
6. Redeploy your application

### Verification

After setting the environment variables and redeploying:

1. Order submission should work properly
2. If environment variables are missing, users will see a clear error message
3. No false success messages will be shown

### Troubleshooting

- Make sure the environment variable names start with `NEXT_PUBLIC_` for client-side access
- Verify your Supabase credentials are correct
- Check the browser console for any error messages
- If the database is unavailable, users will be informed that their order cannot be processed 