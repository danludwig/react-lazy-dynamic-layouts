import React, { useReducer } from 'react';
import PageContext, { initialState } from './PageContext';
import reducers from 'state/reducers';

const PageStore: React.FC = ({ children }) => {
    const [state, dispatch] = useReducer(reducers, initialState);

    return <PageContext.Provider value={[state, dispatch]}>{children}</PageContext.Provider>;
};

export default PageStore;
