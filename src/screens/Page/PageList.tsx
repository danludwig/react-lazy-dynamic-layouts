import { useMemo } from 'react';

interface PageListProps {
    listId: number;
    data: PageNormalizedData;
    moduleCache: PageComponentModuleCache;
}

const PageList = ({ listId, data, moduleCache }: PageListProps): JSX.Element => {
    const list = data.lists[listId];
    return useMemo(() => {
        return (
            <>
                {list.components.map((componentId) => (
                    <PageComponent
                        key={componentId}
                        componentId={componentId}
                        data={data}
                        moduleCache={moduleCache}
                    />
                ))}
            </>
        );
    }, [list.components, data, moduleCache]);
};

interface PageComponentProps {
    componentId: number;
    data: PageNormalizedData;
    moduleCache: PageComponentModuleCache;
}

const PageComponent = ({ componentId, data, moduleCache }: PageComponentProps): JSX.Element => {
    const component = data.components[componentId];
    const Component = moduleCache[component.type];

    return useMemo(() => {
        const props = {
            key: component.id,
            data: component,
            ...component.options,
        };

        return (
            <Component {...props}>
                {typeof component.children === 'number' && (
                    <PageList listId={component.children} data={data} moduleCache={moduleCache} />
                )}
            </Component>
        );
    }, [component, Component, data, moduleCache]);
};

export default PageList;
