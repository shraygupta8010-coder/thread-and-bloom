# Thread & Bloom - GitHub Push Script
# Run this after creating repository on GitHub

Write-Host "🚀 Thread & Bloom - GitHub Push Script" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Git status
Write-Host "📊 Checking Git status..." -ForegroundColor Yellow
git status
Write-Host ""

# Step 2: Stage all files
Write-Host "📦 Staging all changes..." -ForegroundColor Yellow
git add .
Write-Host "✅ All changes staged" -ForegroundColor Green
Write-Host ""

# Step 3: Create commit
Write-Host "💾 Creating commit..." -ForegroundColor Yellow
$commitMessage = @"
feat: Major restructure - separate frontend/backend + comprehensive docs

## Project Restructure
- ✅ Frontend moved to /frontend (Next.js 16 + TypeScript)
- ✅ Backend moved to /backend (Express + Supabase)
- ✅ Single 'npm run dev' starts both servers via concurrently

## Features Added
- ✅ Brand filtering system (12 premium brands)
- ✅ Maharaja, Rose Wood, Double Duty, Double Dhamaal, etc.
- ✅ Shop By filters cleaned (Size, Brand, Price only)
- ✅ Brand click redirects to /bedsheets with filter

## Product Updates
- ✅ All products converted to 3-piece sets (1 bedsheet + 2 pillow covers)
- ✅ Removed 'Lucent White' default color from system
- ✅ Fixed empty colors array bug
- ✅ 25+ products with proper descriptions

## Documentation Added
- ✅ 25+ SQL migration files
- ✅ Complete setup guides (Payment, Shipping, Admin)
- ✅ Under development HTML pages (2 versions)
- ✅ GitHub setup instructions
- ✅ Product integration guides

## Tech Stack
- Frontend: Next.js 16, TypeScript, Tailwind CSS, Zustand
- Backend: Express, TypeScript, Supabase PostgreSQL
- Payment: Razorpay integration
- Shipping: Shiprocket API
- Auth: Google OAuth + JWT + WhatsApp OTP
"@

git commit -m $commitMessage
Write-Host "✅ Commit created" -ForegroundColor Green
Write-Host ""

# Step 4: Reminder to create GitHub repo
Write-Host "⚠️  IMPORTANT: Create GitHub repository first!" -ForegroundColor Red
Write-Host ""
Write-Host "1. Go to: https://github.com/new" -ForegroundColor Cyan
Write-Host "2. Repository name: thread-and-bloom" -ForegroundColor Cyan
Write-Host "3. Description: Premium E-commerce Platform for Luxury Bedding & Home Decor" -ForegroundColor Cyan
Write-Host "4. Public repository" -ForegroundColor Cyan
Write-Host "5. Don't initialize with README (we have one)" -ForegroundColor Cyan
Write-Host "6. Click 'Create repository'" -ForegroundColor Cyan
Write-Host ""

# Ask user if repo is created
$response = Read-Host "Have you created the repository on GitHub? (y/n)"

if ($response -eq 'y' -or $response -eq 'Y') {
    Write-Host ""
    Write-Host "🔗 Adding remote repository..." -ForegroundColor Yellow
    
    # Check if remote already exists
    $remoteExists = git remote | Select-String -Pattern "origin"
    
    if ($remoteExists) {
        Write-Host "⚠️  Remote 'origin' already exists. Removing..." -ForegroundColor Yellow
        git remote remove origin
    }
    
    git remote add origin https://github.com/shraygupta8010-coder/thread-and-bloom.git
    Write-Host "✅ Remote added" -ForegroundColor Green
    Write-Host ""
    
    # Step 5: Rename branch to main
    Write-Host "🔄 Renaming branch to 'main'..." -ForegroundColor Yellow
    git branch -M main
    Write-Host "✅ Branch renamed" -ForegroundColor Green
    Write-Host ""
    
    # Step 6: Push to GitHub
    Write-Host "📤 Pushing to GitHub..." -ForegroundColor Yellow
    Write-Host "Note: You may need to authenticate with GitHub" -ForegroundColor Cyan
    Write-Host ""
    
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "🎉 SUCCESS! Code pushed to GitHub!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🔗 Repository URL:" -ForegroundColor Cyan
        Write-Host "https://github.com/shraygupta8010-coder/thread-and-bloom" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "✨ Next Steps:" -ForegroundColor Yellow
        Write-Host "1. Visit your repository on GitHub" -ForegroundColor White
        Write-Host "2. Add a nice README with screenshots" -ForegroundColor White
        Write-Host "3. Set up GitHub Actions (optional)" -ForegroundColor White
        Write-Host "4. Enable GitHub Pages for under-development.html (optional)" -ForegroundColor White
    } else {
        Write-Host ""
        Write-Host "❌ Push failed. Common issues:" -ForegroundColor Red
        Write-Host "1. Authentication required - use GitHub token or GitHub Desktop" -ForegroundColor Yellow
        Write-Host "2. Repository not created yet on GitHub" -ForegroundColor Yellow
        Write-Host "3. Network issues" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "🔧 Solution: Use GitHub Desktop app for easy authentication" -ForegroundColor Cyan
        Write-Host "Download: https://desktop.github.com/" -ForegroundColor Cyan
    }
} else {
    Write-Host ""
    Write-Host "⏸️  Script paused. Create the repository first and run again." -ForegroundColor Yellow
    Write-Host ""
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
