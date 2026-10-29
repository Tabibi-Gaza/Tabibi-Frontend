import { useEffect } from 'react';

const SITE = 'https://tabibi-frontend.apps.taqat.academy';
const DEFAULT_IMAGE = `${SITE}/images/og-cover.jpg`;

function setMeta(name, content, attr = 'name') {
  if (content == null) return;
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel, href, extra = {}) {
  if (!href) return;
  let el = document.querySelector(`link[rel="${rel}"]${extra.selector || ''}`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    Object.entries(extra.attrs || {}).forEach(([k, v]) => el.setAttribute(k, v));
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function useSEO({
  title,
  description,
  path = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
  noindex = false,
  jsonLd = null,
} = {}) {
  useEffect(() => {
    const url = `${SITE}${path === '/' ? '/' : path}`;
    if (title) document.title = title;

    if (description) setMeta('description', description);
    setMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    setLink('canonical', url);

    // Open Graph
    if (title) setMeta('og:title', title, 'property');
    if (description) setMeta('og:description', description, 'property');
    setMeta('og:type', type, 'property');
    setMeta('og:url', url, 'property');
    setMeta('og:image', image, 'property');
    setMeta('og:site_name', 'Tabibi طبيبي', 'property');

    // Twitter
    if (title) setMeta('twitter:title', title);
    if (description) setMeta('twitter:description', description);
    setMeta('twitter:image', image);

    // JSON-LD
    document.querySelectorAll('script[data-seo="1"]').forEach((n) => n.remove());
    if (jsonLd) {
      const items = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      items.forEach((obj) => {
        const s = document.createElement('script');
        s.type = 'application/ld+json';
        s.setAttribute('data-seo', '1');
        s.textContent = JSON.stringify(obj);
        document.head.appendChild(s);
      });
    }

    return () => {
      document.querySelectorAll('script[data-seo="1"]').forEach((n) => n.remove());
    };
  }, [title, description, path, image, type, noindex, jsonLd]);
}

export default useSEO;
