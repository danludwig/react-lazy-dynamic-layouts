import '@testing-library/jest-dom';
import { fireEvent, render, RenderResult } from '@testing-library/react';
import React from 'react';
import PageContext, { initialState } from 'state/PageContext';
import PageStore from 'state/PageStore';
import Page from './Page';
import { fetchPageData } from 'services/fetchPageData';

const testIds = {
    fakeLoading: 'loading-fake',
    fakeWeather: 'weather-fake',
    fake404: '404-fake',
    fake500: '500-fake',
};
const mockRoutePageId = jest.fn();

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useParams: () => ({
        id: mockRoutePageId(),
    }),
}));

jest.mock('services/fetchPageData');

jest.mock('./loadModules');
import { buildModuleLoader as buildModuleLoaderFake } from './loadModules';
const loadModulesReal = jest.requireActual('./loadModules');

jest.mock('components/weather', () => () => {
    return <div data-testid={testIds.fakeWeather}>fake weather component</div>;
});

jest.mock('components/LoadingSuspense', () => () => {
    return <div data-testid={testIds.fakeLoading}>fake loading screen</div>;
});

jest.mock('screens/NotFound', () => () => {
    return <div data-testid={testIds.fake404}>fake 404 screen</div>;
});

jest.mock('screens/ServiceUnavailable', () => () => {
    return <div data-testid={testIds.fake500}>fake 500 screen</div>;
});

describe('<Page />', () => {
    const fetchPageDataMock = fetchPageData as jest.Mock;
    const buildModuleLoaderMock = buildModuleLoaderFake as jest.Mock;

    const reactify = () => {
        const fakeSuspenseFallback = <div>fake suspense fallback</div>;
        return render(
            <React.Suspense fallback={fakeSuspenseFallback}>
                <PageStore>
                    <Page />
                </PageStore>
            </React.Suspense>
        );
    };

    beforeEach(() => {
        jest.useFakeTimers();
        buildModuleLoaderMock.mockImplementationOnce(async () => {
            const { buildModuleLoader } = loadModulesReal;
            return await buildModuleLoader();
        });
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.clearAllMocks();
    });

    describe('when page-one is visited', () => {
        beforeEach(() => {
            mockRoutePageId.mockReturnValue('page-one');
            fetchPageDataMock.mockResolvedValueOnce({
                data: pageOneData,
            });
        });

        it('the new york skyline image is displayed', async () => {
            const wrapper = reactify();
            const imgData = pageOneData.components[0];
            const imgOpts = imgData.options!;
            const imgEl = await wrapper.findByAltText(imgOpts.alt);
            expect(imgEl).toBeInTheDocument();
            expect(imgEl.getAttribute('src')?.endsWith(imgOpts.src)).toBe(true);
        });

        it('the new york weather is displayed', async () => {
            const wrapper = reactify();
            const weatherComponent = await wrapper.findByTestId(testIds.fakeWeather);
            expect(weatherComponent).toBeInTheDocument();
            // todo: assert props contract, since faking weather content
        });
    });

    describe('when page-two is visited', () => {
        beforeEach(() => {
            mockRoutePageId.mockReturnValue('page-two');
            fetchPageDataMock.mockResolvedValueOnce({
                data: pageTwoData,
            });
        });

        it('two buttons, "Show" and "Hide", are displayed', async () => {
            const wrapper = reactify();
            const buttons = await wrapper.findAllByRole('button');
            expect(buttons.length).toBe(2);
            expect((buttons[0] as HTMLButtonElement).textContent).toEqual(
                pageTwoData.components[0].options!.text
            );
            expect((buttons[1] as HTMLButtonElement).textContent).toEqual(
                pageTwoData.components[1].options!.text
            );
            const weatherComponent = wrapper.queryByTestId(testIds.fakeWeather);
            expect(weatherComponent).not.toBeInTheDocument();
        });

        describe('when the "Show" button is clicked', () => {
            it('the San Francisco weather is displayed', async () => {
                await clickShowButtonToDisplayWeather();
            });

            describe('when the "Hide" button is then clicked', () => {
                it('the San Francisco weather becomes hidden', async () => {
                    const wrapper = await clickShowButtonToDisplayWeather();
                    const buttonOpts = pageTwoData.components[1].options!;
                    const hideButton = wrapper.getByText(buttonOpts.text);
                    fireEvent.click(hideButton);
                    const weatherComponent = wrapper.queryByTestId(testIds.fakeWeather);
                    expect(weatherComponent).not.toBeInTheDocument();
                });
            });
        });

        let clickShowButtonToDisplayWeather = async () => {
            const wrapper = reactify();
            const buttons = await wrapper.findAllByRole('button');
            fireEvent.click(buttons[0]);
            const weather = await wrapper.findByTestId(testIds.fakeWeather);
            expect(weather).toBeInTheDocument();
            return wrapper;
        };
    });

    describe('when page-three is visited', () => {
        beforeEach(() => {
            mockRoutePageId.mockReturnValue('page-three');
            fetchPageDataMock.mockResolvedValueOnce({
                data: pageThreeData,
            });
        });

        describe('a "Show" button is displayed', () => {
            describe('when the "Show" button is clicked', () => {
                it('displays a New York image and changes the button text to "Hide"', async () => {
                    const wrapper = reactify();
                    await clickShowButton(wrapper);
                    const imgData = pageThreeData.components.find((x) => x.id === 17);
                    const nyImg = await wrapper.findByAltText(imgData!.options!.alt!);
                    expect(nyImg).toBeInTheDocument();
                });

                describe('when the "Hide" button is then clicked', () => {
                    it('the New York image becomes hidden and the "Show" button text is restored', async () => {
                        const wrapper = reactify();
                        const { hideButton } = await clickShowButton(wrapper);
                        fireEvent.click(hideButton);
                        const showButton = await wrapper.findByText('Show');
                        expect(showButton).toBeInTheDocument();
                        expect(hideButton).not.toBeInTheDocument();
                    });
                });
            });
        });

        describe('also a New York weather card is displayed with Chicago and San Francisco buttons', () => {
            describe('when the Chicago button is clicked', () => {
                it('the image and weather card both change to Chicago', async () => {
                    const wrapper = reactify();
                    await clickShowButton(wrapper);
                    await clickLocationButton(wrapper, 'Chicago');
                    const chImgData = pageThreeData.components.find((x) => x.id === 19)!;
                    const chImgOpts = chImgData.options!;
                    const chImgEl = await wrapper.findByAltText(chImgOpts.alt);
                    expect(chImgEl).toBeInTheDocument();
                    const nyImgData = pageThreeData.components.find((x) => x.id === 17)!;
                    const nyImgOpts = nyImgData.options!;
                    const nyImgEl = wrapper.queryByAltText(nyImgOpts.alt);
                    expect(nyImgEl).not.toBeInTheDocument();
                });
                it(
                    'the SanFran button moves up, NewYork button appears below ' +
                        'it, and the Chicago button becomes hidden',
                    async () => {
                        const wrapper = reactify();
                        await clickShowButton(wrapper);
                        const { button: chBtn } = await clickLocationButton(wrapper, 'Chicago');
                        expect(chBtn).not.toBeInTheDocument();
                        const sfBtnData = pageThreeData.components.find((x) => x.id === 6)!;
                        const sfBtnOpts = sfBtnData.options!;
                        const sfBtnEl = await wrapper.findByText(sfBtnOpts!.text);
                        expect(sfBtnEl).toBeInTheDocument();
                        const nyBtnData = pageThreeData.components.find((x) => x.id === 5)!;
                        const nyBtnOpts = nyBtnData.options!;
                        const nyBtnEl = await wrapper.findByText(nyBtnOpts!.text);
                        expect(nyBtnEl).toBeInTheDocument();
                    }
                );
            });

            describe('when the San Francisco button is clicked', () => {
                it('the image and weather card both change to SanFran', async () => {
                    const wrapper = reactify();
                    await clickShowButton(wrapper);
                    await clickLocationButton(wrapper, 'San Francisco');
                    const sfImgData = pageThreeData.components.find((x) => x.id === 18)!;
                    const sfImgOpts = sfImgData.options!;
                    const sfImgEl = await wrapper.findByAltText(sfImgOpts.alt);
                    expect(sfImgEl).toBeInTheDocument();
                    const nyImgData = pageThreeData.components.find((x) => x.id === 17)!;
                    const nyImgOpts = nyImgData.options!;
                    const nyImgEl = wrapper.queryByAltText(nyImgOpts.alt);
                    expect(nyImgEl).not.toBeInTheDocument();
                });
                it(
                    'the Chicago button moves down, NewYork button appears above ' +
                        'it, and the SanFran button becomes hidden',
                    async () => {
                        const wrapper = reactify();
                        await clickShowButton(wrapper);
                        const { button: sfBtn } = await clickLocationButton(
                            wrapper,
                            'San Francisco'
                        );
                        expect(sfBtn).not.toBeInTheDocument();
                        const nyBtnData = pageThreeData.components.find((x) => x.id === 5)!;
                        const nyBtnOpts = nyBtnData.options!;
                        const nyBtnEl = await wrapper.findByText(nyBtnOpts!.text);
                        expect(nyBtnEl).toBeInTheDocument();
                        const chBtnData = pageThreeData.components.find((x) => x.id === 7)!;
                        const chBtnOpts = chBtnData.options!;
                        const chBtnEl = await wrapper.findByText(chBtnOpts!.text);
                        expect(chBtnEl).toBeInTheDocument();
                    }
                );
            });
        });

        const clickShowButton = async (wrapper: RenderResult) => {
            const showButton = await wrapper.findByText('Show');
            expect(showButton).toBeInTheDocument();
            fireEvent.click(showButton);
            expect(showButton).not.toBeInTheDocument();
            const hideButton = await wrapper.findByText('Hide');
            expect(hideButton).toBeInTheDocument();
            return { wrapper, showButton: showButton, hideButton };
        };

        const clickLocationButton = async (wrapper: RenderResult, buttonText: string) => {
            const button = await wrapper.findByText(buttonText);
            expect(button).toBeInTheDocument();
            fireEvent.click(button);
            return { wrapper, button };
        };
    });

    describe('when no page is found by the route :id param', () => {
        beforeEach(() => {
            mockRoutePageId.mockReturnValue('page-square-root-of-negative-infinity');
            fetchPageDataMock.mockResolvedValueOnce({
                error: 'Page Not Found',
            });
        });

        it('the <NotFound /> screen is displayed', async () => {
            const wrapper = reactify();
            const errorScreen = await wrapper.findByTestId(testIds.fake404);
            expect(errorScreen).toBeInTheDocument();
        });
    });

    describe('the <ServiceUnavailable /> screen is displayed', () => {
        it('when there is a network error connecting to the api service', async () => {
            mockRoutePageId.mockReturnValue('any');
            fetchPageDataMock.mockRejectedValueOnce(new Error('net::ERR_CONNECTION_REFUSED'));
            await expectServiceUnavailableScreen();
        });

        it('when the module loader builder throws an error', async () => {
            mockRoutePageId.mockReturnValue('page-one');
            fetchPageDataMock.mockResolvedValueOnce({
                data: pageOneData,
            });
            buildModuleLoaderMock.mockReset();
            buildModuleLoaderMock.mockImplementationOnce(() => {
                throw new Error('the module loader builder threw an error');
            });
            await expectServiceUnavailableScreen();
        });

        it('when the module loader builder returns a non-function', async () => {
            mockRoutePageId.mockReturnValue('page-one');
            fetchPageDataMock.mockResolvedValueOnce({
                data: pageOneData,
            });
            buildModuleLoaderMock.mockReset();
            buildModuleLoaderMock.mockResolvedValueOnce([
                'this is not a function and cannot be invoked',
            ]);
            await expectServiceUnavailableScreen();
        });

        const expectServiceUnavailableScreen = async () => {
            const wrapper = reactify();
            const errorScreen = await wrapper.findByTestId(testIds.fake500);
            expect(errorScreen).toBeInTheDocument();
        };
    });

    const pageOneData: PageServiceData = {
        lists: [
            {
                id: 0,
                components: [1, 2],
            },
        ],
        components: [
            {
                id: 1,
                type: 'image',
                options: {
                    src: '/locations/new-york.png',
                    alt: 'Cartoon of New York skyline',
                },
            },
            {
                id: 2,
                type: 'weather',
                options: {
                    lon: '40.748607102729295',
                    lat: '-73.98563758004718',
                },
            },
        ],
    };

    const pageTwoData: PageServiceData = {
        variables: [
            {
                name: 'show_weather',
                type: 'string',
                initialValue: 'hide',
            },
        ],
        lists: [
            {
                id: 0,
                components: [1, 2, 3],
            },
            {
                id: 1,
                components: [4],
            },
        ],
        components: [
            {
                id: 1,
                type: 'button',
                options: {
                    text: 'Show',
                    variable: 'show_weather',
                    value: 'show',
                },
            },
            {
                id: 2,
                type: 'button',
                options: {
                    text: 'Hide',
                    variable: 'show_weather',
                    value: 'hide',
                },
            },
            {
                id: 3,
                type: 'condition',
                options: {
                    variable: 'show_weather',
                    value: 'show',
                },
                children: 1,
            },
            {
                id: 4,
                type: 'weather',
                options: {
                    lon: '37.82012350797623',
                    lat: '-122.47822291578807',
                },
            },
        ],
    };

    const pageThreeData: PageServiceData = {
        variables: [
            {
                name: 'show_image',
                type: 'string',
                initialValue: 'hide',
            },
            {
                name: 'location',
                type: 'string',
                initialValue: 'ny',
            },
        ],
        lists: [
            {
                id: 0,
                components: [3, 4, 8, 9, 10],
            },
            {
                id: 1,
                components: [1],
            },
            {
                id: 2,
                components: [2],
            },
            {
                id: 3,
                components: [14, 11, 7, 6],
            },
            {
                id: 4,
                components: [15, 12, 5, 7],
            },
            {
                id: 5,
                components: [16, 13, 6, 5],
            },
            {
                id: 6,
                components: [17],
            },
            {
                id: 7,
                components: [18],
            },
            {
                id: 8,
                components: [19],
            },
        ],
        components: [
            {
                id: 1,
                type: 'button',
                options: {
                    text: 'Show',
                    variable: 'show_image',
                    value: 'show',
                },
            },
            {
                id: 2,
                type: 'button',
                options: {
                    text: 'Hide',
                    variable: 'show_image',
                    value: 'hide',
                },
            },
            {
                id: 3,
                type: 'condition',
                options: {
                    variable: 'show_image',
                    value: 'hide',
                },
                children: 1,
            },
            {
                id: 4,
                type: 'condition',
                options: {
                    variable: 'show_image',
                    value: 'show',
                },
                children: 2,
            },
            {
                id: 5,
                type: 'button',
                options: {
                    text: 'New York',
                    variable: 'location',
                    value: 'ny',
                },
            },
            {
                id: 6,
                type: 'button',
                options: {
                    text: 'San Francisco',
                    variable: 'location',
                    value: 'ca',
                },
            },
            {
                id: 7,
                type: 'button',
                options: {
                    text: 'Chicago',
                    variable: 'location',
                    value: 'ch',
                },
            },
            {
                id: 8,
                type: 'condition',
                options: {
                    variable: 'location',
                    value: 'ny',
                },
                children: 3,
            },
            {
                id: 9,
                type: 'condition',
                options: {
                    variable: 'location',
                    value: 'ca',
                },
                children: 4,
            },
            {
                id: 10,
                type: 'condition',
                options: {
                    variable: 'location',
                    value: 'ch',
                },
                children: 5,
            },
            {
                id: 11,
                type: 'weather',
                options: {
                    lon: '40.748607102729295',
                    lat: '-73.98563758004718',
                },
            },
            {
                id: 12,
                type: 'weather',
                options: {
                    lon: '37.82012350797623',
                    lat: '-122.47822291578807',
                },
            },
            {
                id: 13,
                type: 'weather',
                options: {
                    lon: '-33.85657055046214',
                    lat: '151.21533961293326',
                },
            },
            {
                id: 14,
                type: 'condition',
                options: {
                    variable: 'show_image',
                    value: 'show',
                },
                children: 6,
            },
            {
                id: 15,
                type: 'condition',
                options: {
                    variable: 'show_image',
                    value: 'show',
                },
                children: 7,
            },
            {
                id: 16,
                type: 'condition',
                options: {
                    variable: 'show_image',
                    value: 'show',
                },
                children: 8,
            },
            {
                id: 17,
                type: 'image',
                options: {
                    src: '/locations/new-york.png',
                    alt: 'Cartoon of New York skyline',
                },
            },
            {
                id: 18,
                type: 'image',
                options: {
                    src: '/locations/san-francisco.png',
                    alt: 'Cartoon of San Francisco skyline',
                },
            },
            {
                id: 19,
                type: 'image',
                options: {
                    src: '/locations/chicago.png',
                    alt: 'Cartoon of Chicago skyline',
                },
            },
        ],
    };
});
