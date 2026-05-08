"""Shopify DTC Brand Discovery — Python example"""
import os
import urllib.parse
import requests

TOKEN = os.getenv("APIFY_TOKEN")
if not TOKEN:
    raise RuntimeError("Set APIFY_TOKEN env var. Get one at https://console.apify.com/account/integrations")

BASE = "https://george-the-developer--shopify-dtc-brand-discovery.apify.actor"
HEADERS = {"Authorization": f"Bearer {TOKEN}"}


def discover(keyword: str, country: str = "US", limit: int = 25, enrichment: str = "full") -> dict:
    qs = urllib.parse.urlencode({"keyword": keyword, "country": country, "limit": limit, "enrichment": enrichment})
    r = requests.get(f"{BASE}/discover?{qs}", headers=HEADERS, timeout=120)
    r.raise_for_status()
    return r.json()


def enrich(store_url: str) -> dict:
    qs = urllib.parse.urlencode({"store_url": store_url})
    r = requests.get(f"{BASE}/enrich?{qs}", headers=HEADERS, timeout=60)
    r.raise_for_status()
    return r.json()


def enrich_bulk(store_urls: list[str]) -> dict:
    r = requests.post(f"{BASE}/enrich/bulk", headers=HEADERS, json={"store_urls": store_urls}, timeout=300)
    r.raise_for_status()
    return r.json()


# Use case: feed Klaviyo agency outbound. Find stores with no email tool
result = discover("pet supplements", limit=50, enrichment="full")
no_email = [
    s for s in result["stores"]
    if not s.get("tech_stack", {}).get("email")
]
no_email.sort(key=lambda s: s.get("opportunity_score", 0), reverse=True)

print(f"{len(no_email)} pet-supplement brands with NO email marketing tool")
for s in no_email[:5]:
    print(f"  {s['store_url']:40s}  score={s.get('opportunity_score', 0)}  email={s.get('contact', {}).get('email')}")
