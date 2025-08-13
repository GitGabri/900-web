# Vercel Deployment Setup

## Important: Project Cleanup Completed

The following changes have been made to fix the Vercel deployment:

1. **Static Files Removed**: Static HTML files that were conflicting with your Next.js application have been removed
2. **Tailwind CSS Added**: Added proper Tailwind CSS configuration and dependencies
3. **Duplicate CartProvider Removed**: Fixed duplicate CartProvider in layout and page
4. **Serverless Files Removed**: Removed unused serverless function handlers
5. **Configuration Updated**: Updated Next.js and Vercel configurations

## Environment Variables

To fix the order submission issues, you need to set up the following environment variables in your Vercel deployment:

### Required Environment Variables

1. **SUPABASE_URL**
   - Your Supabase project URL
   - Format: `https://your-project-id.supabase.co`

2. **SUPABASE_SERVICE_KEY**
   - Your Supabase service role key (not the anon key)
   - Found in your Supabase project settings under API → service_role key

### How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add the following variables:
   - Name: `SUPABASE_URL`
   - Value: Your Supabase project URL
   - Environment: Production (and Preview if needed)

   - Name: `SUPABASE_SERVICE_KEY`
   - Value: Your Supabase service role key
   - Environment: Production (and Preview if needed)

5. Click "Save"
6. Redeploy your application

### Verification

After setting the environment variables and redeploying:

1. Your Next.js application should be served instead of static files
2. Order submission should work properly through the `/api/orders` endpoint
3. If environment variables are missing, users will see a clear error message
4. Database operations are now handled server-side for better security

### Troubleshooting

- Make sure you're using the service role key (`SUPABASE_SERVICE_KEY`) and not the anon key
- Verify your Supabase credentials are correct
- Check the browser console for any error messages
- If the database is unavailable, users will be informed that their order cannot be processed
- If you still see static files being served, clear your Vercel cache and redeploy
- The order submission now uses server-side API routes for better security and reliability 