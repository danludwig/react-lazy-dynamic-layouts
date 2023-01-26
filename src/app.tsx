import React from 'react';
import PageStore from 'state/PageStore';
import PageScreen from 'screens/Page';

const App = (): JSX.Element => (
    <React.Suspense fallback={null}>
        <PageStore>
            <PageScreen />
        </PageStore>
    </React.Suspense>
);

export default App;
