
/**
 * Global configuration for the landing page.
 * VITE_APP_URL can be set in .env for local development to point to the frontend app (e.g., http://localhost:8000).
 * By default, it uses relative paths, which is the "correct" way for unified deployments.
 */
export const APP_URL = import.meta.env.VITE_APP_URL || '';

// Debug log for production connectivity
if (import.meta.env.PROD) {
    console.log('🌐 NourishLab Connectivity:', APP_URL ? `Pointing to ${APP_URL}` : 'Relative Routing Active');
}

/**
 * Helper to get the correct link to the application.
 * @param path The path in the app (e.g., '/login')
 */
export const getAppLink = (path: string) => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${APP_URL}${cleanPath}`;
};
