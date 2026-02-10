# GitHub Pages Deployment Guide

## Problem 1: MIME Type Error

When accessing the deployed site at https://catarmory.net, you may encounter this error:
```
Loading module from "https://catarmory.net/src/main.tsx" was blocked because of a disallowed MIME type ("application/octet-stream").
```

### Root Cause

This error occurs when **source files are being served instead of the built application**. The browser is trying to load `/src/main.tsx` directly, which means:

1. The source code directory is being deployed instead of the built `dist` folder
2. The web server is serving `.tsx` and `.js` files with the wrong MIME type (`application/octet-stream` instead of `application/javascript`)

## Problem 2: 404 Error on Routes

When accessing routes directly (e.g., https://catarmory.net/history), you may see:
```
404 - File not found
```

### Root Cause

GitHub Pages serves static files and doesn't natively support client-side routing used by Single Page Applications (SPAs). When you navigate directly to a route like `/history`, GitHub Pages looks for a physical file at that path, which doesn't exist because routing is handled client-side by React Router.

## Solution

### Step 1: Build the Application

Always build the application before deploying:

```bash
npm install
npm run build
```

This creates an optimized production build in the `dist` folder.

### Step 2: Deploy the Correct Folder

**Deploy ONLY the contents of the `dist` folder**, not the repository root.

#### For GitHub Pages:

The included GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically:
- Builds the application
- Deploys the `dist` folder to GitHub Pages
- Includes MIME type configuration files

Just push to the `main` branch and the workflow will handle deployment.

#### For Manual Deployment:

1. Build: `npm run build`
2. Upload **only** the contents of the `dist` folder to your web server
3. Ensure the MIME type configuration files are present (they're automatically copied from `public/`)

### Step 3: Configure Your Web Server (If Needed)

The build process automatically includes these configuration files in the `dist` folder:

- **`.htaccess`** - For Apache servers (GitHub Pages uses this)
- **`_headers`** - For Netlify/Cloudflare Pages  
- **`.nojekyll`** - Prevents Jekyll processing on GitHub Pages
- **`404.html`** - Handles SPA client-side routing by redirecting 404s to index.html

These files ensure:
1. JavaScript modules are served with the correct MIME types
2. Direct navigation to any route (like `/history`) works correctly

### Step 4: Verify the Deployment

After deploying, verify:

1. The URL should load your application (not a file listing)
2. Opening browser DevTools → Network tab should show:
   - JavaScript files served as `application/javascript`
   - No errors about MIME types
   - Files loaded from the root (e.g., `/assets/index-abc123.js`), NOT from `/src/`

## Quick Checklist

- [ ] Run `npm run build` before deploying
- [ ] Deploy the `dist` folder (not the repository root)
- [ ] Ensure `.htaccess`, `_headers`, `.nojekyll`, and `404.html` are in the deployed folder
- [ ] Verify JavaScript files are served with correct MIME type
- [ ] Verify direct navigation to routes (like `/history`) works without 404 errors
- [ ] Clear browser cache if you still see errors after redeploying

## Additional Notes

- Never commit the `dist` folder to your repository (it's in `.gitignore`)
- The build process is deterministic - run it every time before deploying
- If using a custom domain, ensure DNS is properly configured
