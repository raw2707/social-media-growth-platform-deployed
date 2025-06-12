#!/bin/bash

echo "🚀 Preparing project for v0.dev import..."

# Check if backup exists
if [ ! -d "backup/backend" ]; then
    echo "❌ Backend backup not found. Creating backup..."
    mkdir -p backup/backend
    cp -r app/api backup/backend/ 2>/dev/null
    cp -r lib backup/backend/ 2>/dev/null
    cp fixed-schema-deploy.sql backup/backend/ 2>/dev/null
    echo "✅ Backend backup created"
else
    echo "✅ Backend backup already exists"
fi

# Check if .v0ignore exists
if [ ! -f ".v0ignore" ]; then
    echo "❌ .v0ignore file not found"
    echo "Please create .v0ignore file first (see V0_IMPORT_GUIDE.md)"
    exit 1
else
    echo "✅ .v0ignore file exists"
fi

# Verify critical files exist
echo "🔍 Verifying critical backend files..."

critical_files=(
    "app/api/plans/route.ts"
    "app/api/subscriptions/route.ts" 
    "app/api/checkout/route.ts"
    "lib/supabase.ts"
    "lib/stripe.ts"
)

all_exist=true
for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
        all_exist=false
    fi
done

if [ "$all_exist" = false ]; then
    echo "❌ Some critical files are missing. Cannot proceed with v0 import."
    exit 1
fi

echo ""
echo "🎯 V0.dev Import Instructions:"
echo "1. Visit https://v0.dev"
echo "2. Upload this entire project directory"
echo "3. Use the prompt from V0_IMPORT_GUIDE.md (Step 2.2)"
echo "4. Specifically request: 'DO NOT modify /app/api/ or /lib/ directories'"
echo ""
echo "🛡️ Protected files backed up to backup/backend/"
echo "📋 Full instructions available in V0_IMPORT_GUIDE.md"
echo ""
echo "✅ Project ready for v0.dev import!" 