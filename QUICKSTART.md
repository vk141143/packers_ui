# Quick Start Guide

## Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Access the Application**
   - Open your browser to `http://localhost:5173`
   - Use the role switcher (top-right) to test different dashboards

## Testing Different Roles

### Client Portal (`/client`)
- View dashboard with active jobs
- Book a new move
- Check job history
- Download invoices

### Admin Portal (`/admin`)
- Manage all jobs
- Create new jobs
- Assign crew members
- Monitor SLA compliance

### Crew Portal (`/crew`)
- View assigned jobs
- Complete job checklists
- Upload before/after photos
- Mark jobs complete

### Management Portal (`/management`)
- View business KPIs
- Analyze revenue trends
- Monitor SLA performance
- Track top performers

## Key Features to Test

1. **SLA Timer** - Watch real-time countdown on jobs
2. **Status Badges** - Color-coded job statuses
3. **Data Tables** - Sortable, filterable job lists
4. **Photo Upload** - Crew can upload job photos
5. **Responsive Design** - Test on mobile for crew dashboard

## Mock Data

The application uses mock data located in `src/data/mockData.ts`. You can modify this file to test different scenarios.

## Building for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.

## Next Steps

1. Integrate with your backend API
2. Add authentication/authorization
3. Implement real-time updates (WebSockets)
4. Add payment processing
5. Integrate mapping services (Google Maps)
6. Add email notifications
7. Implement PDF generation for invoices
8. Add advanced analytics and reporting

## Troubleshooting

**Port already in use?**
- Change the port in `vite.config.ts` or kill the process using port 5173

**Dependencies not installing?**
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then reinstall

**Build errors?**
- Ensure you're using Node.js 18 or higher
- Check TypeScript errors: `npx tsc --noEmit`
