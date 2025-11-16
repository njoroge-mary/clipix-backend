#!/bin/bash

echo "=================================================="
echo "  PUSHING DOCKERFILE TO GITHUB"
echo "=================================================="
echo ""

cd /app/backend

echo "✓ Current commit:"
git log --oneline -1
echo ""

echo "✓ Files in commit:"
git ls-files | grep -E "(Dockerfile|requirements|server|video|caption|runtime)"
echo ""

echo "=================================================="
echo "  READY TO PUSH"
echo "=================================================="
echo ""
echo "Run this command to push to GitHub:"
echo ""
echo "  cd /app/backend && git push origin main --force"
echo ""
echo "After pushing, go to GitHub and verify Dockerfile is there:"
echo "https://github.com/njoroge-mary/clipix-backend"
echo ""
echo "=================================================="
