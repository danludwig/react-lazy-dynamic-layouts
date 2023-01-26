import cloudyIcon from 'icons/cloudy.svg';
import rainIcon from 'icons/rain.svg';
import clearDayIcon from 'icons/clear-day.svg';

// todo: code split icons to only load what's used
const iconMap: Record<string, string> = {
    cloudy: cloudyIcon,
    'clear-day': clearDayIcon,
    rain: rainIcon,
};

const conditionIcon = (condition: string): string => {
    return iconMap[condition];
};

export default conditionIcon;
