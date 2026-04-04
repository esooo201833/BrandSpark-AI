#!/bin/bash
# Setup guide for BrandSpark AI Database

echo "🚀 BrandSpark AI - Database Setup Guide"
echo "========================================"
echo ""

echo "✅ Step 1: Create a PostgreSQL Database"
echo "---------------------------------------"
echo "Option A: Using Docker (Recommended)"
echo "  docker run --name brandspark-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=brandspark -p 5432:5432 -d postgres:15"
echo ""
echo "Option B: Using Local PostgreSQL"
echo "  createdb brandspark"
echo ""

echo "✅ Step 2: Configure Environment"
echo "--------------------------------"
echo "Create a .env.local file with:"
echo ""
echo "# Database"
echo "DATABASE_URL=\"postgresql://postgres:password@localhost:5432/brandspark\""
echo ""
echo "# Add your API keys and secrets..."
echo ""

echo "✅ Step 3: Run Database Migrations"
echo "----------------------------------"
echo "  npm run prisma:migrate"
echo ""

echo "✅ Step 4: Seed Database (Optional)"
echo "----------------------------------"
echo "  npm run prisma:seed"
echo ""

echo "✅ Step 5: Start Development Server"
echo "-----------------------------------"
echo "  npm run dev"
echo ""

echo "🎉 Done! Your database is ready."
