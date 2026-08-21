// React 19 hoists <title>/<meta>/<link> rendered anywhere in the tree up to
// <head> automatically in the browser, updating on route change, no extra
// library needed. That hoisting doesn't happen under plain renderToString on
// the server though (these would render as literal elements inside <body>,
// duplicating what scripts/prerender.mjs already writes into <head> via
// string replacement), so this renders nothing during SSR.
import { SEO_MANIFEST } from '../../seo-manifest';

const SITE_URL = 'https://zoneinhub.com';

function SEO({ path }: { path: string }) {
  if (typeof window === 'undefined') return null;
  const entry = SEO_MANIFEST[path];
  if (!entry) return null;
  const { title, description } = entry;
  const url = `${SITE_URL}${path}`;
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </>
  );
}

export default SEO;
