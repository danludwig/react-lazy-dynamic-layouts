import showIcon from 'icons/show.svg';
import hideIcon from 'icons/hide.svg';
import locationIcon from 'icons/location.svg';

// todo: code split icons to only load what's used
const iconMap: Record<string, string> = {
    show: showIcon,
    hide: hideIcon,
};

const getButtonIcon = (variableName?: string, variableValue?: string): string => {
    switch (variableName) {
        case 'location':
            return locationIcon;

        default:
            if (['show', 'hide'].includes(variableValue || '')) return iconMap[variableValue || ''];
            return '';
    }
};

export default getButtonIcon;
