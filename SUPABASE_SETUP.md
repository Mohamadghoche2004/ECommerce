# Supabase Storage Setup

## Environment Variables

Make sure you have the following environment variables set up in your Vercel deployment:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON=your-supabase-anon-key
MONGODB_URI=your-mongodb-connection-string
```

## Supabase Storage Setup Instructions

1. Create a Storage bucket in Supabase:
   - Log in to your Supabase dashboard
   - Navigate to "Storage" in the left sidebar
   - Click "Create bucket"
   - Name the bucket `images` (must match the name used in the code)
   - Set the bucket privacy setting to public

2. Set your bucket policies:
   - Click on the bucket you created
   - Go to "Policies"
   - Add a policy for anonymous users to view images (Select template: "Give anon users select access")
   - **IMPORTANT:** Add another policy to allow file uploads (Select template: "Give anon users insert access")

3. Update your environment variables:
   - Make sure `NEXT_PUBLIC_SUPABASE_URL` contains your Supabase project URL (e.g., `https://xxxxxxxxxxxx.supabase.co`)
   - Make sure `NEXT_PUBLIC_SUPABASE_ANON` contains your Supabase anon key
   - Make sure to add these in Vercel project settings under Environment Variables

4. Deploy your application
   - Add these environment variables to your Vercel project
   - Deploy to Vercel

## Local Development

For local development, create a `.env.local` file at the root of your project with the same variables: 