import Wrapper from './Wrapper';
import getConditionIcon from './getConditionIcon';
import UpcommingDay from './UpcomingDay';
import mcss from './s.module.css';
import { useMemo } from 'react';

interface WeatherCardProps extends WeatherServiceData {
    componentId: number;
}

const WeatherCard = ({
    componentId,
    condition,
    conditionName,
    temperature,
    unit,
    location,
    upcomming,
}: WeatherCardProps): JSX.Element => {
    const nowIconId = useMemo(() => `weather_${componentId}_condition`, [componentId]);
    const conditionIcon = useMemo(() => getConditionIcon(condition), [condition]);

    return (
        <Wrapper className={mcss.weatherGrid}>
            <img
                id={nowIconId}
                src={conditionIcon}
                alt={conditionName}
                className={mcss.conditionIcon}
            />
            {/* todo: better css grid to avoid wrapping temp & condition text
                separately from icon, they are a unit */}
            <div className={mcss.conditionWrapper}>
                <mark>
                    {temperature}°{unit?.toUpperCase()}
                </mark>
                <label htmlFor={nowIconId}>{conditionName}</label>
            </div>
            <div className={mcss.locationWrapper}>{location}</div>
            <ol className={mcss.upcomings}>
                {upcomming.map((data) => (
                    <UpcommingDay key={data.day} data={data} parentId={componentId} />
                ))}
            </ol>
        </Wrapper>
    );
};

export default WeatherCard;
