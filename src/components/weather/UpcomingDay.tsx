import mcss from './s.module.css';
import getConditionIcon from './getConditionIcon';

export interface UpcomingDayProps {
    parentId: number;
    data: WeatherServiceUpcoming;
}

const UpcomingDay = ({
    data: { day, conditionName, condition },
    parentId,
}: UpcomingDayProps): JSX.Element => {
    const iconSrc = getConditionIcon(condition);
    const iconId = `weather_${parentId}_condition_${day}`;

    return (
        <li className={mcss.upcoming}>
            <img id={iconId} src={iconSrc} alt={conditionName} />
            <label htmlFor={iconId}>{day}</label>
        </li>
    );
};

export default UpcomingDay;
