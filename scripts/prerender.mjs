// Generates real, crawlable HTML per route (not just per-route <head> tags).
// Runs after both `vite build` (client) and `vite build --ssr` (server
// bundle). Reads the client build's index.html as a template, renders each
// public route's actual React output with react-dom/server, and writes
// dist/<route>/index.html with the real content plus that route's own
// title/description/canonical/OG tags baked directly into the source.
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const distDir = join(rootDir, 'dist');
const ssrEntry = join(rootDir, 'dist-server', 'entry-server.js');

const { render, SEO_MANIFEST, PRERENDER_ROUTES } = await import(`file://${ssrEntry}`);

const template = readFileSync(join(distDir, 'index.html'), 'utf-8');

function escapeAttr(s) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function withHead(html, path) {
  const { title, description } = SEO_MANIFEST[path];
  const url = `https://zoneinhub.com${path}`;
  const t = escapeAttr(title);
  const d = escapeAttr(description);

  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`)
    .replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${d}"`)
    .replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${url}"`)
    .replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${t}"`)
    .replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${d}"`)
    .replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${url}"`)
    .replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${t}"`)
    .replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${d}"`);
}

for (const path of PRERENDER_ROUTES) {
  const appHtml = render(path);
  const page = withHead(template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`), path);

  const outPath = path === '/' ? join(distDir, 'index.html') : join(distDir, path.slice(1), 'index.html');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, page);
  console.log('prerendered', path, '->', outPath.replace(rootDir + '/', ''));
}

if (existsSync(join(rootDir, 'dist-server'))) {
  rmSync(join(rootDir, 'dist-server'), { recursive: true, force: true });
}
