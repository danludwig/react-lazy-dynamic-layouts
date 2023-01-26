import { useMemo } from 'react';
import mcss from './s.module.css';

export interface ImageProps extends DynamicComponentProps {
    src: string;
    alt?: string;
}

const Image = ({ src, alt }: ImageProps): JSX.Element => {
    return useMemo(
        () => (
            // todo: no wrapper
            <div className={mcss.wrapper}>
                <img src={src} alt={alt} className="bg-blue" />
            </div>
        ),
        [src, alt]
    );
};

export default Image;
