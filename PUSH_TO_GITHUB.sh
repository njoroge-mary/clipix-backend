#!/bin/bash

echo "=================================================="
echo "  CLIPIX BACKEND - PUSH TO GITHUB SCRIPT"
echo "=================================================="
echo ""

cd /app/backend

echo "✓ Current directory: $(pwd)"
echo ""

# Check if remote exists
if git remote | grep -q origin; then
    echo "⚠️  Remote 'origin' already exists. Removing it..."
    git remote remove origin
fi

# Add remote
echo "→ Adding GitHub remote..."
git remote add origin https://github.com/njoroge-mary/clipix-backend.git

echo ""
echo "→ Verifying files to be pushed:"
git ls-files

echo ""
echo "=================================================="
echo "  READY TO PUSH!"
echo "=================================================="
echo ""
echo "Run this command to push to GitHub:"
echo ""
echo "  cd /app/backend && git push -u origin main --force"
echo ""
echo "Or if you prefer HTTPS with token:"
echo ""
echo "  cd /app/backend && git push https://YOUR_TOKEN@github.com/njoroge-mary/clipix-backend.git main --force"
echo ""
echo "=================================================="
