const cache = new Map();

export async function translateText(text, from = 'ar', to = 'en') {
  if (!text || !/[\u0600-\u06FF]/.test(text)) return text;
  const key = `${to}:${text}`;
  if (cache.has(key)) return cache.get(key);
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('translate failed');
    const json = await res.json();
    const translated = (Array.isArray(json?.[0]) ? json[0] : [])
      .map(seg => (Array.isArray(seg) ? seg[0] : ''))
      .join('');
    if (translated) {
      cache.set(key, translated);
      return translated;
    }
    return text;
  } catch {
    return text;
  }
}
