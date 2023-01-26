interface SyncConfig {
    servicesUrl: string;
    isLocalhost?: boolean;
}

const getSyncConfig = (): SyncConfig => {
    const servicesUrl = process.env.REACT_APP_SERVICES_URL;
    if (!servicesUrl) {
        throw new Error('Could not determine server API URL, check environment variables');
    }
    return {
        servicesUrl,
        isLocalhost: window.location.hostname === 'localhost',
    };
};

export const syncConfig = getSyncConfig();
