#!/bin/bash

# Print header
echo "==============================================="
echo "        Git Branch Content Fix Script          "
echo "==============================================="

# Get current branch name
current_branch=$(git symbolic-ref --short HEAD)
echo -e "\n🌿 Current branch: $current_branch"

# Show status
echo -e "\n📊 Current status:"
git status

# Show existing commits
echo -e "\n📜 Recent commits on this branch:"
git log --oneline -5

# Add and commit changes
echo -e "\n❓ Would you like to add and commit all changes? (y/n)"
read -r answer
if [ "$answer" = "y" ]; then
    echo -e "\n💭 Enter commit message:"
    read -r message
    echo -e "\n📝 Adding changes..."
    git add .
    echo "🔒 Committing changes..."
    git commit -m "$message"
    
    # Force push to remote
    echo -e "\n⬆️ Force pushing to GitHub..."
    git push -f origin "$current_branch"
    echo "✅ Changes pushed!"
else
    echo "❌ Operation canceled"
fi

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    exit 1
fi

# Add @supabase/supabase-js dependency if not present
if ! grep -q '"@supabase/supabase-js"' package.json; then
    echo "📦 Adding @supabase/supabase-js dependency..."
    npm install @supabase/supabase-js
fi

# Clean install dependencies
echo "🧹 Cleaning npm cache..."
npm cache clean --force

echo "🗑️  Removing node_modules..."
rm -rf node_modules

echo "🗑️  Removing package-lock.json..."
rm -f package-lock.json

echo "📦 Installing dependencies..."
npm install

echo "🔍 Verifying build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful! Ready to commit and push changes."
    
    # Stage changes
    git add package.json package-lock.json
    
    echo "❓ Would you like to commit and push these changes? (y/n)"
    read -r answer
    if [ "$answer" = "y" ]; then
        git commit -m "fix: add supabase dependency and update packages"
        git push
        echo "✅ Changes pushed successfully!"
    else
        echo "❌ Changes staged but not committed. You can commit them later."
    fi
else
    echo "❌ Build failed. Please check the error messages above."
fi

echo "==============================================="
