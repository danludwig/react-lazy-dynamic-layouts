import { useEffect, useState, useContext, useMemo } from 'react';
import { useParams } from 'react-router';
import { fetchPageData } from 'services/fetchPageData';
import { initPageVariables } from 'state/initPageVariables';
import { buildModuleLoader } from './loadModules';
import buildMapFromArray from 'state/buildMapFromArray';
import PageContext from 'state/PageContext';
import PageContent from './PageContent';

const defaultPageData = { lists: {}, components: {} };

const PageScreen = (): JSX.Element => {
    const { id } = useParams<{ id: string }>();
    const [, dispatch] = useContext(PageContext);
    const [isLoading, setIsLoading] = useState(true);
    const [pageData, setPageData] = useState<PageNormalizedData>(defaultPageData);
    const [moduleCache, fillModuleCache] = useState<PageComponentModuleCache>({});
    const [error, setError] = useState('');
    const [status, setStatus] = useState(-1);

    useEffect(() => {
        const loadData = async (id: string) => {
            try {
                const [{ data, error }, loadModules] = await Promise.all([
                    fetchPageData(id),
                    buildModuleLoader(),
                ]);
                if (error) {
                    setError(error);
                    setStatus(404);
                    setIsLoading(false);
                } else if (typeof loadModules !== 'function') {
                    setError('Unable to build module loader');
                    setStatus(500);
                    setIsLoading(false);
                } else if (data) {
                    setPageData({
                        lists: buildMapFromArray<number, PageServiceList>(data.lists, (x) => x.id),
                        components: buildMapFromArray<number, PageServiceComponent>(
                            data.components,
                            (x) => x.id
                        ),
                    });
                    dispatch(initPageVariables(data.variables));
                    fillModuleCache(loadModules(data));
                    setIsLoading(false);
                }
            } catch (error: any) {
                setError(error.message);
                setStatus(503);
                setIsLoading(false);
            }
        };

        loadData(id);
    }, [id, dispatch]);

    return useMemo(
        () => (
            <PageContent
                isLoading={isLoading}
                error={error}
                status={status}
                data={pageData}
                moduleCache={moduleCache}
            />
        ),
        [isLoading, error, status, pageData, moduleCache]
    );
};

export default PageScreen;
