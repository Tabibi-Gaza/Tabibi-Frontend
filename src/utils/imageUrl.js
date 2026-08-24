const FILES_URL = import.meta.env.VITE_Files_URL || "";

export const resolveImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${FILES_URL}/${url}`;
};

export default resolveImageUrl;
