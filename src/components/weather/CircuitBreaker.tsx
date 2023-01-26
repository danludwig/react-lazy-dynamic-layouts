import React, { useEffect, useMemo, useState } from 'react';
import mcss from './s.module.css';
import Wrapper from './Wrapper';

interface CircuitBreakerProps {
    retryLoadWeather?: () => void;
}

const CircuitBreaker: React.FC<CircuitBreakerProps> = ({ retryLoadWeather }) => {
    const [isRetryThrottled, setRetryThrottled] = useState(true);

    useEffect(() => {
        // todo: exponential fallback
        const timer = setTimeout(() => setRetryThrottled(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    return useMemo(
        () => (
            <Wrapper className={mcss.circuitBreaker}>
                <h3>Weather Currently Unavailable</h3>
                <h4>We're working on getting it back</h4>
                {!isRetryThrottled && <button onClick={retryLoadWeather}>Try Again</button>}
            </Wrapper>
        ),
        [isRetryThrottled, retryLoadWeather]
    );
};

export default CircuitBreaker;
