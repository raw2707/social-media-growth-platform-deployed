#!/bin/bash
# 🚀 Social Media Growth Platform - Database Deployment Script

echo "🚀 Social Media Growth Platform - Database Deployment"
echo "======================================================"

# Check if we have the required environment variables
if [ -z "$SUPABASE_PROJECT_REF" ] || [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo "❌ Missing required environment variables:"
    echo "   SUPABASE_PROJECT_REF - Your Supabase project reference ID"
    echo "   SUPABASE_ACCESS_TOKEN - Your Supabase access token"
    echo ""
    echo "🔧 To get these values:"
    echo "   1. Go to https://supabase.com/dashboard"
    echo "   2. Select your project"
    echo "   3. Go to Settings > General > Project Reference ID"
    echo "   4. Go to Settings > API > Project API keys > service_role key"
    echo ""
    echo "💡 Set them in your environment:"
    echo "   export SUPABASE_PROJECT_REF=your_project_ref"
    echo "   export SUPABASE_ACCESS_TOKEN=your_service_role_key"
    exit 1
fi

echo "✅ Environment variables found"
echo "📦 Project: $SUPABASE_PROJECT_REF"

# Login to Supabase
echo "🔐 Logging into Supabase..."
supabase auth login --token $SUPABASE_ACCESS_TOKEN

if [ $? -ne 0 ]; then
    echo "❌ Failed to login to Supabase"
    exit 1
fi

echo "✅ Successfully logged into Supabase"

# Deploy the database schema
echo "🗄️  Deploying database schema..."
echo "📂 Running lib/database.sql..."

# Use psql to execute the SQL file directly
SUPABASE_DB_URL="postgresql://postgres:[YOUR-PASSWORD]@db.${SUPABASE_PROJECT_REF}.supabase.co:5432/postgres"

echo "⚠️  You'll need to replace [YOUR-PASSWORD] with your database password"
echo "🔑 Database URL pattern: $SUPABASE_DB_URL"
echo ""
echo "📋 Manual steps:"
echo "1. Go to https://supabase.com/dashboard/project/$SUPABASE_PROJECT_REF/sql"
echo "2. Copy and paste the content of lib/database.sql"
echo "3. Click 'Run' to execute the schema"
echo ""
echo "🚀 Alternative: Use the supabase db push command with migrations"

# Optional: Create a migration file
echo "📁 Creating migration file for future use..."
mkdir -p supabase/migrations
cp lib/database.sql supabase/migrations/001_initial_schema.sql

echo "✅ Migration file created: supabase/migrations/001_initial_schema.sql"
echo ""
echo "🎉 Database deployment preparation complete!"
echo ""
echo "📖 Next steps:"
echo "   1. Manual: Copy lib/database.sql to Supabase SQL Editor"
echo "   2. Or use: supabase db push (requires project setup)"
echo "   3. Then run: npm run dev to start your application" 