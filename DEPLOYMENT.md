# Deployment Guide

## 🚀 Production Deployment

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git for version control
- Production server or hosting platform

## Build Process

### 1. Install Dependencies
```bash
npm install
```

### 2. Build for Production
```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### 3. Preview Production Build Locally
```bash
npm run preview
```

## Deployment Options

### Option 1: Vercel (Recommended)

**Automatic Deployment**
1. Push code to GitHub
2. Import project in Vercel
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. Deploy

**Manual Deployment**
```bash
npm install -g vercel
vercel --prod
```

### Option 2: Netlify

**Via Netlify CLI**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Via Git Integration**
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy

### Option 3: AWS S3 + CloudFront

**1. Build the application**
```bash
npm run build
```

**2. Upload to S3**
```bash
aws s3 sync dist/ s3://your-bucket-name --delete
```

**3. Configure CloudFront**
- Create CloudFront distribution
- Point to S3 bucket
- Configure custom domain
- Enable HTTPS

**4. Invalidate CloudFront cache**
```bash
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### Option 4: Traditional Web Server (Apache/Nginx)

**1. Build the application**
```bash
npm run build
```

**2. Copy dist folder to server**
```bash
scp -r dist/* user@server:/var/www/html/
```

**3. Configure Nginx**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

**4. Configure Apache (.htaccess)**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Option 5: Docker

**Dockerfile**
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Build and run**
```bash
docker build -t uk-packers-movers .
docker run -p 80:80 uk-packers-movers
```

## Environment Configuration

### Production Environment Variables

Create `.env.production`:
```bash
VITE_API_URL=https://api.yourcompany.com
VITE_ENV=production
VITE_ENABLE_ANALYTICS=true
VITE_GOOGLE_MAPS_API_KEY=your_production_key
```

### Security Checklist

- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up CSP headers
- [ ] Enable rate limiting
- [ ] Configure authentication
- [ ] Set up monitoring
- [ ] Enable error tracking
- [ ] Configure backups
- [ ] Set up CDN
- [ ] Enable compression

## Performance Optimization

### 1. Enable Compression
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
```

### 2. Set Cache Headers
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. Enable HTTP/2
```nginx
listen 443 ssl http2;
```

### 4. Use CDN
- CloudFlare
- AWS CloudFront
- Fastly
- Akamai

## Monitoring & Analytics

### Recommended Tools

**Error Tracking**
- Sentry
- Rollbar
- Bugsnag

**Analytics**
- Google Analytics
- Mixpanel
- Amplitude

**Performance Monitoring**
- New Relic
- Datadog
- AppDynamics

**Uptime Monitoring**
- Pingdom
- UptimeRobot
- StatusCake

## CI/CD Pipeline

### GitHub Actions Example

`.github/workflows/deploy.yml`
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Build
      run: npm run build
      env:
        VITE_API_URL: ${{ secrets.API_URL }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

## Post-Deployment

### 1. Verify Deployment
- [ ] Check all routes work
- [ ] Test role switching
- [ ] Verify API connections
- [ ] Test form submissions
- [ ] Check responsive design
- [ ] Verify SSL certificate

### 2. Performance Testing
```bash
# Lighthouse audit
npm install -g lighthouse
lighthouse https://yourdomain.com --view
```

### 3. Security Scan
```bash
# OWASP ZAP or similar
npm audit
```

## Rollback Strategy

### Quick Rollback
```bash
# Vercel
vercel rollback

# Netlify
netlify rollback

# Manual
git revert HEAD
npm run build
# Redeploy
```

## Maintenance

### Regular Tasks
- Monitor error logs
- Check performance metrics
- Update dependencies monthly
- Review security advisories
- Backup database regularly
- Test disaster recovery

### Dependency Updates
```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Update to latest
npx npm-check-updates -u
npm install
```

## Support & Troubleshooting

### Common Issues

**Build Fails**
- Check Node.js version
- Clear npm cache
- Delete node_modules and reinstall

**Routes Not Working**
- Configure server for SPA routing
- Check .htaccess or nginx config

**Environment Variables Not Loading**
- Ensure variables start with VITE_
- Rebuild after changing .env

**Performance Issues**
- Enable compression
- Use CDN
- Optimize images
- Enable caching

## Scaling Considerations

### Horizontal Scaling
- Load balancer configuration
- Multiple server instances
- Session management
- Database replication

### Vertical Scaling
- Increase server resources
- Optimize bundle size
- Code splitting
- Lazy loading

## Backup Strategy

### What to Backup
- Source code (Git)
- Environment variables
- SSL certificates
- Configuration files
- Database (when integrated)

### Backup Schedule
- Code: Continuous (Git)
- Config: Weekly
- Database: Daily
- Full system: Monthly

## Contact & Support

For deployment issues:
- Check documentation
- Review error logs
- Contact DevOps team
- Create support ticket
