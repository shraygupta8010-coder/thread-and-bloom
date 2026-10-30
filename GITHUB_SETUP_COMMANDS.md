# GitHub Repository Setup Commands for Thread & Bloom

## 📋 Your GitHub Profile
- **Username**: shraygupta8010-coder
- **Profile**: https://github.com/shraygupta8010-coder
- **Existing Repos**: 1 (smart-campus-connect)

## 🎯 New Repository Details
- **Name**: thread-and-bloom
- **Description**: Premium E-commerce Platform for Luxury Bedding & Home Decor
- **Tech Stack**: Next.js, Express.js, TypeScript, Supabase, Razorpay, Shiprocket

## 🚀 Step-by-Step Setup

### Step 1: Create Repository on GitHub (Browser)

1. Go to: https://github.com/new
2. Fill in:
   - **Repository name**: `thread-and-bloom`
   - **Description**: `Premium E-commerce Platform for Luxury Bedding & Home Decor | Next.js + Express + Supabase + Razorpay`
   - **Visibility**: Public ✅ (recommended) or Private
   - **Initialize**: ❌ Don't add README, .gitignore, or license (already exists in project)
3. Click **"Create repository"**

### Step 2: Check Current Git Status

```powershell
cd d:\bedsheet
git status
```

### Step 3: Stage All Files (if needed)

```powershell
# Check what files will be committed
git status

# Add all files
git add .

# Check status again
git status
```

### Step 4: Create Initial Commit (if needed)

```powershell
# If no commits exist, create first commit
git commit -m "Initial commit: Thread & Bloom E-commerce Platform

- Frontend: Next.js 16 with TypeScript, Tailwind CSS
- Backend: Express.js with TypeScript, Supabase PostgreSQL
- Features: Razorpay payments, Shiprocket shipping, Google OAuth
- Products: 25+ premium bedding items with brand filtering
- UI: Responsive design with dark mode support
- Authentication: JWT + Google OAuth + Password Reset via WhatsApp OTP
- Admin Portal: Order management, inventory tracking, dispatch system"
```

### Step 5: Link to GitHub Remote

```powershell
# Add remote repository
git remote add origin https://github.com/shraygupta8010-coder/thread-and-bloom.git

# Verify remote was added
git remote -v
```

### Step 6: Rename Branch to 'main' (if needed)

```powershell
# Check current branch
git branch

# Rename to main if needed
git branch -M main
```

### Step 7: Push to GitHub

```powershell
# Push code to GitHub
git push -u origin main
```

If you get authentication error, you'll need to:
- Use GitHub Personal Access Token (classic)
- Or use GitHub Desktop app
- Or authenticate via browser

### Step 8: Verify on GitHub

Visit: https://github.com/shraygupta8010-coder/thread-and-bloom

## 🔐 GitHub Authentication Options

### Option A: Personal Access Token (Classic)

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Select scopes:
   - ✅ repo (Full control of private repositories)
   - ✅ workflow (if using GitHub Actions)
4. Generate and copy token
5. When pushing, use token as password:
   ```
   Username: shraygupta8010-coder
   Password: [paste your token here]
   ```

### Option B: GitHub Desktop (Easy)

1. Download: https://desktop.github.com/
2. Sign in with GitHub account
3. Add repository: `d:\bedsheet`
4. Push to GitHub with one click

### Option C: GitHub CLI (Advanced)

```powershell
# Install GitHub CLI first
winget install GitHub.cli

# Authenticate
gh auth login

# Create and push repo
gh repo create thread-and-bloom --public --source=. --push
```

## 📝 Recommended .gitignore Additions

Add these to `.gitignore` if not already present:

```
# Environment variables
.env
.env.local
.env*.local

# Node modules
node_modules/
frontend/node_modules/
backend/node_modules/

# Build outputs
.next/
frontend/.next/
frontend/out/
backend/dist/

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Database
*.sqlite
*.sqlite3

# Temporary files
*.log
.cache/
```

## 📚 Useful Git Commands

```powershell
# Check status
git status

# View commit history
git log --oneline --graph --all

# View remote repositories
git remote -v

# Pull latest changes
git pull origin main

# Push changes
git push origin main

# Create new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main

# View differences
git diff
```

## 🎨 Repository README.md Suggestion

Create a professional README with:

```markdown
# 🛏️ Thread & Bloom

Premium E-commerce Platform for Luxury Bedding & Home Decor

## 🌟 Features

- 🛍️ **E-commerce Platform**: Full-featured online store
- 💳 **Razorpay Integration**: Secure online payments
- 📦 **Shiprocket Integration**: Automated shipping & tracking
- 🔐 **Authentication**: Google OAuth + JWT + WhatsApp OTP
- 📱 **Responsive Design**: Mobile, tablet, desktop optimized
- 🎨 **Dark Mode**: Theme support
- 👨‍💼 **Admin Portal**: Order & inventory management
- 🔍 **Brand Filtering**: Smart product filtering system

## 🛠️ Tech Stack

**Frontend:**
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (State Management)

**Backend:**
- Express.js
- TypeScript
- Supabase (PostgreSQL)
- JWT Authentication

**Integrations:**
- Razorpay Payment Gateway
- Shiprocket Shipping API
- Google OAuth 2.0
- WhatsApp Business API

## 🚀 Getting Started

\`\`\`bash
# Install dependencies
npm run install:all

# Run development servers
npm run dev
\`\`\`

Frontend: http://localhost:3000
Backend: http://localhost:5000

## 📝 License

Private - All Rights Reserved
\`\`\`

## 🔗 Quick Links

- **GitHub Repository**: https://github.com/shraygupta8010-coder/thread-and-bloom
- **Your Profile**: https://github.com/shraygupta8010-coder
- **Issues**: https://github.com/shraygupta8010-coder/thread-and-bloom/issues

## 📞 Support

For questions or issues, create an issue on GitHub or contact the maintainer.

---

**Happy Coding! 🚀**
