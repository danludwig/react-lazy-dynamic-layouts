# React Lazy Dynamic Layouts

## Notes

-   Weather component has popcorn effect when loading over slow connections with
    cache disabled. Could improve performance by keeping weather data in global
    state, since a condition component connected to a button can mount / unmount
    it at any time, causing data loss and reload. Looks fine with cache enabled.

-   Will not validate that the server-defined layout configuration contains no
    cyclic references (would likely overflow stack due to recursive rendering).

-   Fetch API calls not integrated with `React.Suspense`. Yet.

-   Resisted more than one urge to install styled-components or emotionjs, stuck
    with `.module.css` in hopes of minimizing bundle sizes. CSS is not very dry,
    still some work to be done consolidating styles.

-   Button and weather icons are not yet code split / lazy loaded, may need to
    wrap each svg into a component to achieve (using
    [svgr](https://github.com/gregberge/svgr) maybe, if it's worthwhile).

## Local Setup

The usual fare

1. Install `node` version specified in `.nvmrc`
1. Use `yarn` or `npm` to `install` dependencies
1. Use 2 terminal sessions to start both the development server and the API via,
   or submit a pull request with a `concurrently` script
    1. `yarn start-server` OR `npm run start-server`
    1. `yarn start` OR `npm start`
1. Open at http://localhost:3000

## API

All responses return either a `data` property containing responses contents in the case of an `ok` response. Alternatively it may return an `error` property.

### GET /page/:id

Returns a description of the page. Containing several parts:

```
    {
        lists: Array<{
            id, // ID used to look up the list
            components, // Ordered list of component ids
        }>;
        components: Array<{
            id, // ID used to look up component
            type, // The type of the component (ex: `image`, `weather`)
            options, // An object with options specific to the component type
        }>;
        variables?: Array<{
            name, // Variable name
            type, // Variable type (ex: `string`)
            initialValue, // Value the variable starts at
        }> // optional not used on page-one. Should be page specific.
    }
```

### GET /integration/weather?lat=<lat>&lon=<lon>

Returns weather information for specific coordinates used in pages.
