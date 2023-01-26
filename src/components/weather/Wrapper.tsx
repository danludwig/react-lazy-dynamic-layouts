import React from 'react';
import mcss from './s.module.css';

interface WrapperProps {
    className?: string;
}

const Wrapper: React.FC<WrapperProps> = ({ children, className }) => {
    return (
        <article className={`${mcss.wrapper}${className ? ` ${className}` : ''}`}>
            {children}
        </article>
    );
};

export default Wrapper;
