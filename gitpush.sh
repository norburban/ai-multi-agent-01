#!/bin/bash

# Print header
echo "==============================================="
echo "           Git Push Helper Script              "
echo "==============================================="

# Show git status
echo -e "\n📊 Current git status:"
git status

# Ask for confirmation
echo -e "\n❓ Continue with push? (y/n)"
read -r answer
if [ "$answer" != "y" ]; then
    echo "❌ Push canceled"
    exit
fi

# Get commit message
echo -e "\n💭 Enter commit message:"
read -r message

# Execute git commands
echo -e "\n📝 Adding changes..."
git add .

echo "🔒 Committing changes..."
git commit -m "$message"

echo "⬆️ Pushing to remote repository..."
git push origin main

echo -e "\n✅ Changes pushed successfully!"
echo "==============================================="