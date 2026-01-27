# UK Packers & Movers - Enterprise Platform

A professional, enterprise-grade web platform for UK-based Packers & Movers services, built with React, TypeScript, and Tailwind CSS.

## 🎯 Overview

This platform serves UK councils, landlords, insurers, and corporate clients with emergency and scheduled property moves, featuring SLA guarantees (24h/48h).

## 🏗️ Architecture

### Dashboards
1. **Client Dashboard** - Book moves, view history, manage invoices
2. **Operations (Admin) Dashboard** - Job management, crew assignment, SLA monitoring
3. **Crew Dashboard** - Mobile-first job tracking with checklists and photo uploads
4. **Management Dashboard** - Business analytics and KPIs

### Tech Stack
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Vite** - Build tool
- **Lucide React** - Icons
- **Framer Motion** - Smooth animations
- **Canvas Confetti** - Celebration effects

## 📁 Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── DataTable.tsx
│   │   ├── KPICard.tsx
│   │   ├── SLATimer.tsx
│   │   └── StatusBadge.tsx
│   └── layout/          # Layout components
│       ├── DashboardLayout.tsx
│       ├── Header.tsx
│       └── Sidebar.tsx
├── dashboards/
│   ├── client/          # Client portal pages
│   │   ├── ClientDashboard.tsx
│   │   ├── BookMove.tsx
│   │   ├── JobHistory.tsx
│   │   └── ReportsInvoices.tsx
│   ├── admin/           # Admin portal pages
│   │   ├── AdminDashboard.tsx
│   │   ├── CreateJob.tsx
│   │   ├── AssignCrew.tsx
│   │   └── SLAMonitoring.tsx
│   ├── crew/            # Crew portal pages
│   │   ├── CrewDashboard.tsx
│   │   └── JobDetails.tsx
│   └── management/      # Management portal pages
│       └── ManagementDashboard.tsx
├── data/
│   └── mockData.ts      # Mock data for demo
├── types/
│   └── index.ts         # TypeScript interfaces
├── utils/
│   └── helpers.ts       # Utility functions
├── App.tsx              # Main app with routing
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open browser to `http://localhost:5173`

### Build for Production
```bash
npm run build
```

## 🎨 Features

### ✨ NEW: Booking Animations
- **Price Estimation Animation** - 4-stage animated price calculation with confetti
- **Multi-Step Progress** - Animated progress indicators with checkmarks
- **Confetti Celebrations** - Delightful celebrations on key actions
- **Smooth Transitions** - Buttery-smooth animations between steps
- **Floating Backgrounds** - Animated gradient orbs for visual depth

📚 **[View Animation Documentation →](./ANIMATIONS_INDEX.md)**

### Client Portal
- Dashboard with active jobs overview
- Book new moves with SLA selection
- Job history with search and filters
- Invoice management with PDF downloads

### Operations (Admin) Portal
- Comprehensive job list with SLA tracking
- Create and manage jobs
- Assign crew members to jobs
- Real-time SLA monitoring with alerts

### Crew Portal (Mobile-First)
- View assigned jobs
- Interactive job checklists
- Before/after photo uploads
- Mark jobs as complete

### Management Portal
- Revenue and performance KPIs
- Monthly revenue trends
- Client type breakdown
- SLA compliance metrics
- Top performer tracking

## 🎯 Key Components

### StatusBadge
Displays job status with color-coded badges (Scheduled, In Progress, Completed, Cancelled)

### SLATimer
Real-time countdown timer with color indicators:
- Green: Safe (>12h remaining)
- Yellow: Warning (6-12h remaining)
- Red: Critical (<6h remaining)

### DataTable
Reusable table component with:
- Sortable columns
- Row click handlers
- Custom cell renderers

### KPICard
Dashboard metric cards with:
- Trend indicators
- Percentage changes
- Custom icons

## 🔐 Role-Based Access

The platform includes a demo role switcher (top-right corner) to test different user experiences:
- **Client** - Book and track moves
- **Admin** - Manage operations
- **Crew** - Execute jobs
- **Management** - View analytics

## 📱 Responsive Design

- Desktop-optimized layouts for admin and management
- Mobile-first design for crew dashboard
- Responsive tables and forms
- Touch-friendly interfaces

## 🎨 Design System

### Colors
- Primary: Blue (#2563eb)
- Success: Green
- Warning: Yellow
- Danger: Red
- Neutral: Gray scale

### Typography
- System fonts for optimal performance
- Clear hierarchy with font weights
- Accessible contrast ratios

## 🔄 Mock Data

The application uses mock data for demonstration. In production, integrate with your backend API by replacing the mock data imports with API calls.

## 📝 License

Proprietary - UK Packers & Movers Enterprise Platform

## 👥 Support

For support and inquiries, contact your system administrator.
