#!/usr/bin/env node

/**
 * Generate sitemap.xml for the website
 */

const fs = require('fs');
const path = require('path');

const baseUrl = 'https://freeimagetools.online';
const currentDate = new Date().toISOString().split('T')[0];

const pages = [
  {
    loc: '',
    priority: '1.0',
    changefreq: 'weekly'
  },
  {
    loc: '/tools/crop',
    priority: '0.8',
    changefreq: 'weekly'
  },
  {
    loc: '/tools/merge',
    priority: '0.8',
    changefreq: 'weekly'
  },
  {
    loc: '/tools/remove-object',
    priority: '0.8',
    changefreq: 'weekly'
  },
  {
    loc: '/tools/black-image',
    priority: '0.8',
    changefreq: 'weekly'
  },
  {
    loc: '/tools/compress',
    priority: '0.8',
    changefreq: 'weekly'
  },
  {
    loc: '/tools/resize',
    priority: '0.8',
    changefreq: 'weekly'
  }
];

const generateSitemap = () => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `    <url>
        <loc>${baseUrl}${page.loc}</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>
    </url>`).join('\n')}
</urlset>`;

  // Write to public/sitemap.xml
  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap);
  
  console.log(`✅ Sitemap generated: ${sitemapPath}`);
  console.log(`📄 ${pages.length} pages included`);
  console.log(`📅 Last modified: ${currentDate}`);
};

if (require.main === module) {
  generateSitemap();
}

module.exports = { generateSitemap };