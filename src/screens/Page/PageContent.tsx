import LoadingSuspense from 'components/LoadingSuspense';
import NotFound from 'screens/NotFound';
import ServiceUnavailable from 'screens/ServiceUnavailable';
import PageList from './PageList';
import mcss from './s.module.css';

interface PageContentProps {
    isLoading: boolean;
    error: string;
    status: number;
    data: PageNormalizedData;
    moduleCache: PageComponentModuleCache;
}

const PageContent = ({
    isLoading,
    error,
    status,
    data,
    moduleCache,
}: PageContentProps): JSX.Element => {
    if (isLoading) {
        return <LoadingSuspense />;
    }

    if (error) {
        return status < 500 ? <NotFound message={error} /> : <ServiceUnavailable message={error} />;
    }

    return (
        <main className={mcss.wrapper}>
            <PageList listId={0} data={data} moduleCache={moduleCache} />
        </main>
    );
};

export default PageContent;
