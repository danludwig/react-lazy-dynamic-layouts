import Wrapper from './Wrapper';
import LoadingSuspense from 'components/LoadingSuspense';
import CircuitBreaker from './CircuitBreaker';
import WeatherCard from './WeatherCard';

interface WeatherContentProps {
    componentId: number;
    isLoading: boolean;
    isCircuitBroken: boolean;
    weatherData: WeatherServiceData | null;
    retryLoadWeather: () => void;
}

const WeatherContent = ({
    componentId,
    isLoading,
    isCircuitBroken,
    weatherData,
    retryLoadWeather,
}: WeatherContentProps): JSX.Element => {
    if (isLoading) {
        return (
            <Wrapper>
                <LoadingSuspense />
            </Wrapper>
        );
    }

    if (isCircuitBroken || !weatherData) {
        return <CircuitBreaker retryLoadWeather={retryLoadWeather} />;
    }

    return <WeatherCard {...{ ...weatherData, componentId }} />;
};

export default WeatherContent;
