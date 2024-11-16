#!/bin/bash

# Print header
echo "==============================================="
echo "           Git Merge Helper Script             "
echo "==============================================="

# Get current branch
current_branch=$(git symbolic-ref --short HEAD)
echo -e "\n🌿 Current branch: $current_branch"

# Show status
echo -e "\n📊 Current status:"
git status

# Validate we're not on main
if [ "$current_branch" = "main" ]; then
    echo "❌ Error: You are currently on main branch. Please checkout the feature branch you want to merge."
    exit 1
fi

# Ensure working directory is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Error: Working directory is not clean. Please commit or stash changes first."
    exit 1
fi

# Fetch latest changes
echo -e "\n📥 Fetching latest changes..."
git fetch origin
git fetch origin main:main

# Check if branch is behind main
commits_behind=$(git rev-list --count HEAD..origin/main)
if [ "$commits_behind" -gt 0 ]; then
    echo "⚠️  Warning: Your branch is $commits_behind commits behind main."
    echo "❓ Would you like to rebase on main first? (recommended) (y/n)"
    read -r rebase_answer
    if [ "$rebase_answer" = "y" ]; then
        echo "🔄 Rebasing on main..."
        git rebase origin/main
        if [ $? -ne 0 ]; then
            echo "❌ Rebase failed. Please resolve conflicts and run the script again."
            exit 1
        fi
    fi
fi

# Confirm merge
echo -e "\n⚠️  You are about to merge '$current_branch' into 'main'"
echo "❓ Are you sure you want to continue? (y/n)"
read -r answer
if [ "$answer" != "y" ]; then
    echo "❌ Merge canceled"
    exit 0
fi

# Switch to main
echo -e "\n🔄 Switching to main branch..."
git checkout main
if [ $? -ne 0 ]; then
    echo "❌ Failed to switch to main branch"
    exit 1
fi

# Pull latest main
echo "📥 Pulling latest main..."
git pull origin main
if [ $? -ne 0 ]; then
    echo "❌ Failed to pull latest main"
    git checkout "$current_branch"
    exit 1
fi

# Merge the branch
echo -e "\n🔄 Merging $current_branch into main..."
git merge --no-ff "$current_branch"
merge_status=$?

if [ $merge_status -eq 0 ]; then
    # Push changes
    echo -e "\n📤 Pushing changes to main..."
    git push origin main
    
    if [ $? -eq 0 ]; then
        echo -e "\n❓ Delete the merged branch? (y/n)"
        read -r delete_answer
        if [ "$delete_answer" = "y" ]; then
            git branch -d "$current_branch"
            git push origin --delete "$current_branch"
            echo "✅ Branch deleted locally and remotely"
        fi
        echo "✅ Merge completed successfully!"
    else
        echo "❌ Failed to push to main"
        git checkout "$current_branch"
        exit 1
    fi
else
    echo "❌ Merge failed. Resolving conflicts needed."
    echo "Please resolve conflicts, commit, and try again."
    exit 1
fi
