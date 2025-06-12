# Update Environment Variables

## Get Your Supabase API Key:

1. Go to: https://supabase.com/dashboard/project/rfwnmztxsjjeoaffdhkk/settings/api
2. Copy the **anon public** key (starts with `eyJhbGci...`)

## Update .env.local:

Replace the `NEXT_PUBLIC_SUPABASE_ANON_KEY` line in your `.env.local` file with:

```bash
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_new_api_key_here
```

## Alternative: Create new .env.local from scratch:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://rfwnmztxsjjeoaffdhkk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_from_dashboard

# Stripe Configuration (optional for now)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

After updating, restart the dev server:
```bash
npm run dev
``` 