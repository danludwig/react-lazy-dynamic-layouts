import { syncConfig } from 'tools/config';
import art from './art.svg';
import mcss from './s.module.css';

interface ServiceUnavailableProps {
    message?: string;
}

const ServiceUnavailableScreen = ({ message }: ServiceUnavailableProps): JSX.Element => {
    const { isLocalhost } = syncConfig;
    return (
        <div className={mcss.wrapper}>
            <h2>{message}</h2>
            {isLocalhost && <h3>(Did you forget to start the server?)</h3>}
            <img src={art} alt="Person viewing server error screen" />
        </div>
    );
};

export default ServiceUnavailableScreen;
