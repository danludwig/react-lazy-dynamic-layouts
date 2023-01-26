import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import PageContext from 'state/PageContext';
import Condition, { ConditionProps } from './Condition';

describe('<Condition />', () => {
    const childrenTestId = 'condition-children';
    const defaultProps: ConditionProps = {
        key: 'test key',
        data: {
            id: -1,
            type: 'button',
        },
        variable: 'test default variable',
        children: <div data-testid={childrenTestId}>test children</div>,
    };

    const defaultState: PageState = {
        variables: {
            'var-one': {
                type: 'string',
                name: 'var-one',
                currentValue: 'var-one-val',
            },
        },
    };

    const reactify = (props: Partial<ConditionProps> = {}) => {
        return render(
            <PageContext.Provider value={[defaultState, jest.fn()]}>
                <Condition {...defaultProps} {...props} />
            </PageContext.Provider>
        );
    };

    describe('when the condition is satisfied', () => {
        const props = {
            variable: 'var-one',
            value: 'var-one-val',
        };

        it('its children are rendered', async () => {
            const wrapper = reactify(props);
            const children = wrapper.getByTestId(childrenTestId);
            expect(children).toBeInTheDocument();
        });
    });
    describe('otherwise, the condition is unsatisfied', () => {
        const props = {
            variable: 'var-one',
            value: 'anything-else-that-is-not-var-one-val',
        };

        it('and it returns null instead of rendering children', async () => {
            const component = reactify(props);
            const children = component.queryByTestId(childrenTestId);
            expect(children).toStrictEqual(null);
            expect(children).not.toBeInTheDocument();
        });
    });
});
