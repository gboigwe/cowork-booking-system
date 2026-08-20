// React 19 hoists <title>/<meta>/<link> rendered anywhere in the tree up to
// <head> automatically, updating on route change, no extra library needed.
const SITE_URL = 'https://zoneinhub.com';

function SEO({ title, description, path = '/' }: { title: string; description: string; path?: string }) {
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
