import { useContext, useMemo } from 'react';
import PageContext from 'state/PageContext';

export interface ConditionProps extends DynamicComponentProps {
    variable: string;
    value?: string;
    children: React.ReactNode;
}

const Condition: React.FC<ConditionProps> = ({ children, variable, value }) => {
    const [{ variables }] = useContext(PageContext);

    const variableData = useMemo(() => variables[variable], [variables, variable]);

    const isSatisfied = useMemo(
        () => variableData.currentValue === value,
        [variableData.currentValue, value]
    );

    return useMemo(() => (isSatisfied ? <>{children}</> : null), [isSatisfied, children]);
};

export default Condition;
