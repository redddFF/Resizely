# Caching Headers Guide

This project is deployed on Vercel and now includes long-lived caching headers for image files in `vercel.json`.

## Vercel (implemented)

The current Vercel config sets long-lived caching for these extensions:

- `.jpg`
- `.jpeg`
- `.png`
- `.gif`
- `.svg`

Headers applied:

- `Cache-Control: public, max-age=31536000, immutable`
- `Expires: Thu, 31 Dec 2037 23:55:55 GMT`

## Apache (.htaccess) example

Use this in your Apache site root `.htaccess`:

```apache
<IfModule mod_expires.c>
  ExpiresActive On

  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

<IfModule mod_headers.c>
  <FilesMatch "\.(jpe?g|png|gif|svg)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
</IfModule>
```

## NGINX server block example

Add this inside your `server { ... }` block:

```nginx
location ~* \.(jpg|jpeg|png|gif|svg)$ {
    expires 365d;
    add_header Cache-Control "public, max-age=31536000, immutable" always;
}
```

## CMS recommendation (WordPress)

For WordPress users who prefer plugin configuration instead of manual server edits:

- Use one of these caching plugins:
  - WP Rocket
  - W3 Total Cache
  - LiteSpeed Cache

Suggested plugin settings:

- Browser Cache: Enabled
- Cache-Control for static images: `max-age=31536000`
- Expires Header for images: `1 year`
- Optional: Enable filename/version-based cache busting so immutable caching is safe after asset changes

## Notes

- Long expiration is best for static versioned assets.
- If you replace images without changing filenames, users may keep old versions until cache expires. Prefer hashed or versioned filenames when possible.
