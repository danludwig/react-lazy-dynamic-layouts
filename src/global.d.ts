declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
}

// web & react

declare interface PageReactContext {
    state: PageState;
    dispatch: BasicDispatch;
}

declare interface DynamicComponentProps {
    key: number | string;
    data: PageServiceComponent;
}

declare type PageLazyComponent = React.LazyExoticComponent<React.ComponentType<any>>;

declare interface PageComponentModule {
    type: string;
    Component: PageLazyComponent;
}

declare interface PageComponentModuleCache {
    [k: string]: PageLazyComponent;
}
declare type PageComponentsModuleLoader = (data: PageServiceData) => PageComponentModuleCache;

declare type PageComponentsModuleLoaderBuilder = () => Promise<PageComponentsModuleLoader>;

// api

declare interface FetchResult<Data> {
    data?: Data;
    error?: string;
}

// weather

declare type WeatherDay = string;
declare type WeatherCondition = string;
declare type WeatherConditionName = string;

declare interface WeatherServiceUpcoming {
    day: WeatherDay;
    condition: WeatherCondition;
    conditionName: WeatherConditionName;
}

declare interface WeatherServiceData {
    lat: string;
    lon: string;
    condition: WeatherCondition;
    conditionName: WeatherConditionName;
    temperature: number;
    unit: string;
    location: string;
    upcomming: WeatherServiceUpcoming[];
}

// page

declare interface PageServiceData {
    lists: PageServiceList[];
    components: PageServiceComponent[];
    variables?: PageServiceVariable[];
}

declare interface PageServiceDataWithId {
    id: number;
}

declare interface PageServiceDataWithName {
    name: string;
}

declare type DataByKey<KeyType, ValueType> = {
    [k: KeyType]: ValueType;
};

declare interface PageServiceList extends PageServiceDataWithId {
    components: number[];
}

declare interface PageServiceComponent extends PageServiceDataWithId {
    type: string;
    options?: PageServiceComponentOptions;
    children?: number;
}

declare interface PageServiceComponentOptions {
    [k: string]: string;
}

declare interface PageServiceVariable extends PageServiceDataWithName {
    type: string;
    initialValue?: string;
}

declare interface PageNormalizedData {
  lists: PageNormalizedLists;
  components: PageNormalizedComponents;
}

declare type PageNormalizedLists = { [k: number]: PageServiceList };

declare type PageNormalizedComponents = { [k: number]: PageServiceComponent };

declare type PageNormalizedVariables = { [k: string]: PageServiceVariable };

// state

declare interface PageState {
  variables: PageUiVariables;
}

declare type PageUiVariables = { [k: string]: PageUiVariable };

declare interface PageUiVariable extends PageServiceVariable {
    currentValue?: string;
}

declare type BasicDispatch<Payload = any> = (action: PageAction<Payload>) => void;

// actions

declare type ActionPayload = any;

declare interface ActionBase {
    readonly type: string;
}

declare interface PageAction<Payload> extends ActionBase {
    readonly payload: Payload;
}

declare type ActionFactoryCreator<Payload extends ActionPayload = any> = (
    payload: Payload,
    builder?: (...args: any[]) => any
) => PageAction<Payload>;

declare interface ActionCreatorWithBody<Builder extends (...args: any[]) => any = any> {
    (...args: Parameters<Builder>): PageAction<ActionCreatorReturnType<Builder>>;
}

declare type ActionCreatorReturnType<Builder extends (...args: any[]) => any> =
    ReturnType<Builder> extends Promise<infer Resolved> ? Resolved : ReturnType<Builder>;

declare type ActionEchoCreator<Payload extends ActionPayload = any> = (
    payload: Payload
) => PageAction<Payload>;

// reducers

declare type PageReducer<Payload = any> = (state: PageState, action: Action<Payload>) => PageState;

declare interface PageReducerRegistration {
    actionType: string;
    reducer: PageReducer<any>;
}
