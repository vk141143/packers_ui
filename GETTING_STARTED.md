# 🚀 Getting Started Guide

Welcome to the UK Packers & Movers Enterprise Platform!

## ⚡ Quick Start (5 Minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Open in Browser
Navigate to `http://localhost:5173`

### Step 4: Explore Dashboards
Use the **role switcher** in the top-right corner to test different user experiences:
- **Client** - Book moves and track jobs
- **Admin** - Manage operations
- **Crew** - Complete job tasks
- **Management** - View analytics

## 📚 What You'll Find

### 4 Complete Dashboards
1. **Client Portal** - Customer-facing interface
2. **Operations Dashboard** - Admin management
3. **Crew Portal** - Mobile-first field interface
4. **Management Dashboard** - Executive analytics

### 11 Functional Pages
- Dashboard overviews
- Job creation and booking
- History and tracking
- Crew assignment
- SLA monitoring
- Analytics and reporting

### 10 Reusable Components
- Professional UI elements
- Type-safe with TypeScript
- Styled with Tailwind CSS

## 🎯 First Steps

### 1. Explore the Client Dashboard
```
Navigate to: http://localhost:5173/client
```
- View active jobs
- Check KPI metrics
- Browse job history
- Try booking a move

### 2. Test Admin Operations
```
Switch role to: Admin
Navigate to: http://localhost:5173/admin
```
- View all jobs
- Create a new job
- Assign crew members
- Monitor SLA compliance

### 3. Experience Crew Interface
```
Switch role to: Crew
Navigate to: http://localhost:5173/crew
```
- View assigned jobs
- Click on a job to see details
- Complete checklist items
- Upload photos (simulated)

### 4. Review Management Analytics
```
Switch role to: Management
Navigate to: http://localhost:5173/management
```
- View business KPIs
- Check revenue trends
- Analyze performance metrics

## 📖 Understanding the Code

### Project Structure
```
src/
├── components/       # Reusable UI components
├── dashboards/       # Role-specific pages
├── data/            # Mock data
├── types/           # TypeScript definitions
├── utils/           # Helper functions
└── App.tsx          # Main routing
```

### Key Files to Review

**1. Types (`src/types/index.ts`)**
```typescript
// Understand the data models
export interface Job { ... }
export interface User { ... }
export type JobStatus = 'scheduled' | 'in-progress' | 'completed';
```

**2. Mock Data (`src/data/mockData.ts`)**
```typescript
// Sample data for development
export const mockJobs: Job[] = [ ... ];
export const mockUsers: User[] = [ ... ];
```

**3. Components (`src/components/common/`)**
```typescript
// Reusable UI elements
<Button variant="primary">Click Me</Button>
<StatusBadge status="in-progress" />
<SLATimer deadline="2024-01-15T09:00:00" />
```

**4. Routing (`src/App.tsx`)**
```typescript
// Role-based navigation
<Route path="/client/*" element={<ClientRoutes />} />
<Route path="/admin/*" element={<AdminRoutes />} />
```

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        600: '#2563eb', // Change this
      },
    },
  },
}
```

### Add New Pages
1. Create component in `src/dashboards/[role]/`
2. Add route in `src/App.tsx`
3. Add navigation item in role's nav array

### Modify Mock Data
Edit `src/data/mockData.ts`:
```typescript
export const mockJobs: Job[] = [
  {
    id: 'JOB-001',
    clientName: 'Your Client',
    // ... add your data
  },
];
```

## 🔧 Development Tips

### Hot Reload
Vite provides instant hot module replacement. Save any file and see changes immediately!

### TypeScript Errors
Check for type errors:
```bash
npx tsc --noEmit
```

### Format Code
Add Prettier (optional):
```bash
npm install -D prettier
npx prettier --write src/
```

### Lint Code
Add ESLint (optional):
```bash
npm install -D eslint
npx eslint src/
```

## 📱 Testing Responsive Design

### Desktop View (Default)
- Full sidebar navigation
- Multi-column layouts
- Expanded tables

### Tablet View (768px - 1024px)
- Resize browser window
- Responsive grid layouts
- Adapted navigation

### Mobile View (<768px)
- Use browser dev tools
- Single column layouts
- Touch-friendly buttons
- Crew dashboard optimized

## 🎓 Learning Path

### Day 1: Explore
- [ ] Run the application
- [ ] Test all 4 dashboards
- [ ] Click through all pages
- [ ] Review mock data

### Day 2: Understand
- [ ] Read TypeScript types
- [ ] Review component code
- [ ] Understand routing
- [ ] Check utility functions

### Day 3: Customize
- [ ] Modify colors
- [ ] Change mock data
- [ ] Add a new field
- [ ] Style adjustments

### Day 4: Extend
- [ ] Add a new page
- [ ] Create a component
- [ ] Add new route
- [ ] Implement feature

### Day 5: Integrate
- [ ] Plan API structure
- [ ] Set up API service
- [ ] Add React Query
- [ ] Connect first endpoint

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5173 | xargs kill
```

### Dependencies Not Installing
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Check Node version (need 18+)
node --version

# Update Node if needed
# Then reinstall dependencies
npm install
```

### TypeScript Errors
```bash
# Check for type errors
npx tsc --noEmit

# Common fixes:
# - Check import paths
# - Verify type definitions
# - Ensure all props are passed
```

## 📚 Documentation Reference

- **README.md** - Project overview
- **QUICKSTART.md** - This file
- **FEATURES.md** - Complete feature list
- **PROJECT_STRUCTURE.md** - Architecture details
- **DEPLOYMENT.md** - Production deployment
- **API_INTEGRATION.md** - Backend integration
- **ARCHITECTURE.md** - Visual diagrams
- **FILE_INDEX.md** - All files listed

## 🎯 Next Steps

### For Development
1. ✅ Get app running
2. ✅ Explore all features
3. ⏭️ Customize for your needs
4. ⏭️ Add authentication
5. ⏭️ Integrate with API
6. ⏭️ Deploy to production

### For Production
1. Replace mock data with API
2. Add authentication/authorization
3. Implement error handling
4. Add loading states
5. Set up monitoring
6. Configure CI/CD
7. Deploy to hosting

## 💡 Pro Tips

### Use Browser DevTools
- **React DevTools** - Inspect components
- **Network Tab** - Monitor API calls (future)
- **Console** - Check for errors
- **Responsive Mode** - Test mobile

### Keyboard Shortcuts
- `Ctrl/Cmd + S` - Save (auto-reload)
- `Ctrl/Cmd + Shift + I` - Open DevTools
- `Ctrl/Cmd + R` - Refresh page

### VS Code Extensions (Recommended)
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)
- Prettier - Code formatter
- ESLint

## 🤝 Getting Help

### Check Documentation
1. Read relevant .md files
2. Review code comments
3. Check TypeScript types

### Common Questions

**Q: How do I add a new dashboard page?**
A: Create component in `src/dashboards/[role]/`, add route in App.tsx

**Q: How do I change the color scheme?**
A: Edit `tailwind.config.js` colors section

**Q: How do I add real data?**
A: Follow `API_INTEGRATION.md` guide

**Q: How do I deploy?**
A: Follow `DEPLOYMENT.md` guide

**Q: Where are the types defined?**
A: Check `src/types/index.ts`

## 🎉 You're Ready!

You now have everything you need to:
- ✅ Run the application
- ✅ Understand the structure
- ✅ Customize the platform
- ✅ Add new features
- ✅ Deploy to production

## 🚀 Start Building!

```bash
# Let's go!
npm run dev
```

Open `http://localhost:5173` and start exploring!

---

**Need more help?** Check the other documentation files or review the code comments.

**Happy coding!** 🎊
