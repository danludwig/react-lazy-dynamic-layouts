import { buildEchoActionCreator } from './actions';
import buildMapFromArray from 'state/buildMapFromArray';

// todo: better action type convention
const actionType = 'INIT_PAGE_VARIABLES';

export const initPageVariables: ActionEchoCreator<PageServiceVariable[] | undefined> =
    buildEchoActionCreator(actionType);

const reducer = (
    state: PageState,
    { payload }: PageAction<PageServiceVariable[] | undefined>
): PageState => {
    if (payload === undefined) return state;

    const variables: PageUiVariables = buildMapFromArray<string, PageServiceVariable>(
        payload.map((x) => ({
            ...x,
            currentValue: x.initialValue,
        })),
        (x) => x.name
    );

    const nextState: PageState = {
        ...state,
        variables,
    };

    return nextState;
};

const registryEntry = { actionType, reducer };

export default registryEntry;
