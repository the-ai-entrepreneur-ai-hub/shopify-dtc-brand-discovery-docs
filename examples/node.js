// Shopify DTC Brand Discovery — Node.js example
// Requires Node 18+ (built-in fetch)

const TOKEN = process.env.APIFY_TOKEN;
if (!TOKEN) throw new Error('Set APIFY_TOKEN env var. Get one at https://console.apify.com/account/integrations');

const BASE = 'https://george-the-developer--shopify-dtc-brand-discovery.apify.actor';

async function discover(keyword, { country = 'US', limit = 25, enrichment = 'full' } = {}) {
  const url = `${BASE}/discover?keyword=${encodeURIComponent(keyword)}&country=${country}&limit=${limit}&enrichment=${enrichment}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
  if (!res.ok) throw new Error(`Discover failed: ${res.status}`);
  return res.json();
}

async function enrich(storeUrl) {
  const url = `${BASE}/enrich?store_url=${encodeURIComponent(storeUrl)}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
  if (!res.ok) throw new Error(`Enrich failed: ${res.status}`);
  return res.json();
}

async function enrichBulk(storeUrls) {
  const res = await fetch(`${BASE}/enrich/bulk`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ store_urls: storeUrls }),
  });
  if (!res.ok) throw new Error(`Bulk enrich failed: ${res.status}`);
  return res.json();
}

// Use case: find skincare brands with no SMS app
const result = await discover('skincare', { limit: 50, enrichment: 'full' });
const targets = result.stores
  .filter(s => s.tech_stack?.sms?.length === 0)
  .sort((a, b) => (b.opportunity_score || 0) - (a.opportunity_score || 0));

console.log(`${targets.length} skincare brands without SMS, sorted by opportunity score`);
console.log(targets.slice(0, 5).map(s => ({ url: s.store_url, score: s.opportunity_score, angles: s.pitch_angles })));
