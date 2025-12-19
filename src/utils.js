/*
 * utils.js
 * Small helper utilities used across the app. Keep these functions lightweight and side-effect free.
 */
export function createPageUrl(pageName) {
    if (!pageName) return '/';
    const name = String(pageName).trim();
    if (name.toLowerCase() === 'home') return '/';
    // convert "My Page" -> "my-page"
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    return `/${encodeURIComponent(slug)}`;
}

const utils = { createPageUrl };
export default utils;
