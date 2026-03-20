/* OpenClaw Guide — Conversion Components
   Injected on all pages. Self-contained, no dependencies. */
(function(){
  'use strict';

  /* ── Styles ── */
  var css = document.createElement('style');
  css.textContent = `
  /* Affiliate Top Pick Card */
  .oc-top-pick{background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:2px solid #22c55e;border-radius:12px;padding:24px;margin:30px 0;position:relative;overflow:hidden}
  .oc-top-pick::before{content:"⭐ OUR TOP PICK";position:absolute;top:0;right:0;background:#22c55e;color:white;font-size:11px;font-weight:700;padding:4px 14px;border-radius:0 10px 0 10px;letter-spacing:0.5px}
  .oc-top-pick h3{margin:0 0 8px;color:#15803d;font-size:20px}
  .oc-top-pick p{margin:0 0 14px;color:#333;font-size:15px;line-height:1.6}
  .oc-top-pick .oc-btn{display:inline-block;background:#22c55e;color:white;padding:10px 22px;border-radius:8px;font-weight:700;font-size:14px;text-decoration:none;transition:transform .15s,box-shadow .15s}
  .oc-top-pick .oc-btn:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(34,197,94,.35);text-decoration:none}
  .oc-top-pick .oc-price{font-size:13px;color:#666;margin-top:8px}

  /* Newsletter Box */
  .oc-newsletter{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #3b82f6;border-radius:12px;padding:24px;margin:30px 0;text-align:center}
  .oc-newsletter h3{margin:0 0 6px;color:#1d4ed8;font-size:18px}
  .oc-newsletter p{margin:0 0 14px;color:#555;font-size:14px}
  .oc-newsletter form{display:flex;gap:8px;max-width:420px;margin:0 auto}
  .oc-newsletter input[type=email]{flex:1;padding:10px 14px;border:1px solid #93c5fd;border-radius:8px;font-size:14px;outline:none}
  .oc-newsletter input[type=email]:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.15)}
  .oc-newsletter button{background:#3b82f6;color:white;border:none;padding:10px 20px;border-radius:8px;font-weight:700;font-size:14px;cursor:pointer;white-space:nowrap;transition:background .15s}
  .oc-newsletter button:hover{background:#2563eb}
  .oc-newsletter .oc-note{font-size:12px;color:#888;margin-top:8px}
  .oc-newsletter .oc-ok{color:#22c55e;font-weight:600}

  /* VPS Comparison Table */
  .oc-compare{background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:24px;margin:30px 0;overflow-x:auto}
  .oc-compare h3{margin:0 0 16px;color:#0f3460;font-size:18px;text-align:center}
  .oc-compare table{width:100%;border-collapse:collapse;min-width:500px}
  .oc-compare th{background:#0f3460;color:white;padding:12px;text-align:left;font-size:14px;font-weight:600}
  .oc-compare td{padding:12px;border-bottom:1px solid #e5e7eb;font-size:14px}
  .oc-compare tr:last-child td{border-bottom:none}
  .oc-compare .oc-best{background:#f0fdf4;font-weight:600}
  .oc-compare a{color:#e94560;font-weight:600;text-decoration:none}
  .oc-compare a:hover{text-decoration:underline}
  @media(max-width:600px){
    .oc-compare{padding:16px}
    .oc-compare th,.oc-compare td{padding:8px;font-size:13px}
  }

  /* Exit Intent Popup */
  .oc-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9999;align-items:center;justify-content:center}
  .oc-overlay.active{display:flex}
  .oc-popup{background:white;border-radius:16px;padding:32px;max-width:440px;width:90%;text-align:center;position:relative;box-shadow:0 20px 60px rgba(0,0,0,.25);animation:oc-pop .25s ease}
  @keyframes oc-pop{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}
  .oc-popup h2{margin:0 0 8px;font-size:22px;color:#0f3460}
  .oc-popup p{margin:0 0 18px;color:#555;font-size:15px;line-height:1.5}
  .oc-popup .oc-close{position:absolute;top:12px;right:16px;background:none;border:none;font-size:22px;cursor:pointer;color:#999;line-height:1}
  .oc-popup .oc-close:hover{color:#333}
  .oc-popup form{display:flex;flex-direction:column;gap:10px}
  .oc-popup input[type=email]{padding:12px 14px;border:1px solid #ddd;border-radius:8px;font-size:15px;text-align:center}
  .oc-popup button{background:#e94560;color:white;border:none;padding:12px;border-radius:8px;font-weight:700;font-size:15px;cursor:pointer;transition:background .15s}
  .oc-popup button:hover{background:#d63851}
  .oc-popup .oc-skip{display:block;margin-top:10px;color:#999;font-size:13px;cursor:pointer;text-decoration:underline}
  .oc-popup .oc-ok{color:#22c55e;font-weight:600;font-size:16px}

  @media(max-width:500px){
    .oc-newsletter form{flex-direction:column}
    .oc-popup{padding:24px 18px}
  }
  `;
  document.head.appendChild(css);

  /* ── Helpers ── */
  var path = location.pathname;

  function detectPageType(){
    if(path.includes('/best-vps') || path.includes('/easysetup') || path.includes('/cost-guide')) return 'vps';
    if(path.includes('/compare/')) return 'compare';
    if(path.includes('/guides/')) return 'guide';
    if(path.includes('/integrations/')) return 'integration';
    return 'other';
  }

  /* ── Affiliate Top Pick Card ── */
  function injectTopPick(){
    var article = document.querySelector('article');
    if(!article) return;

    var type = detectPageType();
    var card = document.createElement('div');
    card.className = 'oc-top-pick';

    if(type === 'vps'){
      // VPS page already has affiliate content, skip
      return;
    } else if(type === 'compare' || type === 'guide' || type === 'integration'){
      card.innerHTML = '<h3>🚀 Ready to Build Your AI Agent?</h3>'
        + '<p>Get started with OpenClaw on a fast VPS. Vultr offers $300 free credit for new users — enough to run your AI agent for months.</p>'
        + '<a class="oc-btn" href="https://www.vultr.com/?ref=9738617-8H" target="_blank" rel="noopener sponsored">Get $300 Free Credit →</a>'
        + '<div class="oc-price">Plans start at $6/mo after credits. <a href="/best-vps-for-openclaw" style="color:#15803d">See all VPS options →</a></div>';
    } else {
      return;
    }

    // Insert before the last section or at end of article
    var sections = article.querySelectorAll('h2');
    if(sections.length > 2){
      sections[sections.length - 1].parentNode.insertBefore(card, sections[sections.length - 1]);
    } else {
      article.appendChild(card);
    }
  }

  /* ── VPS Comparison Table ── */
  function injectComparisonTable(){
    var article = document.querySelector('article');
    if(!article) return;

    var type = detectPageType();
    // Only show on guide and integration pages (not VPS pages which have their own tables)
    if(type !== 'guide' && type !== 'integration') return;

    var table = document.createElement('div');
    table.className = 'oc-compare';
    table.innerHTML = '<h3>🔥 Best VPS for OpenClaw — Quick Compare</h3>'
      + '<table>'
      + '<thead><tr><th>Provider</th><th>Price</th><th>CPU</th><th>RAM</th><th></th></tr></thead>'
      + '<tbody>'
      + '<tr><td><strong>Vultr</strong></td><td>$6/mo</td><td>1 vCPU</td><td>2GB</td><td><a href="https://www.vultr.com/?ref=9738617-8H" target="_blank" rel="noopener sponsored">View →</a></td></tr>'
      + '<tr class="oc-best"><td><strong>Hetzner</strong> ⭐</td><td>€4.15/mo</td><td>2 vCPU</td><td>4GB</td><td><a href="https://www.hetzner.com/cloud/" target="_blank" rel="noopener">View →</a></td></tr>'
      + '<tr><td><strong>DigitalOcean</strong></td><td>$4/mo</td><td>1 vCPU</td><td>512MB</td><td><a href="https://m.do.co/c/abc123" target="_blank" rel="noopener sponsored">View →</a></td></tr>'
      + '</tbody>'
      + '</table>';

    // Insert before the newsletter box
    var newsletter = article.querySelector('.oc-newsletter');
    if(newsletter){
      article.insertBefore(table, newsletter);
    } else {
      article.appendChild(table);
    }
  }

  /* ── Newsletter Box ── */
  function injectNewsletter(){
    var article = document.querySelector('article');
    if(!article) return;

    var box = document.createElement('div');
    box.className = 'oc-newsletter';
    box.innerHTML = '<h3>📬 Get the OpenClaw Weekly</h3>'
      + '<p>Tips, tutorials, and new agent skills — delivered every Thursday. Free.</p>'
      + '<form id="oc-nl-form"><input type="email" placeholder="you@example.com" required><button type="submit">Subscribe</button></form>'
      + '<div class="oc-note">No spam. Unsubscribe anytime.</div>';

    article.appendChild(box);

    // Handle submit
    var form = document.getElementById('oc-nl-form');
    if(form) form.addEventListener('submit', function(e){
      e.preventDefault();
      var email = form.querySelector('input').value;
      // Store locally (replace with real endpoint later)
      var subs = JSON.parse(localStorage.getItem('oc_subs') || '[]');
      subs.push({email: email, ts: Date.now(), page: path});
      localStorage.setItem('oc_subs', JSON.stringify(subs));
      form.innerHTML = '<div class="oc-ok">✅ You\'re in! Check your inbox.</div>';
    });
  }

  /* ── Exit Intent Popup ── */
  function injectExitPopup(){
    if(sessionStorage.getItem('oc_popup_shown')) return;
    if(localStorage.getItem('oc_popup_dismissed')) return;

    var overlay = document.createElement('div');
    overlay.className = 'oc-overlay';
    overlay.innerHTML = '<div class="oc-popup">'
      + '<button class="oc-close" aria-label="Close">&times;</button>'
      + '<h2>Wait — Free PDF Guide! 📖</h2>'
      + '<p>Get our <strong>"OpenClaw Setup Checklist"</strong> — a step-by-step PDF covering VPS setup, agent configuration, and deployment best practices.</p>'
      + '<form id="oc-exit-form"><input type="email" placeholder="Your email" required><button type="submit">Send Me the Guide</button></form>'
      + '<span class="oc-skip" id="oc-exit-skip">No thanks, I\'ll figure it out</span>'
      + '</div>';

    document.body.appendChild(overlay);

    function closePopup(){
      overlay.classList.remove('active');
      sessionStorage.setItem('oc_popup_shown', '1');
    }

    overlay.querySelector('.oc-close').addEventListener('click', function(){
      closePopup();
      localStorage.setItem('oc_popup_dismissed', '1');
    });

    document.getElementById('oc-exit-skip').addEventListener('click', function(){
      closePopup();
      localStorage.setItem('oc_popup_dismissed', '1');
    });

    overlay.addEventListener('click', function(e){
      if(e.target === overlay) closePopup();
    });

    var exitForm = document.getElementById('oc-exit-form');
    if(exitForm) exitForm.addEventListener('submit', function(e){
      e.preventDefault();
      var email = exitForm.querySelector('input').value;
      var subs = JSON.parse(localStorage.getItem('oc_subs') || '[]');
      subs.push({email: email, ts: Date.now(), page: path, source: 'exit_popup'});
      localStorage.setItem('oc_subs', JSON.stringify(subs));
      exitForm.innerHTML = '<div class="oc-ok">✅ Check your inbox!</div>';
      setTimeout(closePopup, 2000);
    });

    // Trigger on mouse leave (desktop) or after 45s (mobile)
    var triggered = false;
    document.addEventListener('mouseout', function(e){
      if(triggered) return;
      if(e.clientY < 5 && e.relatedTarget == null){
        triggered = true;
        overlay.classList.add('active');
      }
    });

    // Mobile fallback: show after 45 seconds
    setTimeout(function(){
      if(!triggered && !sessionStorage.getItem('oc_popup_shown')){
        triggered = true;
        overlay.classList.add('active');
      }
    }, 45000);
  }

  /* ── Init ── */
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init(){
    // Don't inject on homepage, privacy, terms
    if(path === '/' || path === '/index.html' || path.includes('privacy') || path.includes('terms') || path.includes('disclosure')) return;
    injectTopPick();
    injectComparisonTable();
    injectNewsletter();
    injectExitPopup();
  }
})();
