# LuxeBed & Bath - Architecture Diagram

## 🏗️ Application Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        LuxeBed & Bath                            │
│              Premium E-Commerce Frontend Application             │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │
                ┌───────────────┴───────────────┐
                │       Next.js 16 App Router    │
                │         TypeScript             │
                └───────────────┬───────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌───────────────┐      ┌────────────────┐     ┌──────────────┐
│   Pages (3)   │      │  Components (9)│     │  Stores (3)  │
├───────────────┤      ├────────────────┤     ├──────────────┤
│ • Homepage    │      │ • Header       │     │ • cartStore  │
│ • Shop        │◄────►│ • CategoryNav  │◄───►│ • authStore  │
│ • Checkout    │      │ • ProductCard  │     │ • uiStore    │
└───────────────┘      │ • QuickView    │     └──────────────┘
                       │ • FilterBar    │             │
                       │ • CartDrawer   │      (Zustand + 
                       │ • AuthModal    │      localStorage)
                       │ • MobileMenu   │
                       │ • Toast        │
                       └────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
                    ▼                       ▼
            ┌──────────────┐      ┌─────────────────┐
            │  Data Layer  │      │  Styling System │
            ├──────────────┤      ├─────────────────┤
            │ • Products   │      │ • Tailwind v4   │
            │   (16 items) │      │ • Custom Theme  │
            │ • Types      │      │ • Animations    │
            │ • Utils      │      │ • Responsive    │
            └──────────────┘      └─────────────────┘
```

---

## 📦 Component Hierarchy

```
App Layout
│
├── Header (Sticky)
│   ├── Logo
│   ├── Delivery Selector
│   ├── Search Bar
│   ├── Sign In Button → AuthModal
│   ├── Wishlist Icon
│   └── Cart Icon → CartDrawer
│
├── CategoryNav (Sticky)
│   └── Category Tabs (All, Bedsheets, Comforters, Towels, Blankets, Deals)
│
├── Page Content
│   │
│   ├── Homepage
│   │   ├── Hero Section
│   │   ├── Features Banner
│   │   ├── Best Sellers → ProductCard[]
│   │   ├── Deal of the Day → ProductCard[]
│   │   └── New Arrivals → ProductCard[]
│   │
│   ├── Shop Page
│   │   ├── FilterSidebar
│   │   ├── Sort Controls
│   │   └── Product Grid → ProductCard[]
│   │
│   └── Checkout Page
│       ├── Step Progress
│       ├── Step 1: Addresses
│       ├── Step 2: Review
│       ├── Step 3: Payment
│       └── Order Summary (Sticky)
│
├── Footer
│   ├── Brand Info
│   ├── Navigation Links
│   └── Copyright
│
└── Global Overlays (Portal-rendered)
    ├── MobileMenu (Slide-in Left)
    ├── CartDrawer (Slide-in Right)
    ├── QuickViewModal (Center)
    ├── AuthModal (Center)
    └── Toast Notifications (Bottom-Right)
```

---

## 🔄 State Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     Zustand Stores                           │
└─────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│  cartStore                                                     │
├───────────────────────────────────────────────────────────────┤
│  State:                                                        │
│  • items: CartItem[]                                          │
│  • couponCode: string | null                                  │
│  • couponDiscount: number                                     │
│                                                                │
│  Actions:                                                      │
│  • addItem(product, size, color, quantity)                   │
│  • removeItem(productId, size, color)                        │
│  • updateQuantity(productId, size, color, quantity)          │
│  • applyCoupon(code): boolean                                │
│  • removeCoupon()                                            │
│  • clearCart()                                               │
│                                                                │
│  Computed:                                                     │
│  • getSubtotal()                                             │
│  • getShipping() → Free if subtotal >= $50                   │
│  • getCouponAmount()                                         │
│  • getTotal()                                                │
│                                                                │
│  Persistence: localStorage → "luxebed-cart-storage"          │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│  authStore                                                     │
├───────────────────────────────────────────────────────────────┤
│  State:                                                        │
│  • user: User | null                                          │
│  • isAuthenticated: boolean                                   │
│                                                                │
│  Actions:                                                      │
│  • signIn(email, password): boolean                          │
│  • signUp(userData): boolean                                 │
│  • signOut()                                                 │
│  • addAddress(address)                                       │
│  • updateAddress(id, fields)                                 │
│  • deleteAddress(id)                                         │
│  • setDefaultAddress(id)                                     │
│  • getDefaultAddress(): Address | null                       │
│                                                                │
│  Persistence: localStorage → "luxebed-auth-storage"          │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│  uiStore (No Persistence - Session Only)                      │
├───────────────────────────────────────────────────────────────┤
│  State:                                                        │
│  • isCartOpen: boolean                                        │
│  • isMobileMenuOpen: boolean                                  │
│  • isAuthModalOpen: boolean                                   │
│  • authModalMode: 'signin' | 'signup'                        │
│  • quickViewProduct: Product | null                          │
│  • toasts: Toast[]                                           │
│                                                                │
│  Actions:                                                      │
│  • openCart(), closeCart(), toggleCart()                     │
│  • openMobileMenu(), closeMobileMenu()                       │
│  • openAuthModal(mode), closeAuthModal()                     │
│  • setQuickViewProduct(product)                              │
│  • addToast(message, type), removeToast(id)                 │
└───────────────────────────────────────────────────────────────┘
```

---

## 🛍️ Shopping Flow Diagram

```
┌──────────────┐
│   Homepage   │
└──────┬───────┘
       │
       ├─────► Browse Featured Products
       │
       └─────► Click "Shop Collection"
                      │
                      ▼
              ┌──────────────┐
              │   Shop Page  │
              └──────┬───────┘
                     │
                     ├─────► Apply Filters
                     │       (Category, Price, Size, Material, Rating)
                     │
                     ├─────► Sort Products
                     │       (Featured, Price, Rating)
                     │
                     └─────► Select Product
                             │
                ┌────────────┼────────────┐
                │            │            │
                ▼            ▼            ▼
        ┌─────────────┐  ┌──────────┐  ┌─────────────┐
        │ Quick View  │  │ Add to   │  │Product Page │
        │   Modal     │  │   Cart   │  │  (Future)   │
        └──────┬──────┘  └────┬─────┘  └─────────────┘
               │              │
               └──────┬───────┘
                      │
                      ▼
              ┌──────────────┐
              │ Cart Drawer  │
              └──────┬───────┘
                     │
                     ├─────► Update Quantities
                     │
                     ├─────► Apply Coupon Code
                     │
                     └─────► Click "Proceed to Checkout"
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
        ┌──────────────┐          ┌──────────────┐
        │ Authenticated│          │ Not Auth'd   │
        └──────┬───────┘          └──────┬───────┘
               │                         │
               │                         ▼
               │                  ┌──────────────┐
               │                  │  Auth Modal  │
               │                  │ Sign In/Up   │
               │                  └──────┬───────┘
               │                         │
               └─────────┬───────────────┘
                         │
                         ▼
                 ┌──────────────┐
                 │   Checkout   │
                 │   (3 Steps)  │
                 └──────┬───────┘
                        │
                        ├─────► Step 1: Select Address
                        │
                        ├─────► Step 2: Review Order
                        │
                        └─────► Step 3: Payment Method
                                │
                                ▼
                        ┌──────────────┐
                        │ Place Order  │
                        └──────┬───────┘
                               │
                               ▼
                        ┌──────────────┐
                        │ Confirmation │
                        │  (Order ID)  │
                        └──────────────┘
```

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│              Authentication Entry Points                     │
└─────────────────────────────────────────────────────────────┘

Path A: Voluntary Sign In
┌──────────────┐
│ Click "Sign  │
│ In" in Header│
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Auth Modal  │
│   Opens      │
└──────┬───────┘
       │
       ├─────► Choose "Sign In" Tab
       │       • Enter email & password
       │       • Click Sign In
       │
       └─────► Choose "Sign Up" Tab
               • Enter personal info
               • Enter delivery address
               • Click Create Account
                       │
                       ▼
               ┌──────────────┐
               │ Authenticated│
               │  User State  │
               └──────────────┘

Path B: Checkout Gate (Amazon Pattern)
┌──────────────┐
│ Guest User   │
│ Browses &    │
│ Adds to Cart │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Click        │
│ "Proceed to  │
│  Checkout"   │
└──────┬───────┘
       │
       ├─────► If Authenticated → Go to Checkout
       │
       └─────► If NOT Authenticated
               │
               ▼
        ┌──────────────┐
        │  Auth Modal  │
        │   Opens      │
        │ (Intercept)  │
        └──────┬───────┘
               │
               ├─────► Sign In (existing customer)
               │
               └─────► Sign Up (new customer with address)
                       │
                       ▼
               ┌──────────────┐
               │ Cart State   │
               │  PRESERVED   │
               └──────┬───────┘
                      │
                      ▼
               ┌──────────────┐
               │ Auto-redirect│
               │ to Checkout  │
               └──────────────┘
```

---

## 📱 Responsive Breakpoints

```
┌─────────────────────────────────────────────────────────────┐
│                    Responsive Design                         │
└─────────────────────────────────────────────────────────────┘

Mobile (< 640px)
┌──────────────┐
│ Hamburger    │ ← MobileMenu drawer
│ Menu         │
├──────────────┤
│ 1 Column     │
│ Products     │
│ Stack layout │
│ Touch UI     │
└──────────────┘

Tablet (640px - 1024px)
┌──────────────────────────┐
│ Simplified Nav           │
├──────────────────────────┤
│ Product │ Product        │
│ Grid    │ Grid           │
│ 2 Cols  │ 2 Cols         │
└──────────────────────────┘

Desktop (1024px - 1600px)
┌─────────────────────────────────────┐
│ Full Navigation with Search         │
├──────┬──────────────────────────────┤
│Filter│ Product │ Product │ Product  │
│Side- │ Grid    │ Grid    │ Grid     │
│bar   │ 3 Cols  │ 3 Cols  │ 3 Cols   │
└──────┴──────────────────────────────┘

Large Desktop (> 1600px)
┌────────────────────────────────────────────┐
│ Full Navigation - Max Width 1600px         │
├──────┬─────────────────────────────────────┤
│Filter│ Product │ Product │ Product │Product│
│Side- │ Grid    │ Grid    │ Grid    │Grid   │
│bar   │ 4 Cols  │ 4 Cols  │ 4 Cols  │4 Cols │
└──────┴─────────────────────────────────────┘
```

---

## 🎨 Styling Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  Tailwind CSS v4 Setup                       │
└─────────────────────────────────────────────────────────────┘

globals.css
├── @import Google Fonts (Inter)
├── @import tailwindcss
├── CSS Custom Properties
│   ├── --warm-off-white: #FAFAF9
│   ├── --soft-linen: #F5F5F0
│   ├── --slate-text: #1E293B
│   ├── --deep-navy: #0F172A
│   ├── --accent-emerald: #059669
│   └── --warm-amber: #D97706
├── Global Resets
├── Custom Scrollbar Styles
└── Animation Keyframes
    ├── fade-in, fade-in-up
    ├── scale-in
    ├── slide-in-left, slide-in-right
    └── float

Component Styling
├── Utility-First Approach
├── Responsive Prefixes (sm:, md:, lg:, xl:)
├── State Variants (hover:, focus:, active:, disabled:)
├── Custom Classes (animate-*, transition-*)
└── Inline Styles (rare, only for dynamic values)
```

---

## 🔄 Data Flow Example: Add to Cart

```
User Action: Click "Add to Cart" on Product Card
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│ ProductCard.tsx                                 │
│ • onClick handler triggered                     │
│ • Extracts: product, default size, default color│
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│ cartStore.addItem(product, size, color, 1)     │
│ • Check if item already exists (id+size+color) │
│ • If exists: increment quantity                │
│ • If new: add to items array                   │
│ • Auto-save to localStorage                    │
└─────────────────┬───────────────────────────────┘
                  │
                  ├────► Cart Badge Counter Updates
                  │      (via useCartStore hook)
                  │
                  ├────► Cart Total Recalculated
                  │      (getSubtotal, getShipping, getTotal)
                  │
                  └────► Toast Notification Shows
                         (via uiStore.addToast)
                                │
                                ▼
                         All Components Re-render
                         (that use cart state)
                                │
                                ├─► Header: Badge count
                                ├─► CartDrawer: Item list
                                └─► Checkout: Order summary
```

---

## 🚀 Build & Deployment Flow

```
Development
npm run dev
    │
    ├─► Next.js Dev Server
    ├─► Hot Module Replacement
    ├─► TypeScript Type Checking
    └─► Tailwind CSS JIT

Production Build
npm run build
    │
    ├─► TypeScript Compilation
    ├─► Route Optimization
    ├─► Static Page Generation
    │   ├─► / (Homepage)
    │   ├─► /shop
    │   └─► /checkout
    ├─► Image Optimization
    ├─► CSS Purge & Minification
    └─► JavaScript Bundling
            │
            ▼
    Build Output (.next/)
            │
            ▼
npm start
    │
    └─► Production Server (Port 3000)

Deployment Options
    │
    ├─► Vercel (Recommended)
    ├─► Netlify
    ├─► AWS Amplify
    ├─► Google Cloud
    └─► Self-Hosted (Node.js)
```

---

## 📦 Package Dependencies

```
Production Dependencies
├── next@16.4.0          → Framework
├── react@19.3.0         → UI Library
├── react-dom@19.3.0     → DOM Renderer
├── zustand@5.0.15       → State Management
└── lucide-react@1.55.0  → Icon Library

Dev Dependencies
├── typescript@5.x           → Type System
├── @types/node@20.x         → Node Types
├── @types/react@19.x        → React Types
├── @types/react-dom@19.x    → React DOM Types
├── tailwindcss@4.x          → CSS Framework
├── @tailwindcss/turbopack   → Turbopack Integration
├── eslint@9.x               → Linting
└── eslint-config-next       → Next.js ESLint Config
```

---

This architecture provides a scalable, maintainable, and performant foundation for a production e-commerce application! 🎉
