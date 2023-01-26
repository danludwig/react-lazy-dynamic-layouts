import { syncConfig } from 'tools/config';
import log from 'tools/log';

// todo: make this work with suspense
export const fetchWeatherData = async (
    lat: string,
    lon: string
): Promise<FetchResult<WeatherServiceData>> => {
    const querystring = new URLSearchParams({
        lat: lat,
        lon: lon,
    });
    const url = `${syncConfig.servicesUrl}/integration/weather?${querystring}`;
    try {
        const response = await fetch(url);
        const { data, error }: FetchResult<WeatherServiceData> = await response.json();
        if (error) {
            log.warn(`User encountered server error @ ${url}`);
        }
        return { data, error };
    } catch (error: any) {
        log.warn(`User encountered likely network error @ ${url}`);
        throw error;
    }
};
