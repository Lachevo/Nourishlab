/**
 * Helper function to construct full media URLs.
 * Handles relative paths by prepending the API origin if available.
 */
export const getMediaUrl = (path: string | null | undefined): string | undefined => {
    if (!path) return undefined;

    // If it's already an absolute URL, just handle protocol matching
    if (path.startsWith('http')) {
        // If we are on HTTPS, ensure the media URL is also HTTPS to avoid mixed content
        if (typeof window !== 'undefined' && window.location.protocol === 'https:' && path.startsWith('http:')) {
            return path.replace('http:', 'https:');
        }
        return path;
    }

    // Get API URL from env
    const apiUrl = import.meta.env.VITE_API_URL || '';

    // Fallback logic if apiUrl is relative or missing
    const base = apiUrl.startsWith('http') ? apiUrl : (typeof window !== 'undefined' ? window.location.origin : '');

    try {
        const baseUrl = new URL(base);

        let formattedPath = path;

        // If it's a relative path, ensure it starts with /
        if (!formattedPath.startsWith('/') && !formattedPath.startsWith('http')) {
            formattedPath = `/${formattedPath}`;
        }

        // If the path doesn't already contain /media/ and we expect it to (Django default)
        if (formattedPath.startsWith('/') && !formattedPath.startsWith('/media/') && !formattedPath.startsWith('/static/')) {
            formattedPath = `/media${formattedPath}`;
        }

        // Use the URL constructor to safely combine the base and path
        // We use baseUrl.origin to ensure we don't have multiple API path segments if apiUrl was something like /api
        return new URL(formattedPath, baseUrl.origin).toString();
    } catch (e) {
        console.error('Error constructing media URL:', e);
        return path;
    }
};
