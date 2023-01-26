import '@testing-library/react';
import { initialState } from './PageContext';
import { assignPageVariable } from './assignPageVariable';

describe('reducers.js (root reducer for PageState)', () => {
    describe('is operating normally', () => {
        const reducers = require('./reducers').default;

        it('when it finds a reducer for the action, invokes it, and returns next state', () => {
            const action = assignPageVariable({
                variable: 'test variable name',
                value: 'test variable value',
            });
            const { variables } = reducers(initialState, action);
            expect(variables[action.payload.variable].currentValue).toStrictEqual(
                action.payload.value
            );
        });
    });

    describe('is not configured correctly and needs to be fixed', () => {
        /**
         * You should only export one action type / reducer function pair for
         * consumption by the root reducer registry. if you need multiple
         * reducer functions, combine them before exporting a root reducer
         * registration entry from the imported module.
         */

        /**
         * Typescript should prevent you from importing a registration whose
         * `reducer` prop is not a function, but since there are ways it can
         * fail, the registration process verifies it and throws when it can't.
         */
        it(
            'when either there is more than one reducer for a given action type' +
                'or when it imports a registration module whose `reducer` prop ' +
                'is not a function.',
            () => {
                let error;
                try {
                    require('./reducers');
                } catch (err) {
                    error = err;
                }
                expect(error).toBeUndefined();
            }
        );

        it('when there is no registration for an action type that was dispatched to it', () => {
            const reducers = require('./reducers');
            let error: any;
            try {
                reducers({}, { type: 'unregistered', payload: 'test' });
            } catch (err) {
                error = err;
            }
            expect(error).not.toBeUndefined();
            expect(error.message.length).toBeGreaterThan(10);
        });
    });
});
