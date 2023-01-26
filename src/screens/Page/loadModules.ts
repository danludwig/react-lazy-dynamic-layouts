import { lazy } from 'react';

export const buildModuleLoader: PageComponentsModuleLoaderBuilder = async () => {
    // can be non-async, but probably won't be in reality (feature flags, etc)
    // building in up-front to parallelize with page/:id data load (non-dependents)
    const buildImportPath = (type: string) => type;

    const invokeImport = async (type: string): Promise<any> =>
        import(`components/${buildImportPath(type)}`)
            // null display in prod, error message on localhost
            .catch(() => import('components/NotImplemented'));

    const loadComponentModule = (type: string) => lazy(() => invokeImport(type));

    const moduleLoader = (data: PageServiceData): PageComponentModuleCache => {
        const { components } = data;

        // only want distinct component types
        const componentTypes = components
            .map((x) => x.type)
            .filter((x, i, a) => a.indexOf(x) === i);

        const modules = componentTypes.map((type: string) => ({
            type,
            Component: loadComponentModule(type),
        }));

        const cache = Object.fromEntries(
            modules.map((x) => [x.type, x.Component])
        );

        return cache;
    };

    return moduleLoader;
};
