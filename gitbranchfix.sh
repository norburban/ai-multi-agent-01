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

echo "==============================================="
