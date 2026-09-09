const FILES_URL = import.meta.env.VITE_Files_URL || "";

export const resolveImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${FILES_URL}/${url}`;
};

/** Cloudinary PNG transform so html2canvas can capture the image with CORS. */
export const toCorsSignatureUrl = (url) => {
    const resolved = resolveImageUrl(url);
    if (!resolved) return null;
    if (resolved.includes('res.cloudinary.com') && resolved.includes('/upload/')) {
        return resolved.replace('/upload/', '/upload/f_png,fl_immutable_cache/');
    }
    return resolved;
};

export const waitForElementImages = (element) => {
    if (!element) return Promise.resolve();
    const images = [...element.querySelectorAll('img')];
    return Promise.all(images.map((img) => {
        if (img.complete && img.naturalWidth > 0) return Promise.resolve();
        return new Promise((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
        });
    }));
};

export default resolveImageUrl;
