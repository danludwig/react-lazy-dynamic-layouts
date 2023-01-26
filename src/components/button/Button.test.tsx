import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import PageContext, { initialState } from 'state/PageContext';
import Button, { ButtonProps } from './Button';
import { assignPageVariable } from 'state/assignPageVariable'; // don't test this

jest.mock('state/assignPageVariable');

describe('<Button />', () => {
    let action = 'test action';
    const actionCreator = assignPageVariable as jest.Mock;
    const dispatch = jest.fn();

    const defaultProps: ButtonProps = {
        key: 'test key',
        text: 'test text',
        data: {
            id: -1,
            type: 'button',
        },
    };

    const reactify = (props: Partial<ButtonProps> = {}) => {
        return render(
            <PageContext.Provider
                value={[
                    initialState,
                    dispatch,
                ]}
            >
                <Button {...defaultProps} {...props} />
            </PageContext.Provider>
        );
    };

    beforeEach(() => {
        actionCreator.mockReturnValueOnce(action);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders text in an unwrapped <button />', () => {
        const wrapper = reactify();
        const rootNode = wrapper.asFragment().getRootNode().childNodes[0];
        expect(rootNode.nodeName).toStrictEqual('BUTTON');
        const button = wrapper.getByRole('button');
        expect(button?.className).toStrictEqual('pageButton');

        const label = button?.children[0] as HTMLLabelElement;
        expect(label?.textContent).toStrictEqual(defaultProps.text);
    });

    describe('when it is assigned a variable value', () => {
        const props = {
            variable: 'test variable',
            value: 'test value',
        };

        it('clicking it dispatches an action to assign that variable value in state', async () => {
            const wrapper = reactify(props);
            const button = wrapper.getByRole('button');
            fireEvent.click(button);
            expect(actionCreator).toBeCalledTimes(1);
            expect(actionCreator).toBeCalledWith({ ...props });
            expect(dispatch).toBeCalledTimes(1);
            expect(dispatch).toBeCalledWith(action);
        });
    });
});
