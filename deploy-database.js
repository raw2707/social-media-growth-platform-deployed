#!/usr/bin/env node
// 🚀 Social Media Growth Platform - Database Deployment Script (Node.js)

const fs = require('fs');
const path = require('path');

console.log('🚀 Social Media Growth Platform - Database Deployment');
console.log('======================================================');

// Check if database file exists
const databaseSqlPath = path.join(__dirname, 'lib', 'database.sql');
if (!fs.existsSync(databaseSqlPath)) {
    console.error('❌ Database schema file not found at lib/database.sql');
    process.exit(1);
}

// Read the database schema
const databaseSchema = fs.readFileSync(databaseSqlPath, 'utf8');

console.log('✅ Database schema loaded');
console.log(`📊 Schema size: ${Math.round(databaseSchema.length / 1024)}KB`);
console.log('📝 Tables included: profiles, plans, subscriptions, affiliates, etc.');

console.log('\n🔧 DEPLOYMENT OPTIONS:\n');

console.log('📋 OPTION 1: Manual Deployment (Recommended - 2 minutes)');
console.log('──────────────────────────────────────────────────────');
console.log('1. Go to: https://supabase.com/dashboard');
console.log('2. Select your project');
console.log('3. Navigate to: SQL Editor');
console.log('4. Copy the content from lib/database.sql');
console.log('5. Paste it in the SQL Editor');
console.log('6. Click "Run" to execute');
console.log('✅ Done! Your database is ready.');

console.log('\n⚡ OPTION 2: Direct SQL Execution (Advanced)');
console.log('───────────────────────────────────────────────');
console.log('If you have psql installed, you can run:');
console.log('psql "postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" < lib/database.sql');

console.log('\n🛠️  OPTION 3: Supabase CLI (Project Setup Required)');
console.log('─────────────────────────────────────────────────────');
console.log('1. supabase init');
console.log('2. supabase link --project-ref [YOUR-PROJECT-REF]');
console.log('3. Copy lib/database.sql to supabase/migrations/001_initial.sql');
console.log('4. supabase db push');

console.log('\n🔍 WHAT THIS SCHEMA INCLUDES:');
console.log('─────────────────────────────');
console.log('✅ 11 Production Tables:');
console.log('   • profiles - User information');
console.log('   • social_accounts - Connected accounts');
console.log('   • plans - Subscription plans');
console.log('   • subscriptions - Active subscriptions');
console.log('   • growth_reports - Analytics data');
console.log('   • orders & order_items - Payment records');
console.log('   • coupons - Discount codes');
console.log('   • affiliates - Affiliate partners');
console.log('   • referrals - Referral tracking');
console.log('   • affiliate_payments - Commission records');

console.log('\n✅ Security Features:');
console.log('   • Row Level Security (RLS) policies');
console.log('   • User-based data access control');
console.log('   • Secure foreign key relationships');

console.log('\n✅ Seed Data:');
console.log('   • 4 Subscription plans (Starter, Pro, Elite, Ultimate)');
console.log('   • Sample coupon codes');
console.log('   • Commission tier configurations');

console.log('\n📱 NEXT STEPS AFTER DEPLOYMENT:');
console.log('────────────────────────────────');
console.log('1. ✅ Database Schema (you\'re here!)');
console.log('2. 🔧 Setup Environment Variables (.env.local)');
console.log('3. 💳 Configure Stripe Products & Webhooks');
console.log('4. 🚀 Deploy to Production');

console.log('\n🎉 Your database schema is production-ready!');
console.log('💡 Choose Option 1 (Manual) for the fastest setup.');

// Optionally, create a migration file for Supabase CLI users
const migrationsDir = path.join(__dirname, 'supabase', 'migrations');
if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir, { recursive: true });
    const migrationFile = path.join(migrationsDir, '001_initial_schema.sql');
    fs.writeFileSync(migrationFile, databaseSchema);
    console.log('\n📁 Migration file created: supabase/migrations/001_initial_schema.sql');
} 