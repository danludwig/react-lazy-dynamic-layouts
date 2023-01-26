import art from './art.svg';
import mcss from './s.module.css';

interface NotFoundScreenProps {
    message?: string;
}

const NotFoundScreen = ({ message }: NotFoundScreenProps): JSX.Element => {
    return (
        <div className={mcss.wrapper}>
            <h2>{message}</h2>
            <img src={art} alt="Person viewing page not found screen" />
        </div>
    );
};

export default NotFoundScreen;
