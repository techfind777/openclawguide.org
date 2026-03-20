const fs = require('fs');
const path = require('path');
const SITE_DIR = __dirname;
const LANGS = ['zh', 'ja', 'ko', 'es', 'de', 'fr'];

function buildHreflangLinks(slug) {
  const cleanSlug = slug.replace(/\.html$/, '');
  let links = `<link rel="alternate" hreflang="en" href="https://openclawguide.org/${cleanSlug}">\n`;
  const slugDir = slug.includes('/') ? slug.substring(0, slug.lastIndexOf('/') + 1) : '';
  const baseName = slug.split('/').pop().replace(/\.html$/, '');
  for (const lang of LANGS) {
    const translatedFileFlat = path.join(SITE_DIR, lang, baseName + '.html');
    const translatedFileNested = path.join(SITE_DIR, lang, slugDir, baseName + '.html');
    const hasFlat = fs.existsSync(translatedFileFlat);
    const hasNested = fs.existsSync(translatedFileNested);
    let translatedSlug;
    if (hasNested) translatedSlug = `${lang}/${slugDir}${baseName}`;
    else if (hasFlat) translatedSlug = `${lang}/${baseName}`;
    else translatedSlug = `${lang}/`;
    links += `<link rel="alternate" hreflang="${lang}" href="https://openclawguide.org/${translatedSlug}">\n`;
  }
  links += `<link rel="alternate" hreflang="x-default" href="https://openclawguide.org/${cleanSlug}">`;
  return links;
}

const template = (title, desc, keywords, slug, content) => {
  const cleanSlug = slug.replace(/\.html$/, '');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="keywords" content="${keywords}">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="canonical" href="https://openclawguide.org/${cleanSlug}">
${buildHreflangLinks(slug)}
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:type" content="article">
<meta property="og:url" content="https://openclawguide.org/${cleanSlug}">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"${title}","description":"${desc}","datePublished":"2026-03-17","author":{"@type":"Organization","name":"OpenClaw Guide"},"publisher":{"@type":"Organization","name":"OpenClaw Guide","url":"https://openclawguide.org"}}
<\/script>
<style>
*{box-sizing:border-box;margin:0;padding:0}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1a1a2e;line-height:1.8;background:#fafbfc}a{color:#e94560;text-decoration:none;font-weight:600}a:hover{text-decoration:underline}.container{max-width:800px;margin:0 auto;padding:0 24px}nav{background:#0f3460;padding:12px 0}nav .container{display:flex;justify-content:space-between;align-items:center}nav a{color:white;font-weight:700;font-size:18px}nav a:hover{text-decoration:none}nav ul{list-style:none;display:flex;gap:20px}nav ul a{color:rgba(255,255,255,0.85);font-size:14px;font-weight:500}.hero-sm{background:linear-gradient(135deg,#0f3460,#16213e);color:white;padding:50px 0 40px;text-align:center}.hero-sm h1{font-size:clamp(24px,4vw,36px);margin-bottom:8px}.hero-sm p{opacity:0.85;font-size:16px}article{padding:40px 0 60px}article h2{font-size:24px;color:#0f3460;margin:36px 0 14px;padding-top:16px;border-top:1px solid #eee}article h3{font-size:19px;color:#16213e;margin:20px 0 10px}article p{margin-bottom:16px;color:#333}article ul,article ol{margin:0 0 16px 24px;color:#333}article li{margin-bottom:8px}article code{background:#e8f0fe;padding:2px 6px;border-radius:4px;font-size:14px}article pre{background:#1a1a2e;color:#e0e0e0;padding:16px;border-radius:8px;overflow-x:auto;margin:16px 0;font-size:13px}.callout{background:#f0f7ff;border-left:4px solid #0f3460;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0}.btn{display:inline-block;padding:12px 24px;border-radius:8px;font-weight:700;font-size:15px;transition:transform 0.2s}.btn:hover{transform:translateY(-2px);text-decoration:none}.btn-primary{background:#e94560;color:white}.cta-box{background:linear-gradient(135deg,#fff3cd,#ffeeba);border:2px solid #ffc107;border-radius:12px;padding:24px;margin:30px 0;text-align:center}.cta-box h3{color:#856404;margin-bottom:8px}.related{background:#f8f9fa;padding:30px 0;margin-top:40px}.related h3{margin-bottom:16px;color:#0f3460}.related ul{list-style:none;padding:0}.related li{margin-bottom:8px}.related li a{font-weight:500}footer{background:#0f3460;color:rgba(255,255,255,0.7);padding:30px 0;text-align:center;font-size:13px}footer a{color:#e94560}.comparison-table{width:100%;border-collapse:collapse;margin:20px 0;font-size:14px}.comparison-table th{background:#0f3460;color:white;padding:12px;text-align:left}.comparison-table td{padding:10px 12px;border-bottom:1px solid #eee}.comparison-table tr:hover{background:#f8f9fa}.comparison-table .best{background:#fff3cd}
</style>
</head>
<body>
<nav><div class="container"><a href="/">OpenClaw Guide</a><ul><li><a href="/en/">Home</a></li><li><a href="/best-vps-for-openclaw">VPS Guide</a></li><li><a href="/easysetup">EasySetup</a></li></ul></div></nav>
<div class="hero-sm"><div class="container"><h1>${title}</h1><p>${desc}</p></div></div>
<article><div class="container">
${content}
<div class="cta-box">
<h3>🔥 Ready to Build Your AI Agent?</h3>
<p>Get 100 ready-to-use SOUL.md templates for any industry — <strong>only $5</strong></p>
<a href="https://aiagenttools.gumroad.com/l/jryauv" class="btn btn-primary">Get SOUL.md Mega Pack →</a>
<p style="margin-top:12px;font-size:14px">Or start free: <a href="https://aiagenttools.gumroad.com/l/kqbdva">Download 5 Free Templates</a></p>
</div>
</div></article>
<div class="related"><div class="container">
<h3>Related Guides</h3>
<ul>
<li><a href="/en/">← Back to Home</a></li>
<li><a href="/best-vps-for-openclaw">Best VPS for OpenClaw</a></li>
<li><a href="/easysetup">EasySetup — Install in 5 Minutes</a></li>
<li><a href="/ai-tools-2026">Best AI Tools 2026</a></li>
<li><a href="/ai-agent-guide">AI Agent Guide</a></li>
</ul>
</div></div>
<footer><div class="container"><p>&copy; 2026 OpenClaw Guide. <a href="/privacy">Privacy</a> | <a href="/terms">Terms</a></p></div></footer>
</body></html>`;
};

console.log('Creating 6 missing pages...');
console.log('Template function ready.');
