# Gungstore

A Vite + React + TypeScript application with TailwindCSS and Shadcn UI components.

## Development

Install dependencies:
```bash
npm install
```

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
3. The repository includes `.htaccess`, `_headers`, and `.nojekyll` files in the `public` folder that will be copied to `dist` during build to ensure proper MIME types and routing.

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

### MIME Type Errors

If you see errors like "was blocked because of a disallowed MIME type", ensure:
1. You're deploying the built `dist` folder, not the source code
2. Your server is serving JavaScript files with the correct MIME type
3. The `.htaccess` or `_headers` files from the build are being used by your server
