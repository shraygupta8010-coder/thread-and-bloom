# Fix node_modules issue and push to GitHub

Write-Host "🔧 Fixing node_modules issue..." -ForegroundColor Yellow
Write-Host ""

# Step 1: Remove node_modules from Git tracking
Write-Host "📦 Removing node_modules from Git cache..." -ForegroundColor Cyan
git rm -r --cached frontend/node_modules -f
git rm -r --cached backend/node_modules -f
git rm -r --cached node_modules -f

Write-Host "✅ node_modules removed from Git" -ForegroundColor Green
Write-Host ""

# Step 2: Commit changes
Write-Host "💾 Creating new commit without node_modules..." -ForegroundColor Cyan
git add .gitignore
git commit -m "fix: Remove node_modules from repository - Added explicit node_modules exclusions"

Write-Host "✅ Commit created" -ForegroundColor Green
Write-Host ""

# Step 3: Force push to GitHub
Write-Host "📤 Force pushing to GitHub..." -ForegroundColor Cyan
git push origin main --force

Write-Host ""
Write-Host "🎉 Done! Check GitHub repository" -ForegroundColor Green
Write-Host "https://github.com/shraygupta8010-coder/thread-and-bloom" -ForegroundColor Cyan
Write-Host ""
