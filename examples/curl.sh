#!/usr/bin/env bash
# Shopify DTC Brand Discovery — curl examples
# Get your Apify token from https://console.apify.com/account/integrations

TOKEN="${APIFY_TOKEN:-your-token-here}"
BASE="https://george-the-developer--shopify-dtc-brand-discovery.apify.actor"

echo "=== Discover 10 skincare brands (basic) ==="
curl -s "$BASE/discover?keyword=skincare&limit=10&enrichment=basic" \
  -H "Authorization: Bearer $TOKEN" | jq '.stores[:3]'

echo ""
echo "=== Discover with full enrichment ==="
curl -s "$BASE/discover?keyword=men's%20grooming&limit=5&enrichment=full" \
  -H "Authorization: Bearer $TOKEN" | jq '.stores[0]'

echo ""
echo "=== Enrich one store ==="
curl -s "$BASE/enrich?store_url=https://allbirds.com" \
  -H "Authorization: Bearer $TOKEN" | jq

echo ""
echo "=== Bulk enrich (POST) ==="
curl -s -X POST "$BASE/enrich/bulk" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"store_urls":["https://allbirds.com","https://gymshark.com","https://ridge.com"]}' | jq '.results[0]'
