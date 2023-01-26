import { buildEchoActionCreator } from './actions';

const actionType = 'ASSIGN_PAGE_VARIABLE';

export interface AssignPageVariableActionPayload {
    variable: string;
    value?: string; // todo: genericize for non-string variable types
}

export const assignPageVariable: ActionEchoCreator<AssignPageVariableActionPayload> =
    buildEchoActionCreator(actionType);

const reducer = (
    state: PageState,
    { payload }: PageAction<AssignPageVariableActionPayload>
): PageState => {
    const { variable, value } = payload;
    const nextState: PageState = {
        ...state,
        variables: {
            ...state?.variables,
            [variable]: {
                ...state?.variables[variable],
                currentValue: value,
            },
        },
    };

    return nextState;
};

const registryEntry = { actionType, reducer };

export default registryEntry;
