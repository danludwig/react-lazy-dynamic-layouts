import { syncConfig } from 'tools/config';

// todo: make this work with suspense
export const fetchPageData = async (id: string): Promise<FetchResult<PageServiceData>> => {
    const url = `${syncConfig.servicesUrl}/page/${id}`;
    const response = await fetch(url);
    const { data, error }: FetchResult<PageServiceData> = await response.json();
    return { data, error };
};
