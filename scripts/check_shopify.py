import os
import json
import urllib.request

env_vars = {}
with open('.env.local', 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith('#') and '=' in line:
            k, v = line.split('=', 1)
            env_vars[k.strip()] = v.strip().strip('"').strip("'")

domain = env_vars.get('SHOPIFY_STORE_DOMAIN')
token = env_vars.get('SHOPIFY_STOREFRONT_PRIVATE_TOKEN') or env_vars.get('SHOPIFY_STOREFRONT_ACCESS_TOKEN')

query = """
{
  products(first: 20) {
    edges {
      node {
        id
        handle
        title
        images(first: 1) { edges { node { url altText } } }
      }
    }
  }
}
"""

req = urllib.request.Request(
    f"https://{domain}/api/2024-01/graphql.json",
    data=json.dumps({"query": query}).encode("utf-8"),
    headers={
        "Content-Type": "application/json",
        "Shopify-Storefront-Private-Token": token,
    }
)
try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        print(json.dumps(data, indent=2))
except Exception as e:
    print("Shopify fetch err:", e)
