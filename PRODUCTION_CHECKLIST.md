# Production Deployment Checklist

## Pre-Deployment
- [ ] All environment variables set in hosting platform
- [ ] .env files NOT committed to git
- [ ] Build passes without errors
- [ ] CORS configured on backend APIs
- [ ] SSL certificates valid
- [ ] Database connections tested (if applicable)

## Security
- [ ] No hardcoded credentials
- [ ] API keys in environment variables only
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Rate limiting enabled on APIs

## Performance
- [ ] Assets minified and compressed
- [ ] Images optimized
- [ ] Lazy loading implemented
- [ ] CDN configured (if needed)

## Monitoring
- [ ] Error tracking setup (Sentry/LogRocket)
- [ ] Analytics configured
- [ ] Uptime monitoring enabled
- [ ] Log aggregation configured

## Testing
- [ ] All critical user flows tested
- [ ] Mobile responsiveness verified
- [ ] Cross-browser testing completed
- [ ] API endpoints responding correctly

## Post-Deployment
- [ ] Smoke tests passed
- [ ] Health check endpoint responding
- [ ] DNS propagated
- [ ] Backup strategy in place
- [ ] Rollback plan documented
