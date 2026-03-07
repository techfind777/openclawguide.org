// Cloudflare Pages Middleware: redirect pages.dev → custom domain
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

  return context.next();
}
