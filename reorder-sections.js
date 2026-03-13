#!/usr/bin/env node
/**
 * Reorder index.html sections for all languages.
 * Strategy: Gumroad (free + paid) first, VPS/hosting last.
 * 
 * New order:
 * 1. Hero (with adjusted CTAs)
 * 2. Free Resources
 * 3. Premium Products
 * 4. Tutorial/Quick Start (en, zh)
 * 5. Industry Guides (en, zh)
 * 6. Integrations (en, zh)
 * 7. Comparisons (en, zh)
 * 8. Articles (en)
 * 9. SEO Content (en)
 * 10. VPS Hosting
 * 11. Managed Hosting (en, zh)
 * 12. FAQ (zh)
 * 13. Footer
 */

const fs = require('fs');
const path = require('path');

const SITE_DIR = __dirname;

// Helper: extract a section by matching start/end patterns
function extractBetween(html, startPattern, endPattern) {
  const startIdx = html.indexOf(startPattern);
  if (startIdx === -1) return { found: false, content: '', before: html, after: '' };
  const endIdx = html.indexOf(endPattern, startIdx + startPattern.length);
  if (endIdx === -1) return { found: false, content: '', before: html, after: '' };
  return {
    found: true,
    content: html.substring(startIdx, endIdx + endPattern.length),
    before: html.substring(0, startIdx),
    after: html.substring(endIdx + endPattern.length)
  };
}

// Parse HTML into: head (everything before first section after </nav>), sections[], footer
function parsePageSections(html) {
  // Find end of nav
  const navEnd = html.indexOf('</nav>');
  if (navEnd === -1) throw new Error('Cannot find </nav>');
  
  const afterNav = html.substring(navEnd + 6);
  const beforeBody = html.substring(0, navEnd + 6);
  
  // Split into sections. Sections are <section...>...</section> blocks
  // But we also need to handle <!-- comments --> before sections
  const parts = [];
  let remaining = afterNav;
  
  // Find footer
  const footerPatterns = ['<footer', '<!-- Footer'];
  let footerIdx = -1;
  for (const fp of footerPatterns) {
    const idx = remaining.indexOf(fp);
    if (idx !== -1 && (footerIdx === -1 || idx < footerIdx)) {
      footerIdx = idx;
    }
  }
  
  const bodyContent = footerIdx !== -1 ? remaining.substring(0, footerIdx) : remaining;
  const footerContent = footerIdx !== -1 ? remaining.substring(footerIdx) : '';
  
  // Parse sections from bodyContent
  // Each section starts with optional <!-- comment --> then <section
  const sectionRegex = /(<!--[\s\S]*?-->\s*)?<section[\s\S]*?<\/section>/g;
  let match;
  const sections = [];
  
  while ((match = sectionRegex.exec(bodyContent)) !== null) {
    const sectionHtml = match[0];
    // Identify section type
    let type = 'unknown';
    if (/class="hero"|Hero/i.test(sectionHtml)) type = 'hero';
    else if (/id="hosting"|VPS|Hosting|ホスティング|호스팅|Hébergement|云服务器推荐|おすすめVPS/i.test(sectionHtml)) type = 'hosting';
    else if (/id="tutorial"|Deploy OpenClaw in 5|快速安装|10 分钟/i.test(sectionHtml)) type = 'tutorial';
    else if (/id="free"|Free Resources|免费资源|無料リソース|무료 리소스|Recursos Gratuitos|Kostenlose Ressourcen|Ressources Gratuites/i.test(sectionHtml)) type = 'free';
    else if (/id="products"|id="guides"|Premium|进阶资源|プレミアム|프리미엄|Recursos Premium|Premium-Ressourcen|Ressources Premium|product-grid/i.test(sectionHtml)) type = 'products';
    else if (/id="managed"|Don't Want to Self-Host|不想自己搭建/i.test(sectionHtml)) type = 'managed';
    else if (/Latest Tutorials & Articles|article-list/i.test(sectionHtml)) type = 'articles';
    else if (/What is OpenClaw|class="seo"/i.test(sectionHtml)) type = 'seo';
    else if (/Industry AI Agent|行业 AI 智能体/i.test(sectionHtml)) type = 'industry';
    else if (/Integration Guides|集成指南/i.test(sectionHtml)) type = 'integrations';
    else if (/vs Alternatives|竞品对比|OpenClaw vs/i.test(sectionHtml)) type = 'comparisons';
    else if (/常见问题|FAQ/i.test(sectionHtml)) type = 'faq';
    else if (/Anleitungen|Tutorials|ガイド＆チュートリアル|가이드|Guías y Tutoriales|Guides & Tutoriels/i.test(sectionHtml) && type === 'unknown') type = 'guides_tutorials';
    
    sections.push({ type, html: sectionHtml });
  }
  
  return { head: beforeBody, sections, footer: footerContent };
}

// Define desired order for each language
const ORDER = [
  'hero',
  'free',
  'products',
  'tutorial',
  'guides_tutorials',  // for small langs that have a combined guides section
  'industry',
  'integrations',
  'comparisons',
  'articles',
  'seo',
  'hosting',
  'managed',
  'faq',
];

function reorderSections(sections) {
  const ordered = [];
  const used = new Set();
  
  for (const type of ORDER) {
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].type === type && !used.has(i)) {
        ordered.push(sections[i]);
        used.add(i);
      }
    }
  }
  
  // Add any remaining unknown sections at the end (before footer)
  for (let i = 0; i < sections.length; i++) {
    if (!used.has(i)) {
      ordered.push(sections[i]);
    }
  }
  
  return ordered;
}

// Process each language
const langs = ['en', 'zh', 'ja', 'ko', 'es', 'de', 'fr'];

for (const lang of langs) {
  const filePath = path.join(SITE_DIR, lang, 'index.html');
  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${lang}/index.html not found`);
    continue;
  }
  
  const html = fs.readFileSync(filePath, 'utf8');
  
  try {
    const { head, sections, footer } = parsePageSections(html);
    
    console.log(`\n[${lang}] Found ${sections.length} sections:`);
    sections.forEach((s, i) => console.log(`  ${i}: ${s.type}`));
    
    const reordered = reorderSections(sections);
    
    console.log(`[${lang}] New order:`);
    reordered.forEach((s, i) => console.log(`  ${i}: ${s.type}`));
    
    // Rebuild HTML
    const newHtml = head + '\n' + reordered.map(s => s.html).join('\n\n') + '\n\n' + footer;
    
    fs.writeFileSync(filePath, newHtml);
    console.log(`[${lang}] ✅ Written`);
  } catch (e) {
    console.log(`[${lang}] ❌ Error: ${e.message}`);
  }
}

console.log('\n--- Now adjusting Hero CTAs ---');

// Adjust Hero CTAs for EN
const enPath = path.join(SITE_DIR, 'en', 'index.html');
let enHtml = fs.readFileSync(enPath, 'utf8');

// Swap hero CTA buttons: free templates becomes primary, products becomes secondary
enHtml = enHtml.replace(
  '<a href="#hosting" class="btn btn-primary">Compare Hosting →</a>\n<a href="#free" class="btn btn-secondary">Get Free Templates</a>',
  '<a href="https://aiagenttools.gumroad.com/l/kqbdva?utm_source=website&utm_medium=article&utm_campaign=starterpack&ref=site" class="btn btn-primary">🆓 Get Free Templates →</a>\n<a href="#products" class="btn btn-secondary">Browse Premium Guides</a>'
);

// Move Vultr banner from hero to hosting section - extract it first
const vultrBannerStart = '<div style="margin-top:20px">\n<a href="https://www.vultr.com/?ref=9738617-8H';
const vultrBannerEnd = '$300 Free Credit →</a>\n</div>';
const vultrBannerMatch = enHtml.match(/<div style="margin-top:20px">\s*<a href="https:\/\/www\.vultr\.com\/\?ref=9738617-8H[^]*?\$300 Free Credit →<\/a>\s*<\/div>/);

if (vultrBannerMatch) {
  const banner = vultrBannerMatch[0];
  // Remove from hero
  enHtml = enHtml.replace(banner, '');
  // Add to top of hosting section
  enHtml = enHtml.replace(
    '<h2>🏆 Best VPS Hosting for OpenClaw (2026)</h2>',
    '<h2>🏆 Best VPS Hosting for OpenClaw (2026)</h2>\n<div style="text-align:center;margin-bottom:30px">' + banner + '</div>'
  );
  console.log('[en] ✅ Moved Vultr banner from hero to hosting section');
}

// Update nav
enHtml = enHtml.replace(
  '<li><a href="#hosting">Best Hosting</a></li>\n<li><a href="#tutorial">Quick Start</a></li>\n<li><a href="#free">Free Resources</a></li>\n<li><a href="#guides">Guides</a></li>',
  '<li><a href="#free">Free Resources</a></li>\n<li><a href="#products">Premium Guides</a></li>\n<li><a href="#tutorial">Quick Start</a></li>\n<li><a href="#hosting">Hosting</a></li>'
);

fs.writeFileSync(enPath, enHtml);
console.log('[en] ✅ Hero CTAs and nav updated');

// Adjust Hero CTAs for ZH
const zhPath = path.join(SITE_DIR, 'zh', 'index.html');
let zhHtml = fs.readFileSync(zhPath, 'utf8');

// ZH hero already has free templates as primary - good. Move Tencent banner to hosting.
const tcBannerMatch = zhHtml.match(/<div style="margin-top:20px">\s*<a href="https:\/\/cloud\.tencent\.com[^]*?低至 68 元\/年 →<\/a>\s*<\/div>/);
if (tcBannerMatch) {
  const tcBanner = tcBannerMatch[0];
  zhHtml = zhHtml.replace(tcBanner, '');
  zhHtml = zhHtml.replace(
    '<h2 id="hosting">🖥️ 云服务器推荐</h2>',
    '<h2 id="hosting">🖥️ 云服务器推荐</h2>\n<div style="text-align:center;margin-bottom:30px">' + tcBanner + '</div>'
  );
  console.log('[zh] ✅ Moved Tencent Cloud banner from hero to hosting section');
}

// Update ZH nav
zhHtml = zhHtml.replace(
  '<li><a href="/zh/#hosting">VPS 推荐</a></li>\n<li><a href="/zh/#guides">教程</a></li>\n<li><a href="/zh/#products">资源</a></li>',
  '<li><a href="/zh/#free">免费资源</a></li>\n<li><a href="/zh/#products">付费资源</a></li>\n<li><a href="/zh/#hosting">VPS 推荐</a></li>'
);

fs.writeFileSync(zhPath, zhHtml);
console.log('[zh] ✅ Hero and nav updated');

// For JA/KO/ES/DE/FR - adjust hero CTAs and nav
const smallLangs = {
  ja: {
    navOld: null, // will handle individually
    heroFree: '無料テンプレートを入手',
    heroProd: 'プレミアムリソース',
  },
  ko: {
    heroFree: '무료 템플릿 받기',
    heroProd: '프리미엄 리소스',
  },
  es: {
    heroFree: 'Obtener Plantillas Gratis',
    heroProd: 'Recursos Premium',
  },
  de: {
    heroFree: 'Kostenlose Vorlagen',
    heroProd: 'Premium-Ressourcen',
  },
  fr: {
    heroFree: 'Modèles Gratuits',
    heroProd: 'Ressources Premium',
  }
};

for (const [lang, cfg] of Object.entries(smallLangs)) {
  const fp = path.join(SITE_DIR, lang, 'index.html');
  if (!fs.existsSync(fp)) continue;
  let h = fs.readFileSync(fp, 'utf8');
  
  // Replace hero CTAs - find the hero-cta div and replace buttons
  // Pattern: btn-primary pointing to hosting/vultr → free templates
  // Pattern: btn-secondary → products
  h = h.replace(
    /(<div class="hero-cta">)\s*<a href="[^"]*"[^>]*class="btn btn-primary"[^>]*>[^<]*<\/a>\s*<a href="[^"]*"[^>]*class="btn btn-secondary"[^>]*>[^<]*<\/a>/,
    `$1\n<a href="https://aiagenttools.gumroad.com/l/kqbdva?utm_source=website&utm_medium=article&utm_campaign=starterpack&ref=site" class="btn btn-primary">🆓 ${cfg.heroFree} →</a>\n<a href="#products" class="btn btn-secondary">${cfg.heroProd}</a>`
  );
  
  // Move Vultr banner from hero to hosting if present
  const vultrMatch = h.match(/<div style="margin-top:20px">\s*<a href="https:\/\/www\.vultr\.com\/\?ref=9738617-8H[^]*?→<\/a>\s*<\/div>/);
  if (vultrMatch) {
    h = h.replace(vultrMatch[0], '');
    // Find hosting section h2 and add banner there
    const hostingH2Match = h.match(/<h2[^>]*>[^<]*(?:VPS|ホスティング|호스팅|Hosting|Hébergement)[^<]*<\/h2>/);
    if (hostingH2Match) {
      h = h.replace(hostingH2Match[0], hostingH2Match[0] + '\n<div style="text-align:center;margin-bottom:30px">' + vultrMatch[0] + '</div>');
    }
    console.log(`[${lang}] ✅ Moved Vultr banner from hero to hosting`);
  }
  
  fs.writeFileSync(fp, h);
  console.log(`[${lang}] ✅ Hero CTAs updated`);
}

console.log('\n✅ All done! Section reorder complete for all 7 languages.');
