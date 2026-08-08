# Shopify Order Confirmation Email — Kobbo website links

Paste this into **Shopify Admin → Settings → Notifications → Order confirmation** (or the email you’re editing).

## 1) Add this near the top (after the first `{% assign %}` blocks)

```liquid
{% comment %} Headless storefront URL (not myshopify.com) {% endcomment %}
{% assign kobbo_website_url = 'https://www.kobbo.in' %}
```

## 2) Find & replace in the template

| Find | Replace with |
|------|----------------|
| `{{shop.url}}` | `{{ kobbo_website_url }}` |
| `{{ shop.url }}` | `{{ kobbo_website_url }}` |

**Do NOT change:**
- `{{ order_status_url }}` — Shopify order tracking (keep as is)
- `{{ shop_app_tracking_url }}` — Shop app tracking (keep as is)
- `mailto:{{ shop.email }}` — email contact (keep as is)

## 3) Optional: stronger footer (replace the disclaimer paragraph)

Find:

```liquid
<p class="disclaimer__subtext">If you have any questions, reply to this email or contact us at <a href="mailto:{{ shop.email }}">{{ shop.email }}</a></p>
```

Replace with:

```liquid
<p class="disclaimer__subtext">
  If you have any questions, reply to this email or contact us at
  <a href="mailto:{{ shop.email }}">{{ shop.email }}</a>.
  Visit our store: <a href="{{ kobbo_website_url }}">www.kobbo.in</a>
</p>
```

## What this fixes

Logo / shop name, **Visit our store**, and footer links will open **https://www.kobbo.in** instead of the Shopify admin/myshopify domain.
