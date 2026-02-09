# WitchMart Deployment Guide

This guide covers deploying WitchMart to Azure App Service (Linux) using ZIP deployment.

## Prerequisites

- Azure subscription and Azure App Service (Linux) created
- Azure CLI installed (`az` command)
- Node.js 20+ installed locally
- Git repository cloned and ready

## Build & Deployment Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Project

Builds both the frontend (Vite) and backend (Node.js):

```bash
npm run build
```

This generates:
- `dist/public/` - Static frontend assets
- `dist/index.cjs` - Compiled backend server (CommonJS)

### 3. Create ZIP Deployment Package

The ZIP must include:
- `dist/` (compiled frontend + server)
- `node_modules/` (production dependencies)
- `package.json` and `package-lock.json`
- `data/` (data directory for JSON storage)

**Option A: Manual ZIP (for testing)**

```bash
# Ensure clean build
rm -rf dist node_modules
npm ci --omit=dev  # Production dependencies only
npm run build

# Create ZIP
# On Windows (PowerShell):
$items = @('dist', 'node_modules', 'package.json', 'package-lock.json', 'data')
Compress-Archive -Path $items -DestinationPath witchmart-deploy.zip

# On macOS/Linux:
zip -r witchmart-deploy.zip dist node_modules package.json package-lock.json data
```

**Option B: Automated Deployment (recommended)**

Use Azure App Service deployment from local Git or continuous deployment.

### 4. Deploy to Azure

#### Using Azure CLI

```bash
az login

# Deploy to existing App Service
az webapp deployment source config-zip \
  --resource-group <RESOURCE_GROUP> \
  --name <APP_SERVICE_NAME> \
  --src witchmart-deploy.zip
```

#### Using Azure Portal

1. Go to App Service → Deployment → Deployment Center
2. Select "Local Git" or "GitHub" source
3. Push your code (local Git) or link GitHub repository
4. Azure automatically builds and deploys

### 5. Configure Environment Variables

In Azure Portal:

1. Go to App Service → Settings → Configuration
2. Add Application Settings (environment variables):

```
PORT = 8000
NODE_ENV = production
DATABASE_URL = (if using PostgreSQL)
SESSION_SECRET = (generate a random secure value)
ENABLE_HECATES_HIGHWAY = true
ENABLE_SETAI_SERVICES = true
```

**Security Note:** Use Azure Key Vault for sensitive values (API keys, database credentials).

### 6. Enable Startup Command (if needed)

If the default startup doesn't work:

1. Go to App Service → Settings → Configuration
2. Under "General settings", set Startup Command:

```
node dist/index.cjs
```

Or with specific environment:

```
node --max-old-space-size=512 dist/index.cjs
```

### 7. Enable Data Persistence

The app uses JSON file storage in the `data/` directory.

**Important:** For production, consider:

- **Azure Blob Storage** - For persistent file storage across instances
- **Azure Database for PostgreSQL** - For relational data
- **AppInsights/Diagnostics** - For monitoring and logs

To persist `data/` directory across deployments:
1. Use Azure Blob Storage volume mount
2. Or implement database-backed storage instead

### 8. Verify Deployment

```bash
# Check health endpoint
curl https://<your-app>.azurewebsites.net/api/health

# Expected response:
# {"ok":true,"service":"witchmart","time":"2026-02-08T..."}

# Check version
curl https://<your-app>.azurewebsites.net/api/version
```

### 9. View Logs

```bash
# Stream live logs
az webapp log tail \
  --resource-group <RESOURCE_GROUP> \
  --name <APP_SERVICE_NAME>

# Or in Azure Portal:
# App Service → Diagnose and solve problems → Application Logs
```

## SSL/HTTPS Configuration

Azure App Service provides managed HTTPS certificates:

1. Go to App Service → Settings → TLS/SSL settings
2. Add custom domain (if applicable)
3. Secure with Azure-managed certificate (free)

## DNS Configuration

For custom domain:

1. **A Record** (root domain):
   ```
   Type: A
   Host: @
   Value: <Azure App Service IP>
   ```

2. **CNAME Record** (www subdomain):
   ```
   Type: CNAME
   Host: www
   Value: <your-app>.azurewebsites.net
   ```

3. **TXT Record** (domain verification):
   - Follow Azure Portal prompts for domain validation

## Production Checklist

- [ ] Environment variables configured
- [ ] Health endpoint responds at `/api/health`
- [ ] Static assets loading correctly
- [ ] API routes accessible at `/api/hecates-highway/*`
- [ ] Logs accessible and monitored
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active and valid
- [ ] Database connected (if using PostgreSQL)
- [ ] Data directory writable and persisted
- [ ] Security headers configured (CORS, CSP if needed)

## Troubleshooting

### App won't start
```bash
az webapp log tail --resource-group <RG> --name <APP>
# Check for missing dependencies, environment variables
```

### Port conflicts
- Azure App Service exposes port 8000 internally
- Always use `process.env.PORT` (defaults to 5000, overridden by Azure)

### Data loss
- JSON files in `data/` only persist on single-instance deployments
- For multi-instance or scaling, use Azure Storage or database

### Performance
- Enable "Always On" in App Service settings
- Use Application Insights for monitoring
- Scale horizontally if needed (multiple instances, load balancer)

## Local Development

For local testing before deployment:

```bash
# Development mode (with Vite hot reload)
npm run dev

# Production build and test
npm run build
npm start
```

## Rolling Back

To rollback to previous deployment:

```bash
# List deployment slots
az webapp deployment slot list \
  --resource-group <RESOURCE_GROUP> \
  --name <APP_SERVICE_NAME>

# Swap slots
az webapp deployment slot swap \
  --resource-group <RESOURCE_GROUP> \
  --name <APP_SERVICE_NAME> \
  --slot staging
```

Or redeploy previous ZIP package.

---

**Support:** For deployment issues, check Azure App Service documentation or contact Azure support.
