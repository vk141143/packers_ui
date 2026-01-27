# Production Deployment Checklist

## ✅ Code Optimizations (COMPLETED)
- [x] Map-based indexing in jobStore (O(1) lookups)
- [x] Debounced state updates (100ms batch)
- [x] React.lazy() for code splitting
- [x] Vite production build config
- [x] React.memo for components
- [x] Debounce hook for inputs

## 🔄 Backend Requirements (TODO)
- [ ] REST API with Express/Fastify
- [ ] PostgreSQL database with indexes
- [ ] Redis caching layer
- [ ] JWT authentication
- [ ] Rate limiting (100 req/min per user)
- [ ] API pagination (50 items/page)
- [ ] WebSocket for real-time updates

## 🔄 Infrastructure (TODO)
- [ ] AWS/Azure/GCP account setup
- [ ] Load balancer configuration
- [ ] Auto-scaling groups (2-20 instances)
- [ ] CDN setup (CloudFront/Cloudflare)
- [ ] SSL certificates
- [ ] Database backups (daily)
- [ ] Monitoring (New Relic/Datadog)

## 🔄 Security (TODO)
- [ ] HTTPS enforcement
- [ ] CORS configuration
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF tokens
- [ ] Input validation
- [ ] Rate limiting
- [ ] DDoS protection

## 🔄 Testing (TODO)
- [ ] Unit tests (Jest)
- [ ] Integration tests
- [ ] E2E tests (Playwright)
- [ ] Load testing (Artillery)
- [ ] Security scanning
- [ ] Lighthouse audit (score >90)

## Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Test build size
npm run build && du -sh dist/
```

## Environment Variables

```env
# .env.production
VITE_API_URL=https://api.ukpackers.co.uk
VITE_CDN_URL=https://cdn.ukpackers.co.uk
VITE_STRIPE_KEY=pk_live_xxx
VITE_MAPBOX_TOKEN=pk.xxx
```

## Performance Benchmarks

Run before deployment:
```bash
# Lighthouse
npx lighthouse https://your-domain.com --view

# Bundle size
npm run build
ls -lh dist/assets/

# Load test
artillery quick --count 1000 --num 50 https://your-domain.com
```

## Deployment Steps

1. Build production bundle
```bash
npm run build
```

2. Test production build locally
```bash
npm run preview
```

3. Deploy to CDN
```bash
aws s3 sync dist/ s3://your-bucket --delete
aws cloudfront create-invalidation --distribution-id XXX --paths "/*"
```

4. Verify deployment
```bash
curl -I https://your-domain.com
```

## Rollback Plan

```bash
# Revert to previous version
aws s3 sync s3://your-bucket-backup/ s3://your-bucket --delete
aws cloudfront create-invalidation --distribution-id XXX --paths "/*"
```

## Monitoring Alerts

- Response time >500ms
- Error rate >1%
- CPU usage >80%
- Memory usage >85%
- Disk usage >90%
- Failed health checks

## Support Contacts

- DevOps: devops@ukpackers.co.uk
- Backend: backend@ukpackers.co.uk
- Frontend: frontend@ukpackers.co.uk
