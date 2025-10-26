<div align="center">
  <img src="public/github.png" alt="Hypelive Dashboard" width="80" height="80">

  <h1>Hypelive Dashboard</h1>

  <p>
    <strong>Professional KOL Management & Analytics Platform</strong>
    <br />
    Next.js 14 • React Server Components • TypeScript • Tailwind CSS
  </p>

  <p>
    <a href="https://dashboard.hypelive.studio">Live Demo</a>
    •
    <a href="https://hypelive.studio">Official Website</a>
    •
    <a href="#features">Features</a>
    •
    <a href="#tech-stack">Tech Stack</a>
  </p>
</div>

---

## 🚀 About Hypelive Dashboard

**Hypelive Dashboard** is a production-ready Key Opinion Leader (KOL) management and analytics platform built for marketing agencies and brands in Southeast Asia. The platform provides comprehensive tools for discovering, analyzing, and managing influencer partnerships.

<img src="public/preview.png" alt="Hypelive Dashboard Preview" width="100%">

### 🎯 Key Features

- **KOL Discovery & Search** - Advanced filtering and smart search for finding the perfect influencers
- **Real-time Analytics** - Track engagement rates, revenue, and campaign performance
- **Multi-platform Support** - TikTok, Instagram, YouTube, Facebook integration
- **Collaboration Pipeline** - Manage KOL partnerships from contact to campaign completion
- **Audience Demographics** - Detailed insights into follower demographics and reach
- **Export & Reporting** - Generate comprehensive reports in multiple formats

### 🏆 Performance Optimized

- ⚡ **Lighthouse Score**: 85-87/100
- 📦 **37% Bundle Size Reduction** through Server Component optimization
- 📐 **Perfect CLS**: 0.000 (zero layout shift)
- ⚡ **Excellent TBT**: 59-69ms (smooth interactions)
- 🚀 **Server-First Architecture**: 64% server components for optimal performance

---

## 🛠 Tech Stack

### Core Framework
- **Next.js 14.2** - React framework with App Router
- **React 18** - React Server Components and Suspense
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 3.4** - Utility-first styling

### UI Components
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - Beautifully designed components
- **Recharts** - Data visualization and charting
- **Lucide Icons** - Modern icon library

### State & Data Management
- **TanStack Query v5** - Server state management
- **TanStack Table v8** - Advanced data tables
- **Zustand 5** - Client state management
- **Zod** - Schema validation

### Performance & Optimization
- **Next.js Server Components** - Reduced JavaScript bundle
- **React Suspense** - Streaming SSR
- **Bundle Analyzer** - Performance monitoring
- **Lighthouse CI** - Automated performance audits

---

## 📊 Dashboard Pages

- **KOL Discovery** - Search and filter KOLs by platform, engagement, location
- **Website Analytics** - Traffic analysis and user behavior tracking
- **Default Dashboard** - Overview of key metrics and statistics
- **E-commerce** - Sales tracking and product performance
- **Project Management** - Task tracking and team collaboration
- **Hospital Management** - Patient records and appointment scheduling
- **Finance** - Financial reports and transaction monitoring
- **Crypto** - Cryptocurrency portfolio tracking
- **Sales** - Sales pipeline and customer management
- **File Manager** - Document organization and sharing
- **Academy** - Course management and student tracking

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/HypelivebytheHYPER/Hypelive-Dashboard-Mock-Up.git

# Navigate to project directory
cd Hypelive-Dashboard-Mock-Up

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://127.0.0.1:3200](http://127.0.0.1:3200) to view the dashboard.

### Build for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

### Performance Monitoring

```bash
# Run Lighthouse audit on production
npm run lighthouse

# Analyze bundle size
ANALYZE=true npm run build
```

---

## 📁 Project Structure

```
hypelive-dashboard/
├── app/                          # Next.js App Router pages
│   ├── dashboard/               # Dashboard pages
│   │   ├── kol-discovery/      # KOL management (Phase 1 optimized)
│   │   ├── website-analytics/  # Analytics dashboard
│   │   └── ...                 # Other dashboard pages
│   └── api/                    # API routes
├── components/                  # Reusable React components
│   ├── ui/                     # shadcn/ui components
│   └── magic-ui/               # Enhanced UI components
├── lib/                        # Utility functions and helpers
│   ├── api/                    # API client and server functions
│   ├── hooks/                  # Custom React hooks
│   └── utils/                  # Utility functions
├── public/                     # Static assets
├── scripts/                    # Build and deployment scripts
│   └── lighthouse-audit.mjs   # Performance monitoring
└── lighthouse-reports/         # Performance audit reports
```

---

## 🎨 Customization

### Theme Configuration

The dashboard uses Tailwind CSS with custom theme configuration:

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        // ...custom color scheme
      }
    }
  }
}
```

### Environment Variables

Create a `.env.local` file:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=your_api_url
LARK_APP_ID=your_lark_app_id
LARK_APP_SECRET=your_lark_app_secret

# Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

---

## 📈 Performance Metrics

### Production Performance (Lighthouse Audit)

| Page | Performance | FCP | LCP | TBT | CLS |
|------|-------------|-----|-----|-----|-----|
| KOL Discovery | Optimized | ~1s | ~3.8s | ~60ms | 0.000 |
| Website Analytics | 85/100 | 979ms | 3.97s | 59ms | 0.000 |
| Default Dashboard | 87/100 | 1.01s | 3.86s | 69ms | 0.000 |

### Optimization Achievements

- 📦 **37% bundle reduction** on KOL Discovery page
- ⚡ **55-70% TBT improvement** through Server Components
- 📐 **Perfect layout stability** (0.000 CLS)
- 🏗️ **64% server components** for optimal performance

---

## 🔐 Security

- ✅ HTTPS enforced on all pages
- ✅ Security headers configured (HSTS, CSP, X-Frame-Options)
- ✅ Environment variables for sensitive data
- ✅ Input validation with Zod schemas
- ✅ XSS protection enabled

---

## 📝 License

This project is proprietary software owned by Hypelive. All rights reserved.

---

## 🙏 Acknowledgments

Built with modern web technologies:
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Radix UI](https://www.radix-ui.com/) - UI primitives
- [Recharts](https://recharts.org/) - Data visualization
- [TanStack](https://tanstack.com/) - Table and Query libraries

---

## 📧 Contact & Support

**Hypelive Team**
- Website: [hypelive.studio](https://hypelive.studio)
- Dashboard: [dashboard.hypelive.studio](https://dashboard.hypelive.studio)
- Email: support@hypelive.studio

---

<div align="center">
  <p>Made with ❤️ by the Hypelive Team</p>
  <p>© 2025 Hypelive. All rights reserved.</p>
</div>
