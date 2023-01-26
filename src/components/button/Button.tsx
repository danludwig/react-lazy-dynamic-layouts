import { useCallback, useContext, useMemo } from 'react';
import PageContext from 'state/PageContext';
import { assignPageVariable } from 'state/assignPageVariable';
import mcss from './s.module.css';
import getButtonIcon from './getButtonIcon';

export interface ButtonProps extends DynamicComponentProps {
    text: string;
    variable?: string;
    value?: string; // todo: make it work with variable types other than string
}

const Button = ({ text, variable, value }: ButtonProps): JSX.Element => {
    const [, dispatch] = useContext(PageContext);
    const onClick = useCallback(() => {
        if (!variable || !variable.length) {
            return;
        }

        return dispatch(
            assignPageVariable({
                variable,
                value,
            })
        );
    }, [variable, value, dispatch]);

    return useMemo(() => {
        const buttonIcon = variable && value && getButtonIcon(variable, value);
        return (
            <button onClick={onClick} className={mcss.pageButton}>
                <label>{text}</label>
                {!!buttonIcon && <img src={buttonIcon} alt="" />}
            </button>
        );
    }, [onClick, text, variable, value]);
};

export default Button;
