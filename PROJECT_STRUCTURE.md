# Project Structure

```
uk-packers-movers/
│
├── public/                          # Static assets
│   └── vite.svg                     # Application logo
│
├── src/                             # Source code
│   ├── components/                  # Reusable components
│   │   ├── common/                  # Common UI components
│   │   │   ├── Button.tsx           # Reusable button component
│   │   │   ├── DataTable.tsx        # Table component with sorting/filtering
│   │   │   ├── KPICard.tsx          # Dashboard metric cards
│   │   │   ├── SLATimer.tsx         # Real-time SLA countdown
│   │   │   ├── StatusBadge.tsx      # Job status indicators
│   │   │   └── index.ts             # Component exports
│   │   │
│   │   └── layout/                  # Layout components
│   │       ├── DashboardLayout.tsx  # Main dashboard wrapper
│   │       ├── Header.tsx           # Top navigation bar
│   │       ├── Sidebar.tsx          # Side navigation menu
│   │       └── index.ts             # Layout exports
│   │
│   ├── dashboards/                  # Dashboard pages by role
│   │   ├── client/                  # Client portal
│   │   │   ├── ClientDashboard.tsx  # Client overview page
│   │   │   ├── BookMove.tsx         # Book new move form
│   │   │   ├── JobHistory.tsx       # Past jobs with filters
│   │   │   └── ReportsInvoices.tsx  # Invoice management
│   │   │
│   │   ├── admin/                   # Operations portal
│   │   │   ├── AdminDashboard.tsx   # Operations overview
│   │   │   ├── CreateJob.tsx        # Create new job form
│   │   │   ├── AssignCrew.tsx       # Crew assignment interface
│   │   │   └── SLAMonitoring.tsx    # SLA tracking dashboard
│   │   │
│   │   ├── crew/                    # Crew portal (mobile-first)
│   │   │   ├── CrewDashboard.tsx    # Crew job list
│   │   │   └── JobDetails.tsx       # Job details with checklist
│   │   │
│   │   └── management/              # Management portal
│   │       └── ManagementDashboard.tsx  # Analytics & KPIs
│   │
│   ├── data/                        # Mock data
│   │   └── mockData.ts              # Sample jobs, users, invoices
│   │
│   ├── types/                       # TypeScript definitions
│   │   └── index.ts                 # Interfaces and types
│   │
│   ├── utils/                       # Utility functions
│   │   └── helpers.ts               # Date, currency, SLA helpers
│   │
│   ├── App.tsx                      # Main app with routing
│   ├── main.tsx                     # Application entry point
│   └── index.css                    # Global styles + Tailwind
│
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
├── index.html                       # HTML entry point
├── package.json                     # Dependencies and scripts
├── postcss.config.js                # PostCSS configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
├── tsconfig.node.json               # TypeScript config for Node
├── vite.config.ts                   # Vite build configuration
├── README.md                        # Project documentation
└── QUICKSTART.md                    # Quick start guide
```

## Key Directories

### `/src/components/common`
Reusable UI components used across all dashboards:
- Buttons, tables, cards, badges, timers
- Fully typed with TypeScript
- Styled with Tailwind CSS

### `/src/components/layout`
Layout components that wrap dashboard pages:
- Sidebar navigation
- Header with user info
- Main dashboard layout wrapper

### `/src/dashboards`
Role-specific dashboard pages organized by user type:
- **client/** - Customer-facing portal
- **admin/** - Operations management
- **crew/** - Field worker interface
- **management/** - Executive analytics

### `/src/data`
Mock data for development and testing:
- Sample jobs with various statuses
- User profiles for each role
- Invoice records

### `/src/types`
TypeScript type definitions:
- User roles and permissions
- Job statuses and SLA types
- Data models for jobs, invoices, etc.

### `/src/utils`
Helper functions:
- Date/time formatting (UK format)
- Currency formatting (GBP)
- SLA calculations and status

## Component Hierarchy

```
App
├── BrowserRouter
│   └── Routes
│       ├── /client/* → ClientRoutes
│       │   └── DashboardLayout
│       │       ├── Sidebar (Client Nav)
│       │       ├── Header
│       │       └── Client Pages
│       │
│       ├── /admin/* → AdminRoutes
│       │   └── DashboardLayout
│       │       ├── Sidebar (Admin Nav)
│       │       ├── Header
│       │       └── Admin Pages
│       │
│       ├── /crew/* → CrewRoutes
│       │   └── DashboardLayout
│       │       ├── Sidebar (Crew Nav)
│       │       ├── Header
│       │       └── Crew Pages
│       │
│       └── /management/* → ManagementRoutes
│           └── DashboardLayout
│               ├── Sidebar (Management Nav)
│               ├── Header
│               └── Management Pages
```

## Routing Structure

- `/client` - Client dashboard
- `/client/book` - Book a move
- `/client/history` - Job history
- `/client/reports` - Reports & invoices
- `/admin` - Admin dashboard
- `/admin/create-job` - Create new job
- `/admin/assign-crew` - Assign crew
- `/admin/sla` - SLA monitoring
- `/crew` - Crew dashboard
- `/crew/job/:jobId` - Job details
- `/management` - Management dashboard

## Data Flow

1. **Mock Data** (`src/data/mockData.ts`)
   - Provides sample data for development
   - Replace with API calls in production

2. **Components** consume data via props
   - Type-safe with TypeScript interfaces
   - Formatted using utility functions

3. **User Actions** trigger alerts (demo)
   - Replace with API calls and state management
   - Add Redux/Context for global state

## Styling Approach

- **Tailwind CSS** for utility-first styling
- **Responsive Design** with mobile-first approach
- **Color System** based on UK enterprise standards
- **Consistent Spacing** using Tailwind's scale
- **Accessible** with proper contrast and focus states
