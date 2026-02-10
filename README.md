# Gungstore

A Vite + React + TypeScript application with TailwindCSS and Shadcn UI components.

## Setup

### 1. Install dependencies:
```bash
npm install
```

### 2. Configure Supabase (for persistent order history)

The application uses Supabase to store order history permanently and enable real-time synchronization across multiple users. Without Supabase, orders will only be saved locally in the browser.

**Benefits of Supabase integration:**
- 🌐 **Multi-user synchronization**: When one user adds an order, all other users see it in real-time
- 💾 **Persistent storage**: Orders are saved permanently in the cloud
- 🔄 **Cross-device access**: Access the same order history from any device
- 📱 **Offline support**: App continues working offline, syncs when connection is restored

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Add your Supabase credentials to `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
4. Run the database migration (see `supabase/README.md` for details):
   - Option A: Use Supabase CLI to run migrations
   - Option B: Manually run the SQL from `supabase/migrations/20260210_create_orders_table.sql` in the Supabase SQL Editor

For detailed Supabase setup instructions, see [supabase/README.md](supabase/README.md).

**Note:** The app will work without Supabase configuration, but order history will only persist in browser localStorage (single-user, temporary storage).

## Development

Start development server:
```bash
npm run dev
```

## Building for Production

Build the application:
```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

## Deployment

**IMPORTANT**: Always deploy the contents of the `dist` folder, not the source code.

### GitHub Pages

1. Build your application: `npm run build`
2. Deploy the `dist` folder to your gh-pages branch
3. The repository includes configuration files in the `public` folder that will be copied to `dist` during build:
   - `.htaccess` - Ensures proper MIME types for Apache servers
   - `_headers` - Ensures proper MIME types for Netlify/Cloudflare Pages
   - `.nojekyll` - Prevents Jekyll processing on GitHub Pages
   - `404.html` - Handles client-side routing for SPAs (redirects all 404s to index.html)

### Other Static Hosts (Netlify, Vercel, Cloudflare Pages)

1. Set build command: `npm run build`
2. Set publish directory: `dist`
3. The `_headers` file will configure proper MIME types automatically.

### Manual Deployment

If you're deploying to a custom server:
1. Build: `npm run build`
2. Upload the contents of the `dist` folder (not the `dist` folder itself) to your web server
3. Ensure your server is configured to:
   - Serve `.js` and `.mjs` files with `application/javascript` MIME type
   - Serve `.jsx` files with `text/javascript` MIME type
   - Route all requests to `index.html` for client-side routing

## Troubleshooting

### 404 Errors on GitHub Pages Routes

If you get a 404 error when navigating directly to routes like `/history` on GitHub Pages:
1. Ensure the `404.html` file from the `public` folder is included in your deployment
2. This file handles client-side routing by redirecting to `index.html` while preserving the route
3. The issue is automatically resolved by the included `404.html` file - just rebuild and redeploy

### MIME Type Errors

If you see errors like "was blocked because of a disallowed MIME type", ensure:
1. You're deploying the built `dist` folder, not the source code
2. Your server is serving JavaScript files with the correct MIME type
3. The `.htaccess` or `_headers` files from the build are being used by your server
