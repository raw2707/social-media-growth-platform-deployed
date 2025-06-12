# V0/Vercel Import & Deployment Guide

## 🚀 Complete Guide: Import to v0, Create Profile Dashboard & Deploy

### Step 1: Prepare Your Project for v0 Import

#### 1.1 Create a `.v0ignore` file to protect backend files
Create this file in your root directory to prevent v0 from modifying critical backend files:

```
# Backend Protection - DO NOT MODIFY
/app/api/
/lib/supabase.ts
/lib/stripe.ts
/lib/database.sql
/.env.local
/.env
/fixed-schema-deploy.sql
/simple-deploy.sql
/supabase/

# Database and deployment files
*.sql
/deploy-database.*
/DATABASE_DEPLOYMENT.md
/API_REFERENCE.md
/PROJECT_STATUS.md

# Node modules and build files
/node_modules/
/.next/
/package-lock.json
/pnpm-lock.yaml

# Environment and config (keep existing)
# v0 should not modify these
```

#### 1.2 Create a backup of critical backend files
```bash
mkdir -p backup/backend
cp -r app/api backup/backend/
cp -r lib backup/backend/
cp .env.local backup/backend/ 2>/dev/null || echo "No .env.local found"
cp fixed-schema-deploy.sql backup/backend/
```

### Step 2: Import to v0.dev

#### 2.1 Upload to v0
1. Visit [v0.dev](https://v0.dev)
2. Sign in with your GitHub/Vercel account
3. Click "Import project" or "New project"
4. Upload your entire project directory OR connect your GitHub repository
5. **IMPORTANT**: During import, specify that you want to keep existing backend infrastructure

#### 2.2 v0 Prompt Instructions
When prompted by v0, use this exact prompt:

```
I'm importing an existing Next.js social media growth platform with complete backend infrastructure. 

CRITICAL INSTRUCTIONS:
- DO NOT modify any files in /app/api/ directory
- DO NOT modify /lib/supabase.ts or /lib/stripe.ts  
- DO NOT modify any .sql files or database-related files
- DO NOT modify environment variables or configuration files
- Keep all existing backend APIs, database schema, and Stripe integration intact

WHAT I NEED:
- Create a modern profile dashboard at /app/dashboard/profile/page.tsx
- The dashboard should include:
  * User profile information display
  * Current subscription plan details
  * Usage statistics (followers gained, posts scheduled, etc.)
  * Account settings section
  * Billing/subscription management
  * Modern, responsive design with shadcn/ui components
  
USE EXISTING BACKEND:
- Use existing /api/plans endpoint for subscription data
- Use existing /api/subscriptions endpoint for user subscription info
- Use existing Supabase client from /lib/supabase.ts
- Follow existing TypeScript types and patterns

DESIGN REQUIREMENTS:
- Modern dashboard UI with sidebar navigation
- Dark/light mode support
- Mobile responsive
- Professional styling with gradients and modern components
- Statistics cards and charts for growth metrics
```

### Step 3: Profile Dashboard Structure

The dashboard should be created with this structure:

```
/app/dashboard/
├── layout.tsx              # Dashboard layout with sidebar
├── page.tsx               # Dashboard overview
├── profile/
│   └── page.tsx          # Profile management page
├── billing/
│   └── page.tsx          # Billing & subscription page
├── analytics/
│   └── page.tsx          # Growth analytics page
└── settings/
    └── page.tsx          # Account settings page
```

### Step 4: Key Components to Request from v0

#### 4.1 Dashboard Layout (`/app/dashboard/layout.tsx`)
```typescript
// Request v0 to create a dashboard layout with:
- Sidebar navigation with sections: Overview, Profile, Analytics, Billing, Settings
- User avatar and basic info in sidebar header
- Mobile responsive hamburger menu
- Logout functionality
- Modern styling with shadcn/ui components
```

#### 4.2 Profile Page (`/app/dashboard/profile/page.tsx`)
```typescript
// Request v0 to create a profile page with:
- User information form (name, email, avatar)
- Current subscription plan display
- Account statistics (join date, total followers gained, etc.)
- Social media accounts connection status
- Profile picture upload functionality
- Save/update profile functionality using existing APIs
```

#### 4.3 Analytics Dashboard (`/app/dashboard/analytics/page.tsx`)
```typescript
// Request v0 to create analytics with:
- Growth charts and metrics
- Platform-specific statistics (Instagram, TikTok, YouTube, Twitter)
- Monthly/weekly performance summaries
- Goal tracking and progress indicators
- Export functionality for reports
```

### Step 5: Deployment to Vercel

#### 5.1 Environment Variables Setup
Before deploying, ensure these environment variables are set in Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://rfwnmztxsjjeoaffdhkk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmd25tenR4c2pqZW9hZmZkaGhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3OTA0MzcsImV4cCI6MjA2NDM2NjQzN30.B0is894Zicf9knrmvDYxItwX8m_u9XUKINkcyOkycXc
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-domain.vercel.app
```

#### 5.2 Vercel Deployment Steps
1. **Connect Repository**: Link your GitHub repo to Vercel
2. **Configure Build Settings**:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Environment Variables**: Add all required env vars in Vercel dashboard

4. **Deploy**: Click "Deploy" and wait for build completion

### Step 6: Post-Deployment Checklist

#### 6.1 Verify Backend APIs
Test these endpoints after deployment:
- `https://your-domain.vercel.app/api/plans`
- `https://your-domain.vercel.app/api/subscriptions`
- `https://your-domain.vercel.app/api/coupons/validate`

#### 6.2 Test Dashboard Functionality
- User authentication flow
- Profile data loading and updating
- Subscription plan display
- Billing management
- Analytics data visualization

### Step 7: Prompt Templates for v0

#### For Dashboard Layout:
```
Create a modern dashboard layout for a social media growth platform. Include:
- Responsive sidebar with navigation (Overview, Profile, Analytics, Billing, Settings)
- Top header with user avatar and logout
- Mobile hamburger menu
- Dark/light mode toggle
- Use shadcn/ui components and Tailwind CSS
- Gradient backgrounds and modern styling
```

#### For Profile Page:
```
Create a comprehensive profile management page with:
- User information form (name, email, bio)
- Profile picture upload with preview
- Current subscription plan display with upgrade options
- Account statistics cards (join date, followers gained, etc.)
- Connected social media accounts section
- Save/update functionality using fetch API
- Form validation and loading states
- Modern card-based layout with shadcn/ui
```

#### For Analytics Dashboard:
```
Create a growth analytics dashboard with:
- Key metrics cards (total followers, engagement rate, growth rate)
- Interactive charts for follower growth over time
- Platform breakdown (Instagram, TikTok, YouTube, Twitter)
- Monthly and weekly performance summaries
- Goal tracking with progress bars
- Data export functionality
- Responsive grid layout with chart.js or recharts
- Modern design with shadcn/ui components
```

### Step 8: Protecting Your Backend During Development

#### 8.1 Version Control Strategy
```bash
# Create a protected branch for backend
git checkout -b backend-protected
git add app/api/ lib/ *.sql
git commit -m "Protect backend infrastructure"

# Work on frontend in main branch
git checkout main
```

#### 8.2 File Monitoring
Create a simple script to monitor backend file changes:

```bash
# monitor-backend.sh
#!/bin/bash
echo "Monitoring backend files for unauthorized changes..."
find app/api lib -name "*.ts" -o -name "*.js" | entr -p echo "Backend file modified: $_"
```

### Step 9: Final Integration

After v0 creates your dashboard:

1. **Merge carefully**: Review all changes before accepting
2. **Test APIs**: Ensure backend endpoints still work
3. **Update imports**: Make sure new components use existing backend
4. **Style consistency**: Ensure new components match your brand
5. **Mobile testing**: Verify responsive design works
6. **Performance**: Check bundle size and loading times

## 🛡️ Critical Protection Measures

### Files v0 Should NEVER Modify:
- `/app/api/*` - All API routes
- `/lib/supabase.ts` - Database client
- `/lib/stripe.ts` - Payment processing
- `*.sql` - Database schema files
- `.env.local` - Environment variables
- `/supabase/*` - Supabase configuration

### What v0 CAN Modify:
- `/components/*` - UI components
- `/app/dashboard/*` - Dashboard pages (new)
- `/styles/*` - Styling files
- `/public/*` - Static assets
- Frontend utilities and helpers

## 📞 Support

If v0 attempts to modify protected files:
1. Stop the generation immediately
2. Restore from backup
3. Re-prompt with stronger protection instructions
4. Contact v0 support if needed

This guide ensures your complete backend infrastructure remains intact while adding a beautiful, functional profile dashboard through v0's AI-powered frontend generation. 