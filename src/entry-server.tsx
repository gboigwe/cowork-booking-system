import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';

export { SEO_MANIFEST, PRERENDER_ROUTES } from './seo-manifest';

// Used only at build time by scripts/prerender.mjs (Node, not the browser).
// BookingProvider's data fetch runs in a useEffect, which never fires during
// renderToString, so this renders the static shell/copy correctly and simply
// shows no live desk data, which is fine; that's not what crawlers need indexed.
export function render(url: string) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
}
