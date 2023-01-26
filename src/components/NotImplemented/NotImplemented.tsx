import { syncConfig } from 'tools/config';
import mcss from './s.module.css';

const NotImplemented = ({ data }: DynamicComponentProps): JSX.Element | null => {
    const { isLocalhost } = syncConfig;
    if (!isLocalhost) return null;
    return (
        <div className={mcss.wrapper}>
            <h3>
                The server specified a(n) "{data.type}" component, but none was found at{' '}
                <code>./src/components/{data.type}</code>
            </h3>
        </div>
    );
};

export default NotImplemented;
