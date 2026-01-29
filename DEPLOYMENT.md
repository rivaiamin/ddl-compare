# Deployment Guide

This guide covers various deployment options for the DDL Compare tool.

## Local Development

The simplest way to run the tool is to open `index.html` directly in a web browser. No server is required for basic functionality.

### Using a Local Server (Recommended for Development)

For better development experience, use a local HTTP server:

#### Python
```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then open: `http://localhost:8000`

#### Node.js (http-server)
```bash
npm install -g http-server
http-server -p 8000
```

#### PHP
```bash
php -S localhost:8000
```

## Static Hosting Deployment

Since this is a client-side application, it can be deployed to any static hosting service.

### GitHub Pages

#### Automated Deployment (Recommended)

The project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically deploys to GitHub Pages.

**Setup:**
1. Push your code to a GitHub repository
2. Go to repository Settings > Pages
3. Under "Source", select **"GitHub Actions"** (not "Deploy from a branch")
4. Push to `main` or `master` branch - the workflow will automatically:
   - Run tests
   - Deploy to GitHub Pages
5. Your site will be available at `https://yourusername.github.io/repository-name`

**Manual Trigger:**
You can also manually trigger the deployment from the Actions tab in GitHub.

#### Manual Deployment (Alternative)

If you prefer manual deployment:

1. Push your code to a GitHub repository
2. Go to repository Settings > Pages
3. Select the branch (usually `main` or `master`)
4. Select the folder (usually `/` or `/docs`)
5. Your site will be available at `https://yourusername.github.io/repository-name`

**Note:** If using GitHub Pages, ensure all file paths are relative (they already are in this project).

### Netlify

1. Sign up/login at [netlify.com](https://netlify.com)
2. Drag and drop the project folder, OR
3. Connect your Git repository:
   - Click "New site from Git"
   - Select your repository
   - Build settings:
     - Build command: (leave empty)
     - Publish directory: `/` (root)
4. Deploy!

### Vercel

1. Sign up/login at [vercel.com](https://vercel.com)
2. Import your Git repository
3. Configure:
   - Framework Preset: Other
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
4. Deploy!

### Cloudflare Pages

1. Sign up/login at [cloudflare.com](https://cloudflare.com)
2. Go to Pages > Create a project
3. Connect your Git repository
4. Build settings:
   - Framework preset: None
   - Build command: (leave empty)
   - Build output directory: `/`
5. Deploy!

## Docker Deployment (Optional)

Create a `Dockerfile`:

```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t ddl-compare .
docker run -p 8080:80 ddl-compare
```

## Environment Considerations

### CDN Dependencies

The application uses CDN links for:
- Tailwind CSS
- FontAwesome
- Prism.js

If you need offline support or want to self-host:

1. Download the libraries
2. Update `index.html` to use local paths
3. Ensure all dependencies are included in your deployment

### CORS

Since this is a client-side tool, CORS is not an issue. All processing happens in the browser.

### File Size Limits

- Most browsers can handle SQL files up to several megabytes
- Very large files (>10MB) may cause performance issues
- Consider adding file size warnings in the UI for production

## Pre-deployment Checklist

- [ ] Test in multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Verify all features work correctly
- [ ] Check that all external CDN resources are accessible
- [ ] Test with various SQL file formats
- [ ] Verify mobile responsiveness (if applicable)
- [ ] Run tests: `pnpm test`
- [ ] Check linting: `pnpm run lint`
- [ ] Format code: `pnpm run format`

## Production Optimizations (Optional)

1. **Minify JavaScript:** Use tools like UglifyJS or Terser
2. **Compress Assets:** Enable gzip/brotli compression on your server
3. **Cache Control:** Set appropriate cache headers for static assets
4. **HTTPS:** Always use HTTPS in production

## Troubleshooting Deployment

### Issue: Styles not loading
- Check that `css/styles.css` is in the correct location
- Verify file paths are relative (not absolute)

### Issue: JavaScript errors
- Check browser console for errors
- Verify all JS files are loaded in correct order
- Ensure CDN resources are accessible

### Issue: Syntax highlighting not working
- Verify Prism.js CDN is accessible
- Check browser console for loading errors

## Support

For deployment issues, please open an issue on GitHub.
