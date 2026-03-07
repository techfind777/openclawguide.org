// Cloudflare Pages Function: geo-redirect homepage based on IP country
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // Only redirect the root path
  if (url.pathname !== '/') {
    return context.next();
  }

  // Search engine bots → always 301 to /en/ (canonical default)
  const ua = request.headers.get('user-agent') || '';
  if (/bot|crawl|spider|slurp|googlebot|bingbot|yandex|baidu/i.test(ua)) {
    return new Response(null, {
      status: 301,
      headers: {
        'Location': '/en/',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  }

  // Human users → 302 geo-redirect (temporary, varies by location)
  const country = request.headers.get('CF-IPCountry') || '';

  const countryToLang = {
    // Chinese
    'CN': '/zh/', 'TW': '/zh/', 'HK': '/zh/', 'MO': '/zh/',
    // Japanese
    'JP': '/ja/',
    // Korean
    'KR': '/ko/',
    // Spanish
    'ES': '/es/', 'MX': '/es/', 'AR': '/es/', 'CO': '/es/', 'CL': '/es/',
    'PE': '/es/', 'VE': '/es/', 'EC': '/es/', 'GT': '/es/', 'CU': '/es/',
    'BO': '/es/', 'DO': '/es/', 'HN': '/es/', 'PY': '/es/', 'SV': '/es/',
    'NI': '/es/', 'CR': '/es/', 'PA': '/es/', 'UY': '/es/',
    // German
    'DE': '/de/', 'AT': '/de/', 'CH': '/de/',
  };

  const target = countryToLang[country.toUpperCase()] || '/en/';

  return new Response(null, {
    status: 302,
    headers: {
      'Location': target,
      'Cache-Control': 'no-cache',
    },
  });
}
