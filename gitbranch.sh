#!/bin/bash

# Print header
echo "==============================================="
echo "           Git Branch Helper Script            "
echo "==============================================="

# Show current branch and status
current_branch=$(git symbolic-ref --short HEAD)
echo -e "\n🌿 Current branch: $current_branch"
echo -e "\n📊 Current status:"
git status

# Function to create new branch
create_branch() {
    echo -e "\n📝 Enter branch type (feature/bugfix/hotfix/release):"
    read -r branch_type
    echo "💭 Enter branch description (use-hyphens-for-spaces):"
    read -r description
    new_branch="$branch_type/$description"
    
    echo -e "\n🔄 Creating branch: $new_branch"
    git checkout -b "$new_branch"
    echo "✅ Branch created and switched!"
}

# Function to cleanup merged branches
cleanup_branches() {
    echo -e "\n🧹 Cleaning up merged branches..."
    git fetch -p
    for branch in $(git branch --merged | grep -v "^\*" | grep -v "main" | grep -v "develop"); do
        echo "Deleting branch: $branch"
        git branch -d "$branch"
    done
    echo "✅ Cleanup complete!"
}

# Menu
echo -e "\n📋 Choose an action:"
echo "1. Create new branch"
echo "2. Cleanup merged branches"
echo "3. List all branches"
echo "4. Switch branch"
echo "5. Update current branch from develop"
echo "6. Exit"
read -r choice

case $choice in
    1) create_branch ;;
    2) cleanup_branches ;;
    3) 
        echo -e "\n📑 All branches:"
        git branch -a ;;
    4)
        echo -e "\n🔄 Available branches:"
        git branch
        echo -e "\n💭 Enter branch name to switch to:"
        read -r branch_name
        git checkout "$branch_name" ;;
    5)
        echo -e "\n🔄 Updating from develop..."
        git fetch origin
        git merge origin/develop
        echo "✅ Update complete!" ;;
    6) 
        echo "👋 Goodbye!"
        exit ;;
    *)
        echo "❌ Invalid choice" ;;
esac

echo -e "\n==============================================="