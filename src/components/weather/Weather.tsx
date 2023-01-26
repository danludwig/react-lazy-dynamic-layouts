import React, { useCallback, useEffect, useMemo, useState } from 'react';
import WeatherContent from './WeatherContent';
import { fetchWeatherData } from 'services/fetchWeatherData';

interface WeatherProps extends DynamicComponentProps {
    lon?: string;
    lat?: string;
}

const Weather = ({
    lat: latText,
    lon: lonText,
    data: { id: componentId },
}: WeatherProps): JSX.Element => {
    const [isLoading, setIsLoading] = useState(true);
    const [weatherData, setWeatherData] = useState<WeatherServiceData | null>(null);
    const [isCircuitBroken, breakCircuit] = useState(false);

    useEffect(() => {
        if (
            typeof latText !== 'string' ||
            !latText.length ||
            typeof lonText !== 'string' ||
            !lonText.length
        ) {
            breakCircuit(true);
            return;
        }

        if (isCircuitBroken) {
            return;
        }

        const loadData = async (lat: string, lon: string) => {
            try {
                const { data, error } = await fetchWeatherData(lat, lon);
                if (error) {
                    breakCircuit(true);
                } else if (data) {
                    setWeatherData(data);
                }
                setIsLoading(false);
            } catch (error: any) {
                breakCircuit(true);
                setIsLoading(false);
            }
        };

        loadData(latText, lonText);
    }, [latText, lonText, isCircuitBroken]);

    const retryLoadWeather = useCallback(() => {
        setIsLoading(true);
        breakCircuit(false);
    }, []);

    return useMemo(() => {
        const weatherProps = {
            componentId,
            isLoading,
            isCircuitBroken,
            weatherData,
            retryLoadWeather,
        };
        return <WeatherContent {...weatherProps} />;
    }, [componentId, isLoading, isCircuitBroken, weatherData, retryLoadWeather]);
};

export default Weather;
