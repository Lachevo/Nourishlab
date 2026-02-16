/**
 * Helper function to construct full media URLs.
 * Handles relative paths by prepending the API origin if available.
 */
export const getMediaUrl = (path: string | null | undefined): string | undefined => {
    if (!path) return undefined;
    if (path.startsWith('http')) return path;

    // Get API URL from env
    const apiUrl = import.meta.env.VITE_API_URL;

    if (apiUrl && apiUrl.startsWith('http')) {
        try {
            const url = new URL(apiUrl);
            // Construct absolute URL using API origin
            // Remove leading slash from path to avoid double slashes if using simple concatenation? 
            // URL constructor handles slashes well.
            return new URL(path, url.origin).toString();
        } catch (e) {
            console.error('Error constructing media URL:', e);
        }
    }

    return path;
};
