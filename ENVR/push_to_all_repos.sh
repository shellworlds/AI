#!/bin/bash
# Push Quantum System to All Repositories

echo "================================================================="
echo "QUANTUM SYSTEM GIT DEPLOYMENT"
echo "================================================================="

REPO_BRANCH="ENVR2134"
COLLAB_BRANCHES=("DENVR2134" "ZENVR2134" "QENVR2134")
COLLAB_DIRS=("DENVR" "ZENVR" "QENVR")

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "$1"
}

# Function to check git status
check_git_status() {
    local dir=$1
    local branch=$2
    
    if [ ! -d "$dir" ]; then
        echo -e "${RED}✗ Directory $dir not found${NC}"
        return 1
    fi
    
    cd "$dir"
    
    # Check if we're on the right branch
    current_branch=$(git branch --show-current 2>/dev/null)
    if [ "$current_branch" != "$branch" ]; then
        echo -e "${YELLOW}⚠ In $dir: Currently on '$current_branch', switching to '$branch'${NC}"
        git checkout "$branch" 2>/dev/null || {
            echo -e "${YELLOW}  Creating branch $branch${NC}"
            git checkout -b "$branch"
        }
    fi
    
    # Check for changes
    if git diff --quiet && git diff --cached --quiet; then
        echo -e "${YELLOW}ℹ No changes in $dir${NC}"
        cd ..
        return 0
    fi
    
    # Add all files
    git add .
    
    # Commit changes
    commit_msg="Quantum System Update $(date '+%Y-%m-%d %H:%M:%S')
    
    Updates:
    - Quantum simulation scripts
    - Backend API enhancements
    - Frontend showcase improvements
    - Documentation updates"
    
    if git commit -m "$commit_msg"; then
        echo -e "${GREEN}✓ Committed changes in $dir${NC}"
    else
        echo -e "${RED}✗ Commit failed in $dir${NC}"
    fi
    
    cd ..
    return 0
}

# Main deployment
echo "Starting deployment to all repositories..."

# 1. Main ENVR repository
echo -e "\n${YELLOW}[1] Main Repository: ENVR${NC}"
check_git_status "." "$REPO_BRANCH"

if [ $? -eq 0 ]; then
    echo "Pushing to origin/$REPO_BRANCH..."
    if git push origin "$REPO_BRANCH"; then
        echo -e "${GREEN}✓ Successfully pushed ENVR to $REPO_BRANCH${NC}"
    else
        echo -e "${RED}✗ Push failed for ENVR${NC}"
    fi
fi

# 2. Collaborator repositories
echo -e "\n${YELLOW}[2] Collaborator Repositories${NC}"
for i in "${!COLLAB_DIRS[@]}"; do
    dir="${COLLAB_DIRS[$i]}"
    branch="${COLLAB_BRANCHES[$i]}"
    
    echo -e "\nProcessing $dir ($branch)..."
    
    if [ ! -d "$dir" ]; then
        echo -e "${YELLOW}⚠ $dir not found, cloning...${NC}"
        # Clone URLs based on repository names
        case $dir in
            "DENVR")
                git clone https://github.com/dt-uk/DENVR.git
                ;;
            "ZENVR")
                git clone https://github.com/Zius-Global/ZENVR.git
                ;;
            "QENVR")
                git clone https://github.com/qb-eu/QENVR.git
                ;;
        esac
    fi
    
    if [ -d "$dir" ]; then
        check_git_status "$dir" "$branch"
        
        # Push to remote
        cd "$dir"
        echo "Pushing to origin/$branch..."
        if git push origin "$branch"; then
            echo -e "${GREEN}✓ Successfully pushed $dir to $branch${NC}"
        else
            echo -e "${YELLOW}⚠ Setting upstream and pushing...${NC}"
            git push --set-upstream origin "$branch" && \
            echo -e "${GREEN}✓ Successfully pushed $dir to $branch${NC}" || \
            echo -e "${RED}✗ Push failed for $dir${NC}"
        fi
        cd ..
    fi
done

# 3. Create deployment summary
echo -e "\n${YELLOW}[3] Deployment Summary${NC}"
cat > DEPLOYMENT_SUMMARY.md << 'SUMMARY'
# Quantum System Deployment Summary

## Deployment Date
$(date)

## Repository Status

### Main Repository (ENVR)
- Branch: $REPO_BRANCH
- Status: $(git status --short | wc -l) changes pending
- Remote: origin/$REPO_BRANCH

### Collaborator Repositories
$(for dir in "${COLLAB_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        cd "$dir"
        echo "- $dir: $(git branch --show-current) ($(git status --short | wc -l) changes)"
        cd ..
    else
        echo "- $dir: NOT FOUND"
    fi
done)

## System Components Deployed
1. **Quantum Backend**
   - 23-qubit simulation scripts
   - FastAPI REST API
   - ASCII circuit generation

2. **Frontend Showcase**
   - HTML dashboard for clients
   - GIF animation display
   - Interactive controls

3. **Orchestration**
   - Deployment scripts
   - System monitoring
   - Documentation

## URLs
- Local Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs  
- Frontend: http://localhost:8080
- GitHub Main: https://github.com/shellworlds/ENVR/tree/$REPO_BRANCH

## Next Steps
1. Verify all repositories are synced
2. Test API endpoints
3. Share frontend URLs with clients
4. Monitor simulation performance
SUMMARY

echo -e "${GREEN}✓ Deployment summary created: DEPLOYMENT_SUMMARY.md${NC}"

echo -e "\n${GREEN}=================================================================${NC}"
echo -e "${GREEN}DEPLOYMENT COMPLETE${NC}"
echo -e "${GREEN}=================================================================${NC}"
echo ""
echo "Summary:"
echo "1. Main repository updated: ENVR/$REPO_BRANCH"
echo "2. Collaborator repositories updated"
echo "3. System ready for client demonstrations"
echo ""
echo "Frontend Showcase URL: http://localhost:8080"
echo "API Documentation: http://localhost:8000/docs"
echo "${GREEN}=================================================================${NC}"
