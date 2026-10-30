# Thread & Bloom - Luxury Bedding & Living Platform

A complete e-commerce solution with automated payment (Razorpay) and shipping (Shiprocket) integration.

## 🏗️ Project Structure

```
d:\bedsheet\
├── frontend/          # Next.js 16.4 Frontend
│   ├── app/          # Next.js App Router
│   ├── components/   # React Components
│   ├── lib/          # API & Utilities
│   ├── store/        # Zustand State Management
│   ├── public/       # Static Assets
│   └── package.json
│
├── backend/          # Node.js Express Backend
│   ├── src/
│   │   ├── controllers/  # Route Controllers
│   │   ├── middleware/   # Auth, Rate Limiting
│   │   ├── routes/       # API Routes
│   │   ├── services/     # Shiprocket, WhatsApp
│   │   └── utils/        # Helpers
│   └── package.json
│
└── package.json      # Root Package (Manages Both)
```

## 🚀 Quick Start

### Single Command (Recommended)
```bash
# Start both frontend & backend
npm run dev
```

### Individual Commands
```bash
# Frontend only (port 3000)
npm run dev:frontend

# Backend only (port 5000)
npm run dev:backend
```

## 📦 Installation

```bash
# Install all dependencies (root, frontend, backend)
npm run install:all
```

## 🔧 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_XXX
NEXT_PUBLIC_GOOGLE_CLIENT_ID=XXX.apps.googleusercontent.com
```

### Backend (.env)
```env
PORT=5000
FRONTEND_URL=http://localhost:3000
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx
RAZORPAY_KEY_ID=rzp_test_XXX
RAZORPAY_KEY_SECRET=xxx
WHATSAPP_PHONE_NUMBER_ID=xxx
WHATSAPP_ACCESS_TOKEN=xxx
SHIPROCKET_EMAIL=xxx
SHIPROCKET_PASSWORD=xxx
```

## 🌐 URLs

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000
- **Health Check:** http://localhost:5000/api/health

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend & backend |
| `npm run build` | Build production bundles |
| `npm run start` | Start production servers |
| `npm run install:all` | Install all dependencies |

## ✨ Features

- ✅ Razorpay Payment Integration
- ✅ Shiprocket Shipping Automation
- ✅ WhatsApp Notifications (OTP, Orders)
- ✅ Google OAuth Login
- ✅ Password Reset with OTP
- ✅ Admin Dashboard
- ✅ Order Tracking
- ✅ Inventory Management

## 🛠️ Tech Stack

**Frontend:**
- Next.js 16.4 (Turbopack)
- React 19.3
- TypeScript
- Tailwind CSS 4
- Zustand (State Management)

**Backend:**
- Node.js + Express
- TypeScript
- Supabase (Database)
- JWT Authentication
- Rate Limiting

**Integrations:**
- Razorpay (Payments)
- Shiprocket (Shipping)
- WhatsApp Business API
- Google OAuth

## 📱 Port Forwarding (VS Code)

1. Run `npm run dev`
2. Open **PORTS** tab in VS Code
3. Forward ports **3000** & **5000**
4. Set visibility to **Public**
5. Share the forwarded URLs!

## 🔐 Security

- JWT-based authentication
- Rate limiting on all routes
- Input validation & sanitization
- CORS protection
- Secure password hashing

## 📄 License

UNLICENSED - Private Project

---

Made with ❤️ for Thread & Bloom
