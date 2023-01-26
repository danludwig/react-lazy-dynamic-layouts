import React from 'react';

export const initialState: PageState = {
    variables: {},
};

const PageContext = React.createContext<[PageState, BasicDispatch]>([initialState, () => {}]);

export default PageContext;
