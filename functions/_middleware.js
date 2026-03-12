// Cloudflare Pages Middleware: redirect pages.dev → custom domain + /en/ dedup
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // Redirect pages.dev → openclawguide.org (SEO: avoid duplicate content)
  if (url.hostname === 'openclawguide.pages.dev') {
    const target = `https://openclawguide.org${url.pathname}${url.search}`;
    return new Response(null, {
      status: 301,
      headers: {
        'Location': target,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  }

  // Redirect /en/xxx → /xxx (SEO: avoid duplicate content with canonical)
  // /en/ homepage is fine (it's the canonical English homepage)
  // But /en/best-vps-for-openclaw etc. are duplicates of /best-vps-for-openclaw
  if (url.pathname.startsWith('/en/') && url.pathname !== '/en/' && url.pathname !== '/en') {
    const target = url.pathname.replace(/^\/en\//, '/') + url.search;
    return new Response(null, {
      status: 301,
      headers: {
        'Location': target,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  }

  return context.next();
}
