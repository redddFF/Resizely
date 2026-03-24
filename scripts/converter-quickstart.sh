#!/usr/bin/env bash

# ============================================================================
# QUICK START GUIDE - Image & PDF Converter Implementation
# ============================================================================
#
# This script sets up and verifies the converter implementation is working.
# Run this after cloning/pulling the latest code.
#
# Usage: bash scripts/converter-quickstart.sh
# ============================================================================

set -e

echo "🚀 Resizely Converter - Quick Start Setup"
echo "=========================================="
echo ""

# ============================================================================
# 1. Check Node.js and npm
# ============================================================================
echo "1️⃣  Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js $NODE_VERSION"

if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm first."
    exit 1
fi

NPM_VERSION=$(npm -v)
echo "✅ npm $NPM_VERSION"
echo ""

# ============================================================================
# 2. Install dependencies
# ============================================================================
echo "2️⃣  Installing dependencies..."

if npm list sharp &>/dev/null; then
    echo "✅ sharp already installed"
else
    echo "📦 Installing sharp..."
    npm install sharp
fi

if npm list pdf-lib &>/dev/null; then
    echo "✅ pdf-lib already installed"
else
    echo "📦 Installing pdf-lib..."
    npm install pdf-lib
fi

echo ""

# ============================================================================
# 3. Verify TypeScript
# ============================================================================
echo "3️⃣  Verifying TypeScript..."
npx tsc --noEmit
echo "✅ TypeScript compilation successful"
echo ""

# ============================================================================
# 4. Check API routes exist
# ============================================================================
echo "4️⃣  Verifying API routes..."

API_ROUTES=(
    "app/api/convert-image/resize.ts"
    "app/api/convert-image/compress.ts"
    "app/api/convert-image/convert.ts"
    "app/api/convert-pdf/merge.ts"
    "app/api/convert-pdf/split.ts"
    "app/api/convert-pdf/pdf-to-word.ts"
)

for route in "${API_ROUTES[@]}"; do
    if [ -f "$route" ]; then
        echo "✅ $route"
    else
        echo "❌ Missing: $route"
        exit 1
    fi
done
echo ""

# ============================================================================
# 5. Check components exist
# ============================================================================
echo "5️⃣  Verifying components..."

COMPONENTS=(
    "components/tools/FileUpload.tsx"
    "components/tools/ImageToolPage.tsx"
    "components/tools/PDFToolPage.tsx"
    "components/tools/DownloadButton.tsx"
)

for component in "${COMPONENTS[@]}"; do
    if [ -f "$component" ]; then
        echo "✅ $component"
    else
        echo "❌ Missing: $component"
        exit 1
    fi
done
echo ""

# ============================================================================
# 6. Check utilities exist
# ============================================================================
echo "6️⃣  Verifying utilities..."

if [ -f "utils/fileHelpers.ts" ]; then
    echo "✅ utils/fileHelpers.ts"
else
    echo "❌ Missing: utils/fileHelpers.ts"
    exit 1
fi
echo ""

# ============================================================================
# 7. Check dynamic routes exist
# ============================================================================
echo "7️⃣  Verifying dynamic routes..."

ROUTES=(
    "app/tools/image/[slug]/page.tsx"
    "app/tools/pdf/[slug]/page.tsx"
)

for route in "${ROUTES[@]}"; do
    if [ -f "$route" ]; then
        echo "✅ $route"
    else
        echo "❌ Missing: $route"
        exit 1
    fi
done
echo ""

# ============================================================================
# 8. Build project
# ============================================================================
echo "8️⃣  Building project..."
npm run build > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Project build successful"
else
    echo "❌ Build failed. Try: npm run build"
    exit 1
fi
echo ""

# ============================================================================
# 9. Summary & Next Steps
# ============================================================================
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "📋 NEXT STEPS:"
echo "1. Start development server:"
echo "   npm run dev"
echo ""
echo "2. Visit tool pages:"
echo "   http://localhost:3000/tools/image/resize"
echo "   http://localhost:3000/tools/image/compress"
echo "   http://localhost:3000/tools/image/convert"
echo "   http://localhost:3000/tools/pdf/merge"
echo "   http://localhost:3000/tools/pdf/split"
echo ""
echo "3. Test API endpoints with curl:"
echo "   curl -X POST http://localhost:3000/api/convert-image/resize \\"
echo "     -F 'file=@test.jpg' \\"
echo "     -F 'width=800' \\"
echo "     -F 'height=600'"
echo ""
echo "4. Read documentation:"
echo "   - CONVERTER_IMPLEMENTATION.md (full API reference)"
echo "   - CONVERTER_VERIFICATION.ts (deployment checklist)"
echo "   - IMPLEMENTATION_SUMMARY.md (project status)"
echo ""
echo "📚 Documentation files:"
ls -lh CONVERTER_*.md IMPLEMENTATION_SUMMARY.md 2>/dev/null | awk '{print "   " $9 " (" $5 ")"}'
echo ""
echo "🎯 Key Files:"
echo "   API Routes:"
ls -1 app/api/convert-*/*.ts | sed 's/^/   /'
echo ""
echo "   Components:"
ls -1 components/tools/{FileUpload,ImageToolPage,PDFToolPage,DownloadButton}.tsx | sed 's/^/   /'
echo ""
echo "   Dynamic Routes:"
ls -1 app/tools/*/\[slug\]/page.tsx | sed 's/^/   /'
echo ""
echo "🚀 You're ready to go!"
echo ""
