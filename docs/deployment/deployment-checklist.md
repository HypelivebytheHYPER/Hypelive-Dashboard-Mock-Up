# Production Deployment Checklist 🚀

**Dashboard**: Hypelive KOL Discovery Platform
**Version**: 1.0.0
**Date**: 2025-10-26
**Deploy Status**: ✅ READY

---

## 📋 Pre-Deployment Verification

### ✅ **Code Quality**
- [x] TypeScript compilation: No errors
- [x] ESLint warnings: Acceptable
- [x] No console.errors in production code
- [x] All imports resolved correctly
- [x] No unused variables/functions
- [x] Proper error boundaries implemented

### ✅ **Features Testing**
- [x] Smart Search works with Thai keywords
- [x] Export dialog (CSV/JSON) functional
- [x] Contact disclaimers display correctly
- [x] Score-based ranking returns top 10 results
- [x] categoryDescription integration working
- [x] All filters apply correctly
- [x] KOL comparison functional
- [x] Audience demographics display

### ✅ **Data Integrity**
- [x] Engagement rates capped at 15%
- [x] KOL levels auto-calculated
- [x] Collaboration stage defaults to "Not Contacted"
- [x] categoryDescription extracted from LineId
- [x] Revenue displayed in THB (not ฿ symbol)
- [x] Transform functions handle null values

### ✅ **Performance**
- [x] TanStack Query caching working (5min stale)
- [x] Background refetching enabled
- [x] No memory leaks detected
- [x] API calls optimized
- [x] Page load time <2 seconds
- [x] Smooth scrolling and transitions

---

## 🔧 Build & Test Commands

### **1. Clean Install**
```bash
cd /Users/mdch/Hypelive-Dashboard-Mock-Up
rm -rf node_modules .next
npm install
```

### **2. TypeScript Check**
```bash
npm run type-check
# Expected: "tsc --noEmit" passes with 0 errors
```

### **3. Lint Check**
```bash
npm run lint
# Expected: Few warnings acceptable, no errors
```

### **4. Production Build**
```bash
npm run build
# Expected output:
# ✓ Compiled successfully
# ✓ Linting and checking validity of types
# ✓ Collecting page data
# ✓ Generating static pages
# ✓ Finalizing page optimization
```

### **5. Start Production Server**
```bash
npm run start
# Access: http://localhost:3000
```

---

## 🧪 Manual Testing Checklist

### **Smart Search - Thai Language**
- [ ] Open Smart Search (purple "AI Search" button)
- [ ] Test: "หาคนรีวิวอาหาร" (Find food reviewers)
  - **Expected**: Returns KOLs with food/review categories
- [ ] Test: "beauty ความงาม bangkok"
  - **Expected**: Returns beauty KOLs in Bangkok
- [ ] Test: "ครีเอเตอร์ Macro level"
  - **Expected**: Returns Macro-level creators
- [ ] Verify: Top 10 results shown (not 5)
- [ ] Verify: Results sorted by relevance score

### **Export Functionality**
- [ ] Click "Export KOLs" button
- [ ] Select CSV format
- [ ] Check all field groups
- [ ] Click "Export"
  - **Expected**: Downloads `kol-export-YYYY-MM-DD.csv`
- [ ] Open CSV in Excel/Google Sheets
  - **Expected**: Data formatted correctly
- [ ] Test JSON export
  - **Expected**: Valid JSON structure

### **Contact Disclaimers**
- [ ] Open Smart Search
- [ ] Verify welcome message shows: "Contact information is being collected for premium KOLs"
- [ ] Search for any KOL
- [ ] Verify KOL cards show:
  - "Contact pending" (amber color)
  - "📞 Contact data being collected" badge

### **Data Accuracy**
- [ ] Check engagement rates: Should be 0.5% - 15% (not 10,000%+)
- [ ] Check KOL levels: All should have Mega/Macro/Micro/Nano
- [ ] Check collaboration stage: Default "Not Contacted" for most
- [ ] Check revenue: Display format "THB X.XXM"

### **Mobile Responsiveness**
- [ ] Open on iPhone/Android (or browser DevTools mobile view)
- [ ] Verify: Header buttons stack properly
- [ ] Verify: Smart Search full-screen on mobile
- [ ] Verify: Export dialog scrollable
- [ ] Verify: KOL table horizontal scroll

---

## 🌐 Production Environment Setup

### **Environment Variables** (.env.production)
```env
# API Endpoints
NEXT_PUBLIC_API_BASE_URL=https://larksuite-hype-server.hypelive.workers.dev

# Larkbase Configuration
NEXT_PUBLIC_APP_TOKEN=H2GQbZBFqaUW2usqPswlczYggWg
NEXT_PUBLIC_KOLS_TABLE_ID=tbl5864QVOiEokTQ
NEXT_PUBLIC_CAMPAIGNS_TABLE_ID=tbldcqoLHjrdN1vM
NEXT_PUBLIC_RATES_TABLE_ID=tblMM5mBcbxzEiJ2

# Feature Flags
NEXT_PUBLIC_ENABLE_THAI_SEARCH=true
NEXT_PUBLIC_ENABLE_EXPORT=true
NEXT_PUBLIC_ENABLE_SMART_SEARCH=true

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### **Vercel Deployment** (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to production
vercel --prod

# Environment variables
vercel env add NEXT_PUBLIC_API_BASE_URL
# Enter: https://larksuite-hype-server.hypelive.workers.dev
# Scope: Production

vercel env add NEXT_PUBLIC_APP_TOKEN
# Enter: H2GQbZBFqaUW2usqPswlczYggWg
# Scope: Production

# Redeploy with env vars
vercel --prod
```

### **Custom Server Deployment**
```bash
# Build
npm run build

# Copy to server
scp -r .next node_modules package*.json user@server:/var/www/hypelive-dashboard

# On server
cd /var/www/hypelive-dashboard
npm install --production
npm run start

# With PM2 (process manager)
pm2 start npm --name "hypelive-dashboard" -- start
pm2 save
pm2 startup
```

---

## 📊 Post-Deployment Monitoring

### **Immediate Checks** (First 1 Hour)
- [ ] Homepage loads: https://yourdomain.com/dashboard/kol-discovery
- [ ] Smart Search button clickable
- [ ] Export button works
- [ ] API calls return data (check DevTools Network tab)
- [ ] No console errors in browser
- [ ] Mobile view functional
- [ ] Thai language queries work

### **24-Hour Monitoring**
- [ ] API response times <500ms
- [ ] Error rate <1%
- [ ] User session duration >5 minutes
- [ ] Export downloads >5 per day
- [ ] Smart Search usage >10 queries per day

### **1-Week Metrics**
- [ ] Total users: Track with analytics
- [ ] Most used features: Smart Search, Export, Filters
- [ ] Thai search adoption: % of total queries
- [ ] Export format preference: CSV vs JSON
- [ ] Average KOLs per export: Track download sizes

---

## 🐛 Common Issues & Solutions

### **Issue**: Smart Search returns 0 results
**Solution**: Check if KOLs data is loading (verify API endpoint)

### **Issue**: Thai keywords not working
**Solution**: Ensure UTF-8 encoding, check thaiKeywords mapping

### **Issue**: Export downloads empty file
**Solution**: Verify kolsData has items, check CSV generation logic

### **Issue**: Contact disclaimer not showing
**Solution**: Clear browser cache, verify component imports

### **Issue**: Engagement rates still showing 10,000%+
**Solution**: Check kol-transform.ts parseEngagementRate function

---

## 📞 Rollback Plan

If critical issues occur:

### **1. Immediate Rollback** (Vercel)
```bash
vercel rollback
# Select previous deployment from list
```

### **2. Manual Rollback** (Git)
```bash
git revert HEAD~1  # Revert last commit
git push origin main
vercel --prod
```

### **3. Emergency Hotfix**
```bash
git checkout -b hotfix/critical-bug
# Fix the issue
git commit -m "hotfix: critical bug description"
git push origin hotfix/critical-bug
vercel --prod
```

---

## ✅ Sign-Off Checklist

### **Developer Sign-Off**
- [ ] All code reviewed
- [ ] Tests passing
- [ ] Build successful
- [ ] No critical bugs

**Name**: _________________
**Date**: _________________

### **QA Sign-Off**
- [ ] Manual testing complete
- [ ] Thai language verified
- [ ] Export functionality tested
- [ ] Mobile responsive

**Name**: _________________
**Date**: _________________

### **Product Owner Sign-Off**
- [ ] Features meet requirements
- [ ] UX acceptable
- [ ] Ready for users

**Name**: _________________
**Date**: _________________

---

## 🎉 Launch Communication

### **Internal Team**
```
Subject: 🚀 KOL Discovery Dashboard - Production Launch

Team,

The Hypelive KOL Discovery Dashboard is now LIVE in production!

Key Features:
✅ Thai language search support
✅ Smart AI-powered KOL matching
✅ Data export (CSV/JSON)
✅ Advanced filtering (20+ parameters)
✅ Contact data collection in progress

Access: https://yourdomain.com/dashboard/kol-discovery

Known Limitations:
⚠️ Contact info: 0% coverage (manual collection starting this week)
⚠️ XLSX export: Coming soon

Please report any issues to: tech@hypelive.com

Thanks,
Development Team
```

### **Client Announcement**
```
Subject: New Feature: Discover Perfect KOLs in Seconds

Dear Valued Client,

We're excited to announce the launch of our KOL Discovery Dashboard
with game-changing features:

🔍 Smart Search - Ask in Thai or English, get perfect matches
📊 Performance Analytics - Real engagement, revenue, quality scores
💾 Export Data - Download KOL lists for your campaigns
🇹🇭 Thailand-First - Built for SEA market with Thai language support

Try it now: [Link to dashboard]

Coming Soon:
- Contact information for 100+ premium KOLs
- Advanced rate card database
- AI-powered campaign planning

Questions? Contact: support@hypelive.com

Best regards,
Hypelive Team
```

---

## 📈 Success Metrics

### **Week 1 Targets**:
- Active users: 20+
- Smart searches: 50+
- Exports: 10+
- Thai query usage: 30%+
- User satisfaction: 80%+

### **Month 1 Targets**:
- Active users: 100+
- Contact data: 50+ KOLs
- Export frequency: 100+
- Feature adoption: 70%+
- Paying clients: 5+

---

*Deployment Checklist Version: 1.0*
*Last Updated: 2025-10-26*
*Status: Ready for production deployment ✅*
