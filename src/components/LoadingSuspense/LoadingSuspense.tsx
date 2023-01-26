import { useState, useEffect, useMemo } from 'react';
import spinnerIcon from 'icons/loading-spinner.svg';
import mcss from './s.module.css';

const defaultDebounceMilliseconds = 50;

interface LoadingSuspenseProps {
    debounceMilliseconds?: number;
}

const LoadingSuspense = ({ debounceMilliseconds }: LoadingSuspenseProps): JSX.Element => {
    const [isDebounced, setIsDebounced] = useState(debounceMilliseconds === 0);
    const debounceMs: number = useMemo(
        () =>
            typeof debounceMilliseconds === 'number'
                ? debounceMilliseconds
                : defaultDebounceMilliseconds,
        [debounceMilliseconds]
    );

    useEffect(() => {
        if (debounceMs > 0) {
            const timeout = setTimeout(() => setIsDebounced(true), debounceMs);
            return () => clearTimeout(timeout);
        }
    }, [debounceMs]);

    return useMemo(
        () =>
            !isDebounced ? (
                <></>
            ) : (
                <div className={mcss.wrapper}>
                    <img src={spinnerIcon} alt="Please wait..." />
                </div>
            ),
        [isDebounced]
    );
};

export default LoadingSuspense;
