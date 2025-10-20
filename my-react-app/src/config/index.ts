export const config = {
    api: {
        baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
        timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 5000,
    },
    app: {
        title: import.meta.env.VITE_APP_NAME || 'FinanSys',
        version: import.meta.env.VITE_APP_VERSION || '1.0.0',
        environment: import.meta.env.VITE_APP_ENVIRONMENT || import.meta.env.MODE || 'development',
    },
    server: {
        port: Number(import.meta.env.CLIENT_PORT) || 3000,
    },
} as const;