import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Image, { ImageProps } from './Image';

describe('<Image />', () => {
    const defaultProps: ImageProps = {
        key: 'test key',
        data: {
            id: -1,
            type: 'image',
        },
        src: 'http://test/src',
        alt: 'test alt',
    };

    const reactify = (props: Partial<ImageProps> = {}) => {
        return render(<Image {...defaultProps} {...props} />);
    };

    it('renders a wrapped <img /> element', async () => {
        const component = reactify();

        const wrapper = component.container.querySelector('div');
        expect(wrapper).toBeInTheDocument();
        expect(wrapper?.className).toStrictEqual('wrapper');

        const img = wrapper?.children[0] as HTMLImageElement;
        expect(img?.src).toStrictEqual(defaultProps.src);
        expect(img?.alt).toStrictEqual(defaultProps.alt);
    });
});
