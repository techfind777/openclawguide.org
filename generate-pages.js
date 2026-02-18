const fs = require('fs');
const path = require('path');

const SITE_DIR = __dirname;

const template = (title, desc, keywords, slug, category, content) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="keywords" content="${keywords}">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="canonical" href="https://openclawguide.org/${slug}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:type" content="article">
<meta property="og:url" content="https://openclawguide.org/${slug}">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"${title}","description":"${desc}","datePublished":"2026-02-18","author":{"@type":"Organization","name":"OpenClaw Guide"},"publisher":{"@type":"Organization","name":"OpenClaw Guide","url":"https://openclawguide.org"}}
<\/script>
<style>
*{box-sizing:border-box;margin:0;padding:0}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1a1a2e;line-height:1.8;background:#fafbfc}a{color:#e94560;text-decoration:none;font-weight:600}a:hover{text-decoration:underline}.container{max-width:800px;margin:0 auto;padding:0 24px}nav{background:#0f3460;padding:12px 0}nav .container{display:flex;justify-content:space-between;align-items:center}nav a{color:white;font-weight:700;font-size:18px}nav a:hover{text-decoration:none}nav ul{list-style:none;display:flex;gap:20px}nav ul a{color:rgba(255,255,255,0.85);font-size:14px;font-weight:500}.hero-sm{background:linear-gradient(135deg,#0f3460,#16213e);color:white;padding:50px 0 40px;text-align:center}.hero-sm h1{font-size:clamp(24px,4vw,36px);margin-bottom:8px}.hero-sm p{opacity:0.85;font-size:16px}article{padding:40px 0 60px}article h2{font-size:24px;color:#0f3460;margin:36px 0 14px;padding-top:16px;border-top:1px solid #eee}article h3{font-size:19px;color:#16213e;margin:20px 0 10px}article p{margin-bottom:16px;color:#333}article ul,article ol{margin:0 0 16px 24px;color:#333}article li{margin-bottom:8px}article code{background:#e8f0fe;padding:2px 6px;border-radius:4px;font-size:14px}article pre{background:#1a1a2e;color:#e0e0e0;padding:16px;border-radius:8px;overflow-x:auto;margin:16px 0;font-size:13px}.callout{background:#f0f7ff;border-left:4px solid #0f3460;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0}.btn{display:inline-block;padding:12px 24px;border-radius:8px;font-weight:700;font-size:15px;transition:transform 0.2s}.btn:hover{transform:translateY(-2px);text-decoration:none}.btn-primary{background:#e94560;color:white}.cta-box{background:linear-gradient(135deg,#fff3cd,#ffeeba);border:2px solid #ffc107;border-radius:12px;padding:24px;margin:30px 0;text-align:center}.cta-box h3{color:#856404;margin-bottom:8px}.related{background:#f8f9fa;padding:30px 0;margin-top:40px}.related h3{margin-bottom:16px;color:#0f3460}.related ul{list-style:none;padding:0}.related li{margin-bottom:8px}.related li a{font-weight:500}footer{background:#0f3460;color:rgba(255,255,255,0.7);padding:30px 0;text-align:center;font-size:13px}footer a{color:#e94560}
</style>
</head>
<body>
<nav><div class="container"><a href="/">OpenClaw Guide</a><ul><li><a href="/en/">Home</a></li><li><a href="/en/best-vps-for-openclaw.html">VPS Guide</a></li><li><a href="/easysetup.html">EasySetup</a></li></ul></div></nav>
<div class="hero-sm"><div class="container"><h1>${title}</h1><p>${desc}</p></div></div>
<article><div class="container">
${content}
<div class="cta-box">
<h3>🔥 Ready to Build Your AI Agent?</h3>
<p>Get 100 ready-to-use SOUL.md templates for any industry — <strong>only $5</strong></p>
<a href="https://leimspire20.gumroad.com/l/jryauv" class="btn btn-primary">Get SOUL.md Mega Pack →</a>
<p style="margin-top:12px;font-size:14px">Or start free: <a href="https://leimspire20.gumroad.com/l/kqbdva">Download 5 Free Templates</a></p>
</div>
</div></article>
<div class="related"><div class="container">
<h3>Related Guides</h3>
<ul>
<li><a href="/en/">← Back to Home</a></li>
<li><a href="/en/best-vps-for-openclaw.html">Best VPS for OpenClaw</a></li>
<li><a href="/easysetup.html">EasySetup — Install in 5 Minutes</a></li>
</ul>
</div></div>
<footer><div class="container"><p>&copy; 2026 OpenClaw Guide. <a href="/privacy.html">Privacy</a> | <a href="/terms.html">Terms</a></p></div></footer>
</body></html>`;

// GUIDES
const guides = [
  {name:'Healthcare',slug:'healthcare-ai-agent',kw:'healthcare AI agent, medical AI, patient care automation'},
  {name:'Legal',slug:'legal-ai-agent',kw:'legal AI agent, law firm automation, contract review AI'},
  {name:'Real Estate',slug:'real-estate-ai-agent',kw:'real estate AI agent, property listing AI, real estate automation'},
  {name:'E-Commerce',slug:'ecommerce-ai-agent',kw:'ecommerce AI agent, online store automation, product recommendation AI'},
  {name:'Customer Service',slug:'customer-service-ai-agent',kw:'customer service AI agent, support chatbot, ticket automation'},
  {name:'Finance',slug:'finance-ai-agent',kw:'finance AI agent, financial analysis AI, investment automation'},
  {name:'Education',slug:'education-ai-agent',kw:'education AI agent, tutoring AI, learning automation'},
  {name:'Marketing',slug:'marketing-ai-agent',kw:'marketing AI agent, campaign automation, SEO AI agent'},
  {name:'HR & Recruitment',slug:'hr-recruitment-ai-agent',kw:'HR AI agent, recruitment automation, resume screening AI'},
  {name:'Content Creation',slug:'content-creation-ai-agent',kw:'content creation AI agent, writing AI, blog automation'},
  {name:'DevOps',slug:'devops-ai-agent',kw:'DevOps AI agent, CI/CD automation, infrastructure AI'},
  {name:'Data Analysis',slug:'data-analysis-ai-agent',kw:'data analysis AI agent, analytics automation, SQL AI'},
  {name:'Sales',slug:'sales-ai-agent',kw:'sales AI agent, lead generation AI, CRM automation'},
  {name:'Project Management',slug:'project-management-ai-agent',kw:'project management AI agent, task automation, agile AI'},
  {name:'Cybersecurity',slug:'cybersecurity-ai-agent',kw:'cybersecurity AI agent, security automation, threat detection AI'},
  {name:'Supply Chain',slug:'supply-chain-ai-agent',kw:'supply chain AI agent, logistics automation, inventory AI'},
  {name:'Travel',slug:'travel-ai-agent',kw:'travel AI agent, itinerary planner AI, booking automation'},
  {name:'Fitness & Wellness',slug:'fitness-ai-agent',kw:'fitness AI agent, workout planner AI, health automation'},
  {name:'Restaurant',slug:'restaurant-ai-agent',kw:'restaurant AI agent, menu optimization AI, food service automation'},
  {name:'Accounting',slug:'accounting-ai-agent',kw:'accounting AI agent, bookkeeping automation, invoice AI'},
];

guides.forEach(g => {
  const dir = path.join(SITE_DIR, 'guides');
  fs.mkdirSync(dir, {recursive:true});
  const content = `
<h2>Why Build a ${g.name} AI Agent?</h2>
<p>The ${g.name.toLowerCase()} industry is ripe for AI automation. Repetitive tasks, data processing, and client communication can all be handled by a well-configured AI agent — saving hours of manual work every day.</p>
<p>With OpenClaw, you can deploy a specialized ${g.name.toLowerCase()} AI agent on your own server in under 30 minutes. No coding required — just configure a SOUL.md personality file and connect your tools.</p>

<h2>What Your ${g.name} Agent Can Do</h2>
<ul>
<li><strong>Automate routine tasks</strong> — Handle repetitive ${g.name.toLowerCase()} workflows automatically</li>
<li><strong>Answer questions</strong> — Provide instant, accurate responses based on ${g.name.toLowerCase()} knowledge</li>
<li><strong>Process documents</strong> — Analyze and summarize ${g.name.toLowerCase()}-related documents</li>
<li><strong>Generate reports</strong> — Create structured reports and summaries on demand</li>
<li><strong>Integrate with tools</strong> — Connect to Slack, email, CRM, and other platforms</li>
</ul>

<h2>Step-by-Step Setup Guide</h2>
<h3>Step 1: Install OpenClaw</h3>
<p>Deploy OpenClaw on any VPS with our <a href="/easysetup.html">one-click installer</a>. Recommended: <a href="https://www.vultr.com/?ref=9738617-8H">Vultr</a> ($6/month) or any Ubuntu 22.04+ server with 2GB RAM.</p>
<pre>curl -fsSL https://openclawguide.org/install.sh | bash</pre>

<h3>Step 2: Configure the SOUL.md File</h3>
<p>The SOUL.md file defines your agent's personality, expertise, and behavior. For a ${g.name.toLowerCase()} agent, you'll want to specify:</p>
<ul>
<li>Industry-specific knowledge and terminology</li>
<li>Communication style appropriate for ${g.name.toLowerCase()} professionals</li>
<li>Workflow patterns and decision frameworks</li>
<li>Boundaries and compliance requirements</li>
</ul>
<div class="callout">
<strong>💡 Pro tip:</strong> Don't write your SOUL.md from scratch. The <a href="https://leimspire20.gumroad.com/l/jryauv">SOUL.md Mega Pack</a> includes a ready-to-use ${g.name.toLowerCase()} template — just customize it for your specific needs.
</div>

<h3>Step 3: Connect Your Channels</h3>
<p>OpenClaw supports multiple communication channels out of the box: Slack, Discord, Telegram, WhatsApp, email, and more. Connect the channels your ${g.name.toLowerCase()} team already uses.</p>

<h3>Step 4: Test and Deploy</h3>
<p>Test your agent with real ${g.name.toLowerCase()} scenarios before going live. OpenClaw's built-in monitoring lets you review every conversation and fine-tune responses.</p>

<h2>Best Practices for ${g.name} AI Agents</h2>
<ol>
<li><strong>Start narrow</strong> — Focus on one specific task before expanding capabilities</li>
<li><strong>Set clear boundaries</strong> — Define what the agent should and shouldn't do</li>
<li><strong>Monitor and iterate</strong> — Review conversations weekly and update the SOUL.md</li>
<li><strong>Ensure compliance</strong> — Make sure your agent follows ${g.name.toLowerCase()} industry regulations</li>
<li><strong>Collect feedback</strong> — Ask users to rate agent responses for continuous improvement</li>
</ol>

<h2>Get Started Today</h2>
<p>Building a ${g.name.toLowerCase()} AI agent doesn't require a team of engineers. With OpenClaw and the right SOUL.md template, you can have a working agent in under an hour.</p>
<p>Need the complete toolkit? The <a href="https://leimspire20.gumroad.com/l/riwdzt">OpenClaw Complete Bundle ($29)</a> includes everything: 100 SOUL.md templates, setup guides, security hardening, and automation workflows.</p>`;

  const html = template(
    `How to Build a ${g.name} AI Agent with OpenClaw (2026 Guide)`,
    `Step-by-step guide to building a ${g.name.toLowerCase()} AI agent with OpenClaw. Automate ${g.name.toLowerCase()} workflows, save time, and improve efficiency.`,
    g.kw, `guides/${g.slug}.html`, 'guides', content
  );
  fs.writeFileSync(path.join(dir, g.slug+'.html'), html);
});

// INTEGRATIONS
const integrations = [
  {name:'Slack',slug:'openclaw-slack',desc:'team communication and notifications'},
  {name:'Discord',slug:'openclaw-discord',desc:'community management and support'},
  {name:'Telegram',slug:'openclaw-telegram',desc:'messaging and bot interactions'},
  {name:'Notion',slug:'openclaw-notion',desc:'knowledge base and documentation'},
  {name:'GitHub',slug:'openclaw-github',desc:'code review and issue management'},
  {name:'n8n',slug:'openclaw-n8n',desc:'workflow automation and data pipelines'},
  {name:'Zapier',slug:'openclaw-zapier',desc:'no-code automation across 5000+ apps'},
  {name:'Google Sheets',slug:'openclaw-google-sheets',desc:'data tracking and reporting'},
  {name:'Airtable',slug:'openclaw-airtable',desc:'database management and CRM'},
  {name:'WhatsApp',slug:'openclaw-whatsapp',desc:'customer communication and support'},
  {name:'Email',slug:'openclaw-email',desc:'automated email responses and workflows'},
  {name:'Jira',slug:'openclaw-jira',desc:'project tracking and sprint management'},
  {name:'Trello',slug:'openclaw-trello',desc:'task management and kanban boards'},
  {name:'HubSpot',slug:'openclaw-hubspot',desc:'CRM, marketing, and sales automation'},
  {name:'Shopify',slug:'openclaw-shopify',desc:'e-commerce operations and customer support'},
];

integrations.forEach(i => {
  const dir = path.join(SITE_DIR, 'integrations');
  fs.mkdirSync(dir, {recursive:true});
  const content = `
<h2>Why Connect OpenClaw with ${i.name}?</h2>
<p>${i.name} is one of the most popular tools for ${i.desc}. By integrating OpenClaw with ${i.name}, your AI agent can automatically interact with your ${i.name} workspace — reading data, sending messages, and triggering actions without manual intervention.</p>

<h2>What You Can Build</h2>
<ul>
<li><strong>Automated responses</strong> — Your AI agent monitors ${i.name} and responds to messages, questions, or events automatically</li>
<li><strong>Data sync</strong> — Pull data from ${i.name} into your agent's context for smarter decisions</li>
<li><strong>Notifications</strong> — Get AI-generated summaries and alerts in ${i.name}</li>
<li><strong>Workflow triggers</strong> — Use ${i.name} events to trigger complex AI workflows</li>
</ul>

<h2>Setup Guide</h2>
<h3>Prerequisites</h3>
<ul>
<li>OpenClaw installed on your server (<a href="/easysetup.html">Quick install guide</a>)</li>
<li>A ${i.name} account with API access or webhook permissions</li>
<li>Basic familiarity with OpenClaw configuration</li>
</ul>

<h3>Step 1: Configure OpenClaw Channel</h3>
<p>OpenClaw supports ${i.name} as a native channel. Add the ${i.name} configuration to your OpenClaw config file:</p>
<pre>channels:
  ${i.slug.replace('openclaw-','')}:
    enabled: true
    # Add your ${i.name} credentials here</pre>

<h3>Step 2: Set Up Your Agent's Personality</h3>
<p>Create a SOUL.md file that defines how your agent behaves in ${i.name}. The personality should match the context — professional for work tools, friendly for community platforms.</p>
<div class="callout">
<strong>💡 Need templates?</strong> The <a href="https://leimspire20.gumroad.com/l/jryauv">SOUL.md Mega Pack</a> includes 100 personality templates for every use case. Find the perfect starting point for your ${i.name} integration.
</div>

<h3>Step 3: Test the Integration</h3>
<p>Send a test message in ${i.name} and verify your OpenClaw agent responds correctly. Check the OpenClaw logs for any connection issues.</p>

<h2>Common Use Cases</h2>
<ol>
<li><strong>Help desk</strong> — Answer team questions automatically in ${i.name}</li>
<li><strong>Daily summaries</strong> — AI-generated reports posted to ${i.name} every morning</li>
<li><strong>Onboarding</strong> — Guide new users through setup via ${i.name} messages</li>
<li><strong>Monitoring</strong> — Alert your team in ${i.name} when something needs attention</li>
</ol>

<h2>Next Steps</h2>
<p>Once your OpenClaw + ${i.name} integration is running, consider adding more channels and automations. The <a href="https://leimspire20.gumroad.com/l/riwdzt">Complete Bundle ($29)</a> includes guides for all supported integrations.</p>`;

  const html = template(
    `OpenClaw + ${i.name} Integration Guide — Connect Your AI Agent`,
    `Learn how to integrate OpenClaw with ${i.name} for ${i.desc}. Step-by-step setup guide with examples.`,
    `OpenClaw ${i.name}, ${i.name} AI agent, ${i.name} automation, OpenClaw integration`,
    `integrations/${i.slug}.html`, 'integrations', content
  );
  fs.writeFileSync(path.join(dir, i.slug+'.html'), html);
});

// COMPARISONS
const comparisons = [
  {name:'AutoGPT',slug:'openclaw-vs-autogpt',type:'autonomous agent framework',pros:'Fully autonomous task execution',cons:'Resource-heavy, unpredictable, hard to control'},
  {name:'CrewAI',slug:'openclaw-vs-crewai',type:'multi-agent orchestration',pros:'Multi-agent collaboration',cons:'Complex setup, Python-only, no built-in channels'},
  {name:'LangChain',slug:'openclaw-vs-langchain',type:'LLM application framework',pros:'Huge ecosystem, flexible chains',cons:'Steep learning curve, over-engineered for simple tasks'},
  {name:'AutoGen',slug:'openclaw-vs-autogen',type:'multi-agent conversation framework',pros:'Microsoft-backed, research-grade',cons:'Academic focus, limited production tooling'},
  {name:'ChatGPT',slug:'openclaw-vs-chatgpt',type:'conversational AI',pros:'Best general knowledge, easy to use',cons:'No self-hosting, no persistent memory, no integrations'},
  {name:'Claude',slug:'openclaw-vs-claude',type:'AI assistant',pros:'Long context, strong reasoning',cons:'No self-hosting, API-only, no agent framework'},
  {name:'Cursor',slug:'openclaw-vs-cursor',type:'AI code editor',pros:'Excellent code generation',cons:'IDE-only, not a general agent platform'},
  {name:'Devin',slug:'openclaw-vs-devin',type:'AI software engineer',pros:'End-to-end coding tasks',cons:'Expensive, limited availability, narrow focus'},
  {name:'GitHub Copilot',slug:'openclaw-vs-copilot',type:'AI pair programmer',pros:'Deep IDE integration, code completion',cons:'Code-only, no general agent capabilities'},
  {name:'n8n',slug:'openclaw-vs-n8n',type:'workflow automation platform',pros:'Visual workflow builder, 400+ integrations',cons:'No AI personality, no conversational interface'},
  {name:'Make.com',slug:'openclaw-vs-make',type:'automation platform',pros:'Visual builder, easy to use',cons:'No AI agent capabilities, per-operation pricing'},
  {name:'Zapier',slug:'openclaw-vs-zapier',type:'no-code automation',pros:'5000+ app integrations',cons:'Expensive at scale, no AI agent features'},
  {name:'SuperAgent',slug:'openclaw-vs-superagent',type:'AI agent platform',pros:'Cloud-hosted, easy deployment',cons:'Less customizable, vendor lock-in'},
  {name:'Botpress',slug:'openclaw-vs-botpress',type:'chatbot platform',pros:'Visual flow builder, NLU engine',cons:'Chatbot-focused, not a full agent platform'},
  {name:'Flowise',slug:'openclaw-vs-flowise',type:'LLM flow builder',pros:'Visual LangChain builder, open source',cons:'Limited to LangChain patterns, no built-in channels'},
];

comparisons.forEach(c => {
  const dir = path.join(SITE_DIR, 'compare');
  fs.mkdirSync(dir, {recursive:true});
  const content = `
<h2>Quick Comparison</h2>
<table style="width:100%;border-collapse:collapse;margin:20px 0">
<tr style="background:#0f3460;color:white"><th style="padding:12px;text-align:left">Feature</th><th style="padding:12px">OpenClaw</th><th style="padding:12px">${c.name}</th></tr>
<tr><td style="padding:10px;border-bottom:1px solid #eee"><strong>Type</strong></td><td style="padding:10px;border-bottom:1px solid #eee">AI agent platform</td><td style="padding:10px;border-bottom:1px solid #eee">${c.type}</td></tr>
<tr><td style="padding:10px;border-bottom:1px solid #eee"><strong>Self-hosted</strong></td><td style="padding:10px;border-bottom:1px solid #eee">✅ Yes</td><td style="padding:10px;border-bottom:1px solid #eee">${['ChatGPT','Claude','Devin','GitHub Copilot','Cursor','Make.com','Zapier'].includes(c.name)?'❌ No':'✅ Yes'}</td></tr>
<tr><td style="padding:10px;border-bottom:1px solid #eee"><strong>Personality (SOUL.md)</strong></td><td style="padding:10px;border-bottom:1px solid #eee">✅ Built-in</td><td style="padding:10px;border-bottom:1px solid #eee">❌ No</td></tr>
<tr><td style="padding:10px;border-bottom:1px solid #eee"><strong>Multi-channel</strong></td><td style="padding:10px;border-bottom:1px solid #eee">✅ 10+ channels</td><td style="padding:10px;border-bottom:1px solid #eee">${['n8n','Zapier','Make.com','Botpress'].includes(c.name)?'⚠️ Limited':'❌ No'}</td></tr>
<tr><td style="padding:10px;border-bottom:1px solid #eee"><strong>Price</strong></td><td style="padding:10px;border-bottom:1px solid #eee">Free (open source)</td><td style="padding:10px;border-bottom:1px solid #eee">${['ChatGPT','Zapier','Make.com','Devin','Cursor'].includes(c.name)?'$20-200/mo':'Free'}</td></tr>
<tr><td style="padding:10px;border-bottom:1px solid #eee"><strong>GitHub Stars</strong></td><td style="padding:10px;border-bottom:1px solid #eee">150K+</td><td style="padding:10px;border-bottom:1px solid #eee">Varies</td></tr>
</table>

<h2>What is ${c.name}?</h2>
<p>${c.name} is a ${c.type} that has gained popularity in the AI community. Its main strength: ${c.pros.toLowerCase()}. However, it has limitations: ${c.cons.toLowerCase()}.</p>

<h2>What is OpenClaw?</h2>
<p>OpenClaw is an open-source AI agent platform with 150K+ GitHub stars. It lets you deploy AI agents on your own server with full control over personality (via SOUL.md), multi-channel communication, persistent memory, and extensible skills.</p>

<h2>Key Differences</h2>
<h3>1. Personality & Customization</h3>
<p>OpenClaw's SOUL.md system gives your agent a real personality — expertise, communication style, boundaries, and workflow patterns. ${c.name} ${['ChatGPT','Claude'].includes(c.name)?'uses system prompts which are less structured and persistent':'doesn\'t have an equivalent personality system'}.</p>

<h3>2. Self-Hosting & Privacy</h3>
<p>OpenClaw runs on your own server. Your data never leaves your infrastructure. ${['ChatGPT','Claude','Devin','Cursor','Zapier','Make.com'].includes(c.name)?c.name+' is cloud-only — your data is processed on their servers.':c.name+' can also be self-hosted, but OpenClaw offers a more complete agent platform.'}</p>

<h3>3. Multi-Channel Communication</h3>
<p>OpenClaw natively supports 10+ channels: Slack, Discord, Telegram, WhatsApp, email, and more. Your agent is available wherever your users are. ${c.name} ${['Botpress','n8n'].includes(c.name)?'has some channel support but is more limited':'typically works through a single interface'}.</p>

<h3>4. Cost</h3>
<p>OpenClaw is free and open source. You only pay for hosting ($5-20/month for a VPS). ${['ChatGPT','Zapier','Make.com','Devin','Cursor'].includes(c.name)?c.name+' charges $20-200+/month depending on usage.':'Both are open source, but OpenClaw provides a more complete out-of-the-box experience.'}</p>

<h2>When to Choose ${c.name}</h2>
<ul>
<li>${c.pros}</li>
<li>You need ${c.type} specifically</li>
<li>${['ChatGPT','Claude'].includes(c.name)?'You want zero setup — just open a browser':'You\'re already invested in the '+c.name+' ecosystem'}</li>
</ul>

<h2>When to Choose OpenClaw</h2>
<ul>
<li>You want full control over your AI agent's personality and behavior</li>
<li>You need multi-channel communication (Slack + Discord + Telegram + more)</li>
<li>Data privacy matters — everything stays on your server</li>
<li>You want persistent memory and context across conversations</li>
<li>You need extensible skills and automation capabilities</li>
</ul>

<h2>Get Started with OpenClaw</h2>
<p>Try OpenClaw in 5 minutes with our <a href="/easysetup.html">EasySetup installer</a>. Or grab the <a href="https://leimspire20.gumroad.com/l/kqbdva">Free Starter Pack</a> with 5 SOUL.md templates to see what's possible.</p>`;

  const html = template(
    `OpenClaw vs ${c.name}: Which AI Agent Platform is Better in 2026?`,
    `Detailed comparison of OpenClaw vs ${c.name}. Features, pricing, self-hosting, and use cases compared side by side.`,
    `OpenClaw vs ${c.name}, ${c.name} alternative, ${c.name} comparison, best AI agent platform`,
    `compare/${c.slug}.html`, 'compare', content
  );
  fs.writeFileSync(path.join(dir, c.slug+'.html'), html);
});

// SITEMAP
const allPages = [
  'index.html','en/index.html','best-vps-for-openclaw.html','openclaw-cost-guide.html','easysetup.html',
  'en/best-vps-for-openclaw.html','en/openclaw-cost-guide.html','en/easysetup.html',
  'zh/index.html','zh/easysetup.html','zh/best-vps-for-openclaw.html',
  'ja/index.html','ko/index.html','es/index.html','de/index.html',
  ...guides.map(g=>'guides/'+g.slug+'.html'),
  ...integrations.map(i=>'integrations/'+i.slug+'.html'),
  ...comparisons.map(c=>'compare/'+c.slug+'.html'),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(p=>`<url><loc>https://openclawguide.org/${p}</loc><lastmod>2026-02-18</lastmod></url>`).join('\n')}
</urlset>`;
fs.writeFileSync(path.join(SITE_DIR, 'sitemap.xml'), sitemap);

console.log('Generated:');
console.log('  Guides:', guides.length);
console.log('  Integrations:', integrations.length);
console.log('  Comparisons:', comparisons.length);
console.log('  Total new pages:', guides.length + integrations.length + comparisons.length);
console.log('  Sitemap updated with', allPages.length, 'URLs');
