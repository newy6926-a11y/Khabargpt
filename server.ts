import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { apiRouter } from './server/routes.js';
import { db } from './server/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  // Request body parsers (support base64 images and videos up to 50MB)
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  const rootDir = process.cwd();

  // Serve uploaded media statically
  const uploadsDir = path.resolve(rootDir, 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use('/uploads', express.static(uploadsDir));

  // Serve static public folder (logos, favicons, robots, assets)
  const publicDir = path.resolve(rootDir, 'public');
  if (fs.existsSync(publicDir)) {
    app.use(express.static(publicDir));
  }

  // Mount API Router under /api
  app.use('/api', apiRouter);

  // Search Engine Directives: /robots.txt
  app.get('/robots.txt', (req, res) => {
    const settings = db.getSettings();
    res.setHeader('Content-Type', 'text/plain');
    if (settings.disallowSearchIndexing) {
      return res.send(`User-agent: *\nDisallow: /\n# Search indexing disabled by site administrator\n`);
    }
    const host = req.get('host') || 'localhost:3000';
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const baseUrl = settings.canonicalUrl?.replace(/\/$/, '') || `${protocol}://${host}`;
    const secretSlug = (settings.adminSecretSlug || 'kg-admin-secure').replace(/^\//, '');
    return res.send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /${secretSlug}\nDisallow: /api/\n\nSitemap: ${baseUrl}/sitemap.xml\n`);
  });

  // Google Search Console Verification File
  app.get('/google0087e514b59ec8b5.html', (_req, res) => {
    res.setHeader('Content-Type', 'text/html');
    return res.send('google-site-verification: google0087e514b59ec8b5.html');
  });

  // Dynamic XML Sitemap: /sitemap.xml
  app.get('/sitemap.xml', (req, res) => {
    const settings = db.getSettings();
    const host = req.get('host') || 'localhost:3000';
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const baseUrl = settings.canonicalUrl?.replace(/\/$/, '') || `${protocol}://${host}`;
    const items = db.getContentList({ includeDrafts: false });
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/news', priority: '0.8', changefreq: 'daily' },
      { url: '/explainers', priority: '0.9', changefreq: 'weekly' },
      { url: '/videos', priority: '0.8', changefreq: 'weekly' },
      { url: '/about', priority: '0.7', changefreq: 'monthly' },
      { url: '/editorial-standards', priority: '0.7', changefreq: 'monthly' },
      { url: '/corrections', priority: '0.7', changefreq: 'weekly' },
      { url: '/contact', priority: '0.6', changefreq: 'monthly' },
      { url: '/privacy', priority: '0.5', changefreq: 'yearly' },
      { url: '/terms', priority: '0.5', changefreq: 'yearly' }
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    for (const p of staticPages) {
      xml += `  <url>\n    <loc>${baseUrl}${p.url}</loc>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>\n`;
    }

    for (const item of items) {
      const lastMod = item.updatedAt ? item.updatedAt.slice(0, 10) : item.createdAt.slice(0, 10);
      xml += `  <url>\n    <loc>${baseUrl}/article/${item.slug}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    }

    xml += `</urlset>`;
    res.setHeader('Content-Type', 'application/xml');
    return res.send(xml);
  });

  // Vite integration
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(rootDir, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Khabar GPT Full-Stack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
