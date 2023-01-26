import log from 'tools/log';
import initPageVariables from './initPageVariables';
import setVariableValue from './assignPageVariable';

const modules: any[] = [initPageVariables, setVariableValue];

const registry = new Map<string, PageReducer>();
const isNotStrict = process.env.NODE_ENV === 'development'; // strict in tests & prod

for (const { actionType, reducer } of modules) {
    if (!registry.has(actionType)) {
        if (typeof reducer !== 'function') {
            if (isNotStrict) {
                log.warn(
                    `Skipping non-function reducer registration for action type ` +
                        `'${actionType}'. You may see false positives due to hmr, ` +
                        `if this is a real problem then a unit test should fail.`
                );
            } else {
                throw new Error(
                    `A module tried to register a non-function reducer for ` +
                        `action type '${actionType}'. Make sure that the ` +
                        `reducer it's paired with is really a function.`
                );
            }
        } else {
            registry.set(actionType, reducer);
            continue;
        }
    }

    let message = `Detected multiple reducer functions for the action type '${actionType}'.`;
    if (isNotStrict) {
        message +=
            ` You may see false positives due to hmr, if this is a real ` +
            `problem then a unit test should fail. Skipping the duplicate ` +
            `function for this action type.`;
        log.warn(message);
        continue;
    }

    throw new Error(message);
}

const reducers: PageReducer = (state, action) => {
    if (registry.has(action.type)) {
        const reducer = registry.get(action.type);
        return reducer!(state, action);
    }

    if (isNotStrict) {
        log.warn(
            `Could not find reducer for action type '${action.type}', did you ` +
                `forget to register it with the main reducer?`
        );
    }

    throw new Error(`Could not find reducer registration for action type ${action.type}`);
};

export default reducers;
