import type { Component, DefineComponent, MaybeRef } from "vue";
import type {
  _Awaitable,
  _RouteRecordBase,
  HistoryState,
  LocationQuery,
  NavigationFailure,
  NavigationGuardNextCallback,
  RouteLocation,
  RouteLocationAsPath,
  RouteLocationAsPathGeneric,
  RouteLocationAsPathTypedList,
  RouteLocationAsRelativeGeneric,
  RouteLocationAsRelativeTypedList,
  RouteLocationAsString,
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
  RouteMap,
  RouteMapGeneric,
  RouteParamsGeneric,
  RouteParamsRawGeneric,
  RouterView,
  UseLinkReturn,
  RouteLocationRaw,
  RouteRecordRaw,
  RouteMeta,
  NavigationGuardWithThis,
  NavigationGuardNext,
  NavigationGuardReturn,
  RouteLocationAsRelativeTyped,
  NavigationHookAfter,
  UseLinkOptions,
  RouterLinkProps,
  RouteRecordRedirectOption,
} from "vue-router";

/**
 * A custom route map interface for defining all application routes.
 *
 * This interface should be augmented via declaration merging to register
 * your application's routes. Each route is defined using {@link CustomRouteInfo}
 * which provides full type information for paths, params, query, meta, and more.
 *
 * @remarks
 * - Use declaration merging with `declare module 'strict-vue-router'`
 * - Each key is a route name, and the value is a `CustomRouteInfo` type
 * - This map powers all type inference for Vue Router operations
 *
 * @example
 * ### Basic Setup
 *
 * ```ts
 * declare module 'strict-vue-router' {
 *   interface CustomRouteMap {
 *     // Static route with no params
 *     home: CustomRouteInfo<['/'], ['/'], 'Home'>;
 *
 *     // Route with children
 *     dashboard: CustomRouteInfo<
 *       ['/dashboard'],
 *       ['/dashboard'],
 *       'Dashboard',
 *       never,
 *       'dashboardStats' | 'dashboardSettings'  // childrenNames
 *     >;
 *
 *     // Child routes
 *     dashboardStats: CustomRouteInfo<
 *       ['/dashboard', 'stats'],
 *       ['/dashboard', 'stats'],
 *       'Statistics'
 *     >;
 *
 *     dashboardSettings: CustomRouteInfo<
 *       ['/dashboard', 'settings'],
 *       ['/dashboard', 'settings'],
 *       'Settings'
 *     >;
 *   }
 * }
 * ```
 *
 * @example
 * ### Route with Dynamic Params
 * ```ts
 * declare module 'strict-vue-router' {
 *   interface CustomRouteMap {
 *     user: CustomRouteInfo<
 *       ['/users', ':userid(\\d+)'],           // routePath (with regex)
 *       ['/users', `${1 | 2 | 3 | 4 | 5}`],   // path (valid values)
 *       'User',                                // staticTitle
 *       'User #<[userid]>',                    // dynamicTitle
 *       'userPosts' | 'userSettings',          // childrenNames
 *       { userid: string | number },           // params
 *       { tab?: 'info' | 'activity' }          // query
 *     >;
 *   }
 * }
 * ```
 *
 * @example
 * ### Route with Props and History State
 * ```ts
 * declare module 'strict-vue-router' {
 *   interface CustomRouteMap {
 *     product: CustomRouteInfo<
 *       ['/products', ':productId'],
 *       ['/products', string],
 *       'Product',
 *       'Product: <[productId]>',
 *       never,                                      // no children
 *       { productId: string },                      // params
 *       { color?: string; size?: string },          // query
 *       { productId: string; initialTab: string },  // props
 *       { fromSearch: boolean; searchQuery: string } // historyState
 *     >;
 *   }
 * }
 * ```
 *
 * @example
 * ### Route with Hash
 * ```ts
 * declare module 'strict-vue-router' {
 *   interface CustomRouteMap {
 *     docs: CustomRouteInfo<
 *       ['/docs'],
 *       ['/docs'],
 *       'Documentation',
 *       never,
 *       never,
 *       never,
 *       never,
 *       never,
 *       never,
 *       `#${'intro' | 'getting-started' | 'api' | 'faq'}`  // hash
 *     >;
 *   }
 * }
 * ```
 *
 * @example
 * ### 404 Not Found Route
 * ```ts
 * declare module 'strict-vue-router' {
 *   interface CustomRouteMap {
 *     notFound: CustomRouteInfo<
 *       ['/:pathMatch(.*)*'],   // catch-all routePath
 *       never,                  // no specific path (matches anything)
 *       '404 - Page Not Found',
 *       never,
 *       never,
 *       { pathMatch: string[] } // params (array for catch-all)
 *     >;
 *   }
 * }
 * ```
 *
 * @see {@link CustomRouteInfo} for the type used to define each route
 */
export interface CustomRouteMap {}

/**
 * Defines complete type information for a single route.
 *
 * This generic type captures all aspects of a route including its path patterns,
 * params, query, props, meta titles, children, history state, and hash.
 * Used with {@link CustomRouteMap} to create a fully typed routing system.
 *
 * @template RoutePath - Tuple of path segments as defined in route record (e.g., `['/users', ':id']`)
 * @template Path - Tuple of resolved path segments with actual values (e.g., `['/users', '1' | '2']`)
 * @template StaticTitle - The default page title (used when `isDynamic` is false)
 * @template DynamicTitle - Title pattern with placeholders (e.g., `'User #<[userid]>'`)
 * @template ChildrenNames - Union of valid child route names for this route
 * @template Params - Object type for route params (e.g., `{ userid: string }`)
 * @template Query - Object type for query parameters (e.g., `{ page?: number }`)
 * @template Props - Props passed to route component(s)
 * @template HistoryState - Type for `history.state` data
 * @template Hash - Valid hash values (e.g., `` `#${'section1' | 'section2'}` ``)
 *
 * @remarks
 * - Use `never` for optional/unused type parameters
 * - `RoutePath` contains the raw path with param placeholders (`:id`, `:slug(\\w+)`)
 * - `Path` contains resolved paths with actual possible values
 * - For dynamic params, use union types or template literals in `Path`
 * - `ChildrenNames` enables parent-child validation with {@link defineChildRouteRecord}
 *
 * @example
 * ### Simple Static Route
 * ```ts
 * // Route: /about
 * // No params, no query, no children
 * type AboutRoute = CustomRouteInfo<
 *   ['/about'],     // routePath
 *   ['/about'],     // path (same as routePath for static routes)
 *   'About Us'      // staticTitle
 * >;
 *
 * // Usage in CustomRouteMap:
 * interface CustomRouteMap {
 *   about: AboutRoute;
 * }
 * ```
 *
 * @example
 * ### Route with Dynamic Param
 * ```ts
 * // Route: /users/:userid
 * // Param 'userid' can be 1-10
 * type From1To10 = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
 *
 * type UserRoute = CustomRouteInfo<
 *   ['/users', ':userid((?:[1-9]|10\\))'],  // routePath with regex
 *   ['/users', `${From1To10}`],              // path with valid values
 *   'User',                                  // staticTitle (fallback)
 *   'User #<[userid]>',                      // dynamicTitle pattern
 *   'userPosts',                             // childrenNames
 *   { userid: `${From1To10}` | From1To10 }   // params type
 * >;
 *
 * // Usage in CustomRouteMap:
 * interface CustomRouteMap {
 *   user: UserRoute;
 * }
 * ```
 *
 * @example
 * ### Route with Query Parameters
 * ```ts
 * // Route: /products?category=...&sort=...&page=...
 * type ProductsRoute = CustomRouteInfo<
 *   ['/products'],
 *   ['/products'],
 *   'Products',
 *   never,                                           // no dynamic title
 *   never,                                           // no children
 *   never,                                           // no params
 *   {                                                // query type
 *     category?: 'electronics' | 'clothing' | 'books';
 *     sort?: 'price' | 'name' | 'rating';
 *     page?: `${number}`;
 *   }
 * >;
 *
 * // Usage in CustomRouteMap:
 * interface CustomRouteMap {
 *   products: ProductsRoute;
 * }
 * ```
 *
 * @example
 * ### Route with Props (Single View)
 * ```ts
 * // Route passes params as props to component
 * type ArticleRoute = CustomRouteInfo<
 *   ['/articles', ':slug'],
 *   ['/articles', string],
 *   'Article',
 *   never,
 *   never,
 *   { slug: string },         // params
 *   never,                    // query
 *   {                         // props (passed to component)
 *     slug: string;
 *     showComments: boolean;
 *   }
 * >;
 *
 * // Usage in CustomRouteMap:
 * interface CustomRouteMap {
 *   article: ArticleRoute;
 * }
 * ```
 *
 * @example
 * ### Route with Props (Multiple Named Views)
 * ```ts
 * // Route with named views: <router-view name="sidebar" />
 * //                         <router-view name="main" />
 * type DashboardRoute = CustomRouteInfo<
 *   ['/dashboard'],
 *   ['/dashboard'],
 *   'Dashboard',
 *   never,
 *   never,
 *   never,
 *   never,
 *   {                          // props per named view
 *     sidebar: {
 *       collapsed: boolean;
 *       items: string[];
 *     };
 *     main: {
 *       title: string;
 *       data: unknown[];
 *     };
 *   }
 * >;
 *
 * // Usage in CustomRouteMap:
 * interface CustomRouteMap {
 *   dashboard: DashboardRoute;
 * }
 * ```
 *
 * @example
 * ### Route with History State
 * ```ts
 * // Route that preserves navigation context in history.state
 * type SearchResultsRoute = CustomRouteInfo<
 *   ['/search'],
 *   ['/search'],
 *   'Search Results',
 *   never,
 *   never,
 *   never,
 *   { q: string; page?: `${number}` },   // query
 *   never,                                // props
 *   {                                     // historyState
 *     fromHomepage: boolean;
 *     previousQuery?: string;
 *     scrollPosition?: number;
 *   }
 * >;
 *
 * // Usage in CustomRouteMap:
 * interface CustomRouteMap {
 *   searchResults: SearchResultsRoute;
 * }
 *
 * // Navigate with state:
 * router.push({
 *   name: 'searchResults',
 *   query: { q: 'vue router' },
 *   state: { fromHomepage: true, scrollPosition: 0 }
 * });
 * ```
 *
 * @example
 * ### Route with Hash Anchors
 * ```ts
 * // Route: /docs#intro, /docs#api, /docs#faq
 * type DocsRoute = CustomRouteInfo<
 *   ['/docs'],
 *   ['/docs'],
 *   'Documentation',
 *   never,
 *   never,
 *   never,
 *   never,
 *   never,
 *   never,
 *   `#${'intro' | 'getting-started' | 'api' | 'examples' | 'faq'}`
 * >;
 *
 * // Usage in CustomRouteMap:
 * interface CustomRouteMap {
 *   docs: DocsRoute;
 * }
 *
 * // Navigate to specific section:
 * router.push({ name: 'docs', hash: '#api' });
 * ```
 *
 * @example
 * ### Complete Route with All Options
 * ```ts
 * type From1To100 = // 1 | 2 | ... | 100;
 *
 * type UserPostRoute = CustomRouteInfo<
 *   // routePath - path segments with param patterns
 *   ['/users', ':userid(\\d+)', 'posts', ':postid(\\d+)'],
 *
 *   // path - resolved path segments with actual values
 *   ['/users', `${From1To100}`, 'posts', `${From1To100}`],
 *
 *   // staticTitle - fallback title
 *   'User Post',
 *
 *   // dynamicTitle - pattern with placeholders
 *   'User #<[userid]> - Post #<[postid]>',
 *
 *   // childrenNames - valid child route names
 *   'postComments' | 'postEdit',
 *
 *   // params - typed route params
 *   {
 *     userid: `${From1To100}` | From1To100;
 *     postid: `${From1To100}` | From1To100;
 *   },
 *
 *   // query - typed query params
 *   {
 *     highlight?: 'true' | 'false';
 *     commentPage?: `${number}`;
 *   },
 *
 *   // props - passed to component
 *   {
 *     userid: string;
 *     postid: string;
 *   },
 *
 *   // historyState - navigation state
 *   {
 *     fromUserProfile: boolean;
 *     previousPostId?: string;
 *   },
 *
 *   // hash - valid anchors
 *   `#${'content' | 'comments' | 'related'}`
 * >;
 *
 * // Usage in CustomRouteMap:
 * interface CustomRouteMap {
 *   userPost: UserPostRoute;
 * }
 * ```
 *
 * @see {@link CustomRouteMap} for registering routes
 */
export type CustomRouteInfo<
  RoutePath extends string[],
  Path extends string[],
  StaticTitle extends string = never,
  DynamicTitle extends string = never,
  ChildrenNames extends string = never,
  Params extends Record<string, unknown> = never,
  Query extends Record<string, unknown> = never,
  Props extends Record<string, unknown> = never,
  HistoryState extends Record<string, unknown> = never,
  Hash extends `#${string}` = never,
> = {
  /**
   * Route record path segments as defined in the route configuration.
   *
   * This is the raw path with parameter placeholders and optional regex patterns.
   * Used for route matching and displayed in Vue DevTools.
   *
   * @remarks
   * - First segment typically starts with `/` for root-level routes
   * - Child routes use relative segments (no leading `/`)
   * - Supports Vue Router param syntax: `:param`, `:param(regex)`
   *
   * @example
   * ```ts
   * // Static path
   * routePath: ['/about']
   *
   * // Path with param
   * routePath: ['/users', ':userid']
   *
   * // Path with regex constraint
   * routePath: ['/users', ':userid(\\d+)']
   *
   * // Nested child path
   * routePath: ['posts', ':postid']
   *
   * // Catch-all path
   * routePath: ['/:pathMatch(.*)*']
   * ```
   */
  routePath: RoutePath;

  /**
   * Resolved route location path segments with actual possible values.
   *
   * Unlike `routePath`, this contains the concrete values that can appear
   * in the URL. Use union types or template literals for dynamic segments.
   *
   * @remarks
   * - Use `never` for routes that don't have specific path patterns (e.g., 404)
   * - For static routes, this is identical to `routePath`
   * - For dynamic routes, replace params with their possible values
   *
   * @example
   * ```ts
   * // Static path (same as routePath)
   * path: ['/about']
   *
   * // Dynamic path with union values
   * path: ['/users', '1' | '2' | '3' | '4' | '5']
   *
   * // Dynamic path with template literal
   * path: ['/users', `${number}`]
   *
   * // Nested dynamic path
   * path: ['/users', `${From1To10}`, 'posts', `${From1To100}`]
   *
   * // Catch-all (no specific path)
   * path: never
   * ```
   */
  path: Path;

  /**
   * Static page title used as the default `document.title`.
   *
   * This value is used when `isDynamic` is false or undefined in the route meta.
   * Should be a human-readable string representing the page.
   *
   * @example
   * ```ts
   * staticTitle: 'Home'
   * staticTitle: 'User Profile'
   * staticTitle: '404 - Page Not Found'
   * ```
   */
  staticTitle: StaticTitle;

  /**
   * Dynamic title pattern with placeholders for runtime resolution.
   *
   * Placeholders use the format `<[paramName]>` and are replaced with
   * actual values from route params or query by {@link resolveRouteTitle}.
   *
   * @remarks
   * - Use `never` if the route doesn't have a dynamic title
   * - Placeholders must match keys defined in `params` or `query`
   * - Resolved at runtime using `propsMap` in route meta
   *
   * @example
   * ```ts
   * // Single placeholder
   * dynamicTitle: 'User #<[userid]>'
   *
   * // Multiple placeholders
   * dynamicTitle: 'User #<[userid]> - Post #<[postid]>'
   *
   * // No dynamic title
   * dynamicTitle: never
   * ```
   */
  dynamicTitle: DynamicTitle;

  /**
   * Union of valid child route names for this route.
   *
   * Enables parent-child validation when using {@link defineChildRouteRecord}.
   * Only routes listed here can be defined as children of this route.
   *
   * @remarks
   * - Use `never` if the route has no children
   * - Must match keys defined in {@link CustomRouteMap}
   * - Enforced at compile-time for type safety
   *
   * @example
   * ```ts
   * // Route with multiple children
   * childrenNames: 'users' | 'posts' | 'settings'
   *
   * // Route with single child
   * childrenNames: 'profile'
   *
   * // Route with no children
   * childrenNames: never
   * ```   */
  childrenNames: ChildrenNames;

  /**
   * Type definition for route parameters extracted from the URL path.
   *
   * Params are dynamic segments in the URL defined with `:paramName` syntax.
   * This type ensures type safety when accessing `route.params` or navigating.
   *
   * @remarks
   * - Use `never` if the route has no params
   * - Keys must match param names in `routePath`
   * - Values can be strings, numbers, or unions of specific values
   * - For catch-all routes (`*`), the param is a `string[]`
   *
   * @example
   * ```ts
   * // Single param
   * params: { userid: string }
   *
   * // Param with constrained values
   * params: { userid: '1' | '2' | '3' | '4' | '5' }
   *
   * // Multiple params
   * params: {
   *   userid: `${From1To10}` | From1To10;
   *   postid: `${From1To100}` | From1To100;
   * }
   *
   * // Catch-all param
   * params: { pathMatch: string[] }
   *
   * // No params
   * params: never
   * ```
   */
  params: Params;

  /**
   * This property is used to becasue it's needed for the {@link RouteLocationAsRelativeTyped}
   */
  paramsRaw: Params;

  /**
   * Type definition for URL query parameters.
   *
   * Query params appear after `?` in the URL (e.g., `/users?page=1&sort=name`).
   * This type ensures type safety when accessing `route.query` or navigating.
   *
   * @remarks
   * - Use `never` if the route doesn't use query params
   * - All query values are typically optional (use `?` modifier)
   * - Values are usually strings or string unions
   * - Arrays are supported for repeated params (`?tag=a&tag=b`)
   *
   * @example
   * ```ts
   * // Simple query params
   * query: {
   *   page?: `${number}`;
   *   limit?: '10' | '25' | '50' | '100';
   * }
   *
   * // Query with specific values
   * query: {
   *   sort?: 'name' | 'date' | 'price';
   *   order?: 'asc' | 'desc';
   *   category?: string;
   * }
   *
   * // Query with array param
   * query: {
   *   tags?: string | string[];
   * }
   *
   * // No query params
   * query: never
   * ```
   */
  query: Query;

  /**
   * Type definition for props passed to route component(s).
   *
   * When `props: true` is set on a route, params are passed as props.
   * You can also define custom props or props for named views.
   *
   * @remarks
   * - Use `never` if the route doesn't pass props
   * - For single view: define props as a flat object
   * - For named views: define props per view name
   * - Props can come from params, static values, or functions
   *
   * @example
   * ### Single View Props
   * ```ts
   * // Props passed to the single route component
   * props: {
   *   userid: string;
   *   showHeader: boolean;
   * }
   * ```
   *
   * @example
   * ### Multiple Named Views Props
   * ```ts
   * // Props for named views: sidebar, main, footer
   * props: {
   *   sidebar: {
   *     collapsed: boolean;
   *     menuItems: string[];
   *   };
   *   main: {
   *     title: string;
   *     content: string;
   *   };
   *   footer: {
   *     showCopyright: boolean;
   *   };
   * }
   * ```
   *
   * @example
   * ### No Props
   * ```ts
   * props: never
   * ```
   */
  props: Props;

  /**
   * Type definition for History API state object.
   *
   * State is persisted in `history.state` and survives page navigation
   * but not page refresh. Useful for passing data between routes without
   * exposing it in the URL.
   *
   * @remarks
   * - Use `never` if the route doesn't use history state
   * - State is not visible in the URL
   * - State is lost on page refresh
   * - Access via `route.state` or `history.state`
   *
   * @example
   * ```ts
   * // Navigation context state
   * historyState: {
   *   fromPage: string;
   *   scrollPosition: number;
   *   previousFilters: Record<string, string>;
   * }
   *
   * // Error page state
   * historyState: {
   *   error: Error | null;
   *   fromRoute: string | null;
   *   timestamp: number;
   * }
   *
   * // No history state
   * historyState: never
   * ```
   *
   * @example
   * ### Usage in Navigation
   * ```ts
   * // Navigate with state
   * router.push({
   *   name: 'errorPage',
   *   state: {
   *     error: new Error('Something went wrong'),
   *     fromRoute: '/dashboard',
   *     timestamp: Date.now(),
   *   },
   * });
   *
   * // Access state in component
   * const route = useRoute();
   * console.log(route.state?.error);
   * ```
   */
  historyState: HistoryState;

  /**
   * Type definition for valid URL hash values.
   *
   * Hash appears after `#` in the URL (e.g., `/docs#getting-started`).
   * Typically used for anchor links or client-side state.
   *
   * @remarks
   * - Use `never` if the route doesn't use hash
   * - Must start with `#` (use template literal `` `#${string}` ``)
   * - Useful for scroll-to-section functionality
   * - Does not trigger server requests
   *
   * @example
   * ```ts
   * // Specific hash values
   * hash: `#${'intro' | 'features' | 'pricing' | 'faq'}`
   *
   * // Numeric hash (e.g., for pagination sections)
   * hash: `#${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10}`
   *
   * // Any hash string
   * hash: `#${string}`
   *
   * // No hash
   * hash: never
   * ```
   *
   * @example
   * ### Usage in Navigation
   * ```ts
   * // Navigate to specific section
   * router.push({ name: 'docs', hash: '#getting-started' });
   *
   * // Access hash in component
   * const route = useRoute();
   * console.log(route.hash); // '#getting-started'
   * ```
   */
  hash: Hash;
};

/**
 * Resolves and sets the page title for any route.
 *
 * This function checks if the route has a dynamic title pattern defined.
 * If so, it replaces placeholders (e.g., `<[userid]>`) with actual values
 * from route params or query. Otherwise, it falls back to the default static title.
 *
 * @param route - The normalized route location to resolve the title for
 *
 * @remarks
 * - Dynamic titles use a pattern like `'User #<[userid]>'` where `<[userid]>` gets replaced
 * - The `propsMap` array defines how to resolve each placeholder from the route object
 * - This function directly sets `document.title`
 *
 * @example
 * ### Basic Usage with `afterEach` Guard
 * ```ts
 * import { resolveRouteTitle } from 'strict-vue-router';
 *
 * const router = createRouter({ ... });
 *
 * router.afterEach((to) => {
 *   resolveRouteTitle(to);
 * });
 * ```
 *
 * @example
 * ### How Dynamic Titles Work
 * ```ts
 * // Given this route definition:
 * defineRouteRecord<'user'>({
 *   name: 'user',
 *   path: ':userid((?:[1-9]|10\\))',
 *   component: UserRoute,
 *   meta: {
 *     title: {
 *       default: 'User',
 *       isDynamic: true,
 *       pattern: 'User #<[userid]>',
 *       propsMap: [['userid', 'params.userid']],
 *     },
 *   },
 * });
 *
 * // When navigating to /users/5:
 * // document.title becomes: "User #5"
 * ```
 *
 * @example
 * ### Multiple Dynamic Placeholders
 * ```ts
 * // For a route with multiple params:
 * meta: {
 *   title: {
 *     default: 'User Post',
 *     isDynamic: true,
 *     pattern: 'User #<[userid]> - Post #<[postid]>',
 *     propsMap: [
 *       ['userid', 'params.userid'],
 *       ['postid', 'params.postid'],
 *     ],
 *   },
 * }
 *
 * // When navigating to /users/3/posts/7:
 * // document.title becomes: "User #3 - Post #7"
 * ```
 */
export const resolveRouteTitle: (route: RouteLocationNormalized) => void;

/**
 * Defines a fully typed route record with strict type checking.
 *
 * This helper ensures that route configuration matches the types defined
 * in your `CustomRouteMap`, including path, name, meta, params, and children.
 *
 * @template Name - The route name from `CustomRouteMap` (inferred or explicit)
 * @param route - The route record configuration object
 * @returns The same route record with proper typing
 *
 * @remarks
 * - Use this for top-level routes or when you don't need parent-child validation
 * - For child routes with parent validation, use {@link defineChildRouteRecord}
 * - The generic parameter `Name` can be explicit or inferred from `route.name`
 *
 * @example
 * ### Basic Static Route
 * ```ts
 * import { defineRouteRecord } from 'strict-vue-router';
 *
 * const homeRoute = defineRouteRecord<'home'>({
 *   path: '/',
 *   name: 'home',
 *   component: () => import('@/views/HomeView.vue'),
 *   meta: {
 *     title: { default: 'Home' },
 *   },
 * });
 * ```
 *
 * @example
 * ### Route with Dynamic Params
 * ```ts
 * const userRoute = defineRouteRecord<'user'>({
 *   path: ':userid((?:[1-9]|10\\))',
 *   name: 'user',
 *   component: UserRoute,
 *   meta: {
 *     title: {
 *       default: 'User',
 *       isDynamic: true,
 *       pattern: 'User #<[userid]>',
 *       propsMap: [['userid', 'params.userid']],
 *     },
 *   },
 * });
 * ```
 *
 * @example
 * ### Route with Children
 * ```ts
 * const vueRouterRoute = defineRouteRecord<'vueRouter'>({
 *   path: '/vue-router',
 *   name: 'vueRouter',
 *   component: VueRouterView,
 *   meta: {
 *     title: { default: 'Vue Router' },
 *     isNav: true,
 *     navLinkTitle: 'Router',
 *   },
 *   children: [
 *     defineChildRouteRecord('vueRouter', { name: 'users', ... }),
 *     defineChildRouteRecord('vueRouter', { name: 'posts', ... }),
 *   ],
 * });
 * ```
 *
 * @see {@link defineChildRouteRecord} for defining child routes with parent validation
 * @see {@link defineRoutes} for creating the final routes array
 */
export const defineRouteRecord: <Name extends keyof CustomRouteMap>(
  route: _RouteRecordRaw<Name>,
) => _RouteRecordRaw<Name>;

/**
 * Defines a fully typed child route record with parent-child validation.
 *
 * This helper ensures that the child route's name is valid according to
 * the parent's `childrenNames` defined in `CustomRouteMap`.
 *
 * @template ParentName - The parent route name from `CustomRouteMap`
 * @template ChildName - The child route name (must be in parent's `childrenNames`)
 * @param _parent - The parent route name (used only for type inference, not at runtime)
 * @param config - The child route record configuration object
 * @returns The child route record with proper typing
 *
 * @remarks
 * - The `_parent` parameter is only used for TypeScript inference
 * - Child name must match one of the `childrenNames` defined in parent's `CustomRouteInfo`
 * - Use this instead of {@link defineRouteRecord} when you need parent-child validation
 *
 * @example
 * ### Basic Child Route
 * ```ts
 * import { defineChildRouteRecord } from 'strict-vue-router';
 *
 * // Parent 'vueRouter' has childrenNames: 'users' | 'posts' | 'newRouteTest'
 * const usersRoute = defineChildRouteRecord('vueRouter', {
 *   name: 'users',
 *   path: 'users',
 *   component: UsersRoute,
 *   meta: { title: { default: 'Users' } },
 * });
 * ```
 *
 * @example
 * ### Nested Children
 * ```ts
 * // Parent 'users' has childrenNames: 'user'
 * // Parent 'user' has childrenNames: 'userPost'
 *
 * const vueRouterRoute = defineRouteRecord<'vueRouter'>({
 *   path: '/vue-router',
 *   name: 'vueRouter',
 *   component: VueRouterView,
 *   meta: { title: { default: 'Vue Router' } },
 *   children: [
 *     defineChildRouteRecord('vueRouter', {
 *       name: 'users',
 *       path: 'users',
 *       component: UsersRoute,
 *       meta: { title: { default: 'Users' } },
 *       children: [
 *         defineChildRouteRecord('users', {
 *           name: 'user',
 *           path: ':userid((?:[1-9]|10\\))',
 *           component: UserRoute,
 *           meta: { title: { default: 'User' } },
 *           children: [
 *             defineChildRouteRecord('user', {
 *               name: 'userPost',
 *               path: 'posts/:postid((?:[1-9]|10\\))',
 *               component: UserPostRoute,
 *               meta: { title: { default: 'User Post' } },
 *             }),
 *           ],
 *         }),
 *       ],
 *     }),
 *   ],
 * });
 * ```
 *
 * @example
 * ### Type Error Example
 * ```ts
 * // This will cause a TypeScript error:
 * defineChildRouteRecord('vueRouter', {
 *   name: 'user',  // ❌ Error: 'user' is not in 'vueRouter' childrenNames
 *   path: 'user',
 *   component: UserRoute,
 * });
 *
 * // 'user' should be a child of 'users', not 'vueRouter'
 * ```
 *
 * @see {@link defineRouteRecord} for top-level routes
 * @see {@link createChildDefiner} for creating reusable child definers
 */
export const defineChildRouteRecord: <
  ParentName extends keyof CustomRouteMap,
  ChildName extends ChildrenNamesFromRoute<ParentName>,
>(
  _parent: ParentName,
  config: _RouteRecordRaw<ChildName>,
) => _RouteRecordRaw<ChildName>;

/**
 * Creates a reusable child route definer function bound to a specific parent.
 *
 * This is useful when defining multiple children for the same parent,
 * reducing repetition of the parent name.
 *
 * @template ParentName - The parent route name from `CustomRouteMap`
 * @param _parent - The parent route name (used only for type inference, not at runtime)
 * @returns A function that defines child routes for the specified parent
 *
 * @remarks
 * - Creates a curried version of {@link defineChildRouteRecord}
 * - The returned function only accepts valid children for the bound parent
 * - Useful for cleaner code when a parent has many children
 *
 * @example
 * ### Basic Usage
 * ```ts
 * import { createChildDefiner } from 'strict-vue-router';
 *
 * // Create definers for specific parents
 * const defineVueRouterChild = createChildDefiner('vueRouter');
 * const defineUsersChild = createChildDefiner('users');
 *
 * // Use them to define children
 * const usersRoute = defineVueRouterChild({
 *   name: 'users',
 *   path: 'users',
 *   component: UsersRoute,
 *   meta: { title: { default: 'Users' } },
 * });
 *
 * const userRoute = defineUsersChild({
 *   name: 'user',
 *   path: ':userid((?:[1-9]|10\\))',
 *   component: UserRoute,
 *   meta: { title: { default: 'User' } },
 * });
 * ```
 *
 * @example
 * ### Multiple Children for Same Parent
 * ```ts
 * const defineVueRouterChild = createChildDefiner('vueRouter');
 *
 * const vueRouterRoute = defineRouteRecord<'vueRouter'>({
 *   path: '/vue-router',
 *   name: 'vueRouter',
 *   component: VueRouterView,
 *   meta: { title: { default: 'Vue Router' } },
 *   children: [
 *     defineVueRouterChild({
 *       name: 'users',
 *       path: 'users',
 *       component: UsersRoute,
 *       meta: { title: { default: 'Users' } },
 *     }),
 *     defineVueRouterChild({
 *       name: 'posts',
 *       path: 'posts',
 *       component: PostsRoute,
 *       meta: { title: { default: 'Posts' } },
 *     }),
 *     defineVueRouterChild({
 *       name: 'newRouteTest',
 *       path: 'new-route-test',
 *       component: DynamicRouteTest,
 *       meta: { title: { default: 'New Route Test' } },
 *     }),
 *   ],
 * });
 * ```
 *
 * @example
 * ### Type Safety
 * ```ts
 * const defineVueRouterChild = createChildDefiner('vueRouter');
 *
 * // ✅ Valid - 'users' is in 'vueRouter' childrenNames
 * defineVueRouterChild({ name: 'users', ... });
 *
 * // ❌ Error - 'user' is not in 'vueRouter' childrenNames
 * defineVueRouterChild({ name: 'user', ... });
 * ```
 *
 * @see {@link defineChildRouteRecord} for one-off child definitions
 * @see {@link defineRouteRecord} for top-level routes
 */
export const createChildDefiner: <ParentName extends keyof CustomRouteMap>(
  _parent: ParentName,
) => DefineChildrenFn<ParentName>;

/**
 * Defines a fully typed route records array for Vue Router's `createRouter`.
 *
 * This helper accepts an array of typed route records and returns them
 * in a format compatible with Vue Router's `createRouter` function.
 *
 * @param routes - Array of typed route records (union of all possible route types)
 * @returns The routes array cast to `RouteRecordRaw[]` for `createRouter` compatibility
 *
 * @remarks
 * - Accepts `RouteRecordUnion[]` which is a union of all typed route records
 * - Returns `RouteRecordRaw[]` because `createRouter` expects this type
 * - Use this as the final step when passing routes to `createRouter`
 *
 * @example
 * ### Complete Router Setup
 * ```ts
 * import { createRouter, createWebHistory } from 'vue-router';
 * import { defineRoutes, defineRouteRecord, defineChildRouteRecord } from 'strict-vue-router';
 *
 * const routes = defineRoutes([
 *   defineRouteRecord<'home'>({
 *     path: '/',
 *     name: 'home',
 *     component: () => import('@/views/HomeView.vue'),
 *     meta: { title: { default: 'Home' } },
 *   }),
 *
 *   defineRouteRecord<'vueRouter'>({
 *     path: '/vue-router',
 *     name: 'vueRouter',
 *     component: VueRouterView,
 *     meta: { title: { default: 'Vue Router' } },
 *     children: [
 *       defineChildRouteRecord('vueRouter', {
 *         name: 'users',
 *         path: 'users',
 *         component: UsersRoute,
 *         meta: { title: { default: 'Users' } },
 *       }),
 *     ],
 *   }),
 *
 *   defineRouteRecord<'notFound'>({
 *     path: '/:pathMatch(.*)*',
 *     name: 'notFound',
 *     component: () => import('@/views/NotFoundView.vue'),
 *     meta: { title: { default: '404' } },
 *   }),
 * ]);
 *
 * const router = createRouter({
 *   history: createWebHistory(import.meta.env.BASE_URL),
 *   routes,
 * });
 *
 * export default router;
 * ```
 *
 * @example
 * ### With `resolveRouteTitle`
 * ```ts
 * import { resolveRouteTitle } from 'strict-vue-router';
 *
 * const router = createRouter({
 *   history: createWebHistory(),
 *   routes: defineRoutes([...]),
 * });
 *
 * // Automatically set page titles on navigation
 * router.afterEach((to) => {
 *   resolveRouteTitle(to);
 * });
 *
 * export default router;
 * ```
 *
 * @see {@link defineRouteRecord} for defining individual routes
 * @see {@link defineChildRouteRecord} for defining child routes
 * @see {@link resolveRouteTitle} for dynamic page title resolution
 */
export const defineRoutes: (
  routes: Readonly<RouteRecordUnion[]>,
) => Readonly<RouteRecordRaw[]>;

type Lazy<T> = () => Promise<T>;

/**
 * Allowed Component in {@link RouteLocationMatched}
 */
type RouteComponent = Component | DefineComponent;

/**
 * Allowed Component definitions in route records provided by the user
 */
type RawRouteComponent = RouteComponent | Lazy<RouteComponent>;

/**
 * Holds all possible route record paths
 */
type RouteRecordPathFromName<
  Name extends keyof CustomRouteMap = keyof CustomRouteMap,
> = JoinPaths<CustomRouteMap[Name]["routePath"]> | (string & {});

/**
 * Extract all paths from a specific route name
 */
type RouteNameToPath<Name extends keyof CustomRouteMap> = Join<
  CustomRouteMap[Name]["path"]
>;

/**
 * Extract params keys by route name
 */
type RouteParamsKeysFromName<Name extends keyof CustomRouteMap> =
  Name extends Name
    ? CustomRouteMap[Name]["params"] extends never
      ? string
      : keyof CustomRouteMap[Name]["params"]
    : never;

/**
 * Extract query keys by route name
 */
type RouteQueryKeysFromName<Name extends keyof CustomRouteMap> =
  Name extends Name
    ? CustomRouteMap[Name]["query"] extends never
      ? string
      : keyof CustomRouteMap[Name]["query"]
    : never;

/**
 * Extract params and query keys by route name
 */
type RouteParamsQueryKeysFromName<Name extends keyof CustomRouteMap> =
  Name extends Name
    ? RouteParamsKeysFromName<Name> | RouteQueryKeysFromName<Name>
    : string;

/**
 * Extract props keys by route name
 */
type RoutePropsKeysFromName<Name extends keyof CustomRouteMap> =
  Name extends Name
    ? CustomRouteMap[Name]["props"] extends never
      ? never
      : keyof CustomRouteMap[Name]["props"]
    : never;

/** Extract params by route name */
type RouteParamsFromName<Name extends keyof CustomRouteMap> =
  Name extends keyof CustomRouteMap
    ? CustomRouteMap[Name]["params"] extends never
      ? RouteParamsGeneric
      : CustomRouteMap[Name]["params"]
    : RouteParamsGeneric;

/** Extract query by route name */
type RouteQueryFromName<Name extends keyof CustomRouteMap> =
  Name extends keyof CustomRouteMap
    ? CustomRouteMap[Name]["query"] extends never
      ? never
      : CustomRouteMap[Name]["query"]
    : never;

/** Extract hash by route name */
type RouteHashFromName<Name extends keyof CustomRouteMap> =
  Name extends keyof CustomRouteMap
    ? CustomRouteMap[Name]["hash"] extends never
      ? `#${string}`
      : CustomRouteMap[Name]["hash"]
    : `#${string}`;

/** Extract props keys by route name*/
type RouteRecordPropsFromName<Name extends keyof CustomRouteMap> =
  Name extends keyof CustomRouteMap
    ? CustomRouteMap[Name]["props"] extends never
      ? Record<string, any>
      : CustomRouteMap[Name]["props"]
    : Record<string, any>;

/**
 * Extract historyState by route name
 */
type RouteHistoryStateFromName<
  Name extends keyof CustomRouteMap | undefined = undefined,
> = Name extends keyof CustomRouteMap
  ? CustomRouteMap[Name]["historyState"] extends never
    ? HistoryState
    : CustomRouteMap[Name]["historyState"]
  : HistoryState;

/**
 * Holds all possible route page static title
 */
type RouteStaticTitleFromName<Name extends keyof CustomRouteMap> = NonEmpty<
  CustomRouteMap[Name]["staticTitle"]
> | (string & {});
/**
 * Holds all possible route page dynamic title
 */
type RouteDynamicTitleFromName<Name extends keyof CustomRouteMap> = NonEmpty<
  CustomRouteMap[Name]["dynamicTitle"]
> | (string & {});

/**
 * Extract the allowed children names for a given route
 */
export type ChildrenNamesFromRoute<Name extends keyof CustomRouteMap> =
  CustomRouteMap[Name]["childrenNames"] extends never
    ? keyof CustomRouteMap // Allow any route if no children defined
    : CustomRouteMap[Name]["childrenNames"];

/**
 * A route record that can only be a child of a specific parent
 */
type _RouteRecordChild<
  ParentName extends keyof CustomRouteMap,
  ChildName extends ChildrenNamesFromRoute<ParentName> =
    ChildrenNamesFromRoute<ParentName>,
> = ChildName extends keyof CustomRouteMap ? _RouteRecordRaw<ChildName> : never;

/**
 * Hold all avalable route records in {@link CustomRouteMap} as union
 */
export type RouteRecordUnion = {
  [K in keyof CustomRouteMap]: _RouteRecordRaw<K>;
}[keyof CustomRouteMap];

/**
 * Define nested children with proper parent chain
 */
export type DefineChildrenFn<ParentName extends keyof CustomRouteMap> = <
  ChildName extends ChildrenNamesFromRoute<ParentName>,
>(
  config: _RouteRecordRaw<ChildName>,
) => _RouteRecordRaw<ChildName>;

// Customized the route record types override all (RouteRecordRaw) dependencies
// -----------------------------------------------------------------------

type _RouteRecordPropsSingleView<
  Name extends keyof CustomRouteMap = keyof CustomRouteMap,
> =
  | boolean
  | RouteRecordPropsFromName<Name>
  | ((to: RouteLocationNormalized<Name>) => RouteRecordPropsFromName<Name>);

type _RouteRecordPropsMultipleViews<
  Name extends keyof CustomRouteMap = keyof CustomRouteMap,
> =
  | boolean
  | {
      [K in keyof CustomRouteMap[Name]["props"]]:
        | boolean
        | CustomRouteMap[Name]["props"][K]
        | ((
            to: RouteLocationNormalized<Name>,
          ) => CustomRouteMap[Name]["props"][K]);
    };

/**
 * A fixed version of {@link RouteRecordRedirectOption}.
 *
 * Fix the conflict with {@link _RouteLocationRaw} (name) by ignore
 * the {@link Function.name} property.
 */
type _RouteRecordRedirectOption<
  Name extends keyof CustomRouteMap = keyof CustomRouteMap,
> =
  | _RouteLocationRaw
  | (((
      to: RouteLocation<Name>,
      from: RouteLocationNormalizedLoaded,
    ) => _RouteLocationRaw) & { name?: never });

/**
 * A custom version of the {@link _RouteRecordBase}
 */
interface __RouteRecordBase<
  Name extends keyof CustomRouteMap = keyof CustomRouteMap,
> extends _RouteRecordBase {
  path: RouteRecordPathFromName<Name>;
  name?: Name;
  // Strict children typing!
  children?: _RouteRecordChild<Name>[];
  redirect?: _RouteRecordRedirectOption<Name>;
  props?:
    | _RouteRecordPropsSingleView<Name>
    | _RouteRecordPropsMultipleViews<Name>;
  meta?: RouteMeta<Name>;
  beforeEnter?:
    | CustomNavigationGuardWithThis<undefined, Name>
    | CustomNavigationGuardWithThis<undefined, Name>[];
}

interface _RouteRecordSingleView<
  Name extends keyof CustomRouteMap = keyof CustomRouteMap,
> extends __RouteRecordBase<Name> {
  /**
   * Component to display when the URL matches this route.
   */
  component: RawRouteComponent;
  components?: never;
  children?: never;
  redirect?: never;
  props?: _RouteRecordPropsSingleView<Name>;
}

interface _RouteRecordSingleViewWithChildren<
  Name extends keyof CustomRouteMap = keyof CustomRouteMap,
> extends __RouteRecordBase<Name> {
  /**
   * Component to display when the URL matches this route.
   */
  component?: RawRouteComponent | null | undefined;
  components?: never;
  props?: _RouteRecordPropsSingleView<Name>;
}

interface _RouteRecordMultipleViews<
  Name extends keyof CustomRouteMap = keyof CustomRouteMap,
> extends __RouteRecordBase<Name> {
  /**
   * Components to display when the URL matches this route. Allow using named views.
   */
  components: Record<RoutePropsKeysFromName<Name>, RawRouteComponent>;
  component?: never;
  children?: never;
  redirect?: never;
  /**
   * Allow passing down params as props to the component rendered by
   * `router-view`. Should be an object with the same keys as `components` or a
   * boolean to be applied to every component.
   */
  props?: _RouteRecordPropsMultipleViews<Name>;
}

interface _RouteRecordMultipleViewsWithChildren<
  Name extends keyof CustomRouteMap = keyof CustomRouteMap,
> extends __RouteRecordBase<Name> {
  /**
   * Components to display when the URL matches this route. Allow using named views.
   */
  components?:
    | Record<RoutePropsKeysFromName<Name>, RawRouteComponent>
    | null
    | undefined;
  component?: never;
  /**
   * Allow passing down params as props to the component rendered by
   * `router-view`. Should be an object with the same keys as `components` or a
   * boolean to be applied to every component.
   */
  props?: _RouteRecordPropsMultipleViews<Name>;
}

interface _RouteRecordRedirect<
  Name extends keyof CustomRouteMap = keyof CustomRouteMap,
> extends __RouteRecordBase<Name> {
  redirect: _RouteRecordRedirectOption<Name>;
  component?: never;
  components?: never;
  props?: never;
}

export type _RouteRecordRaw<
  Name extends keyof CustomRouteMap = keyof CustomRouteMap,
> =
  | _RouteRecordSingleView<Name>
  | _RouteRecordSingleViewWithChildren<Name>
  | _RouteRecordMultipleViews<Name>
  | _RouteRecordMultipleViewsWithChildren<Name>
  | _RouteRecordRedirect<Name>;

// -----------------------------------------------------------------------

type PropsMapPath<Name extends keyof CustomRouteMap> =
  | `params.${RouteParamsKeysFromName<Name> & string}`
  | `query.${RouteQueryKeysFromName<Name> & string}`;

type RouteMetaTitleTyped<
  Name extends keyof CustomRouteMap = keyof CustomRouteMap,
> = {
  /**
   * You should provide it as default value for the (document.title) if the (isDynamic) if falsy.
   */
  default: RouteStaticTitleFromName<Name>;
  /**
   * Dynamic route title or not
   * @example
   * Static  -> 'Users'
   * Dynamic -> 'User <[id]>'
   */
  isDynamic?: boolean;
  /**
   * This will hold the string pattern and will use (propsMap) to resolve the final title.
   * @example
   * for a static title  ->  `Posts Page`
   * for a dynamic title ->  `User <[userid]> - <[postid]>` => ex: 'User 1 - 7'
   * @info a title dynamic record must be in the next shape:
   * ```ts
   * <[prop]>
   * ````
   */
  pattern?: RouteDynamicTitleFromName<Name>;
  /**
   * Array of tuple that holds and will be used by the (pattern) to resolve the final title.
   * ```js
   * [propertyName, PropertyPath][]
   * ```
   * - (propertyName): is the name of the property in the title.pattern.
   * - (propertyPath): is the access chain in the {@link RouteRecord} object.
   * @example
   * ```js
   * [['userid', 'params.userid'], ['postid', 'query.postid'], ...]
   * ```
   */
  propsMap?: [RouteParamsQueryKeysFromName<Name>, PropsMapPath<Name>][];
};

/** FIX THE {@link _LiteralUnion} TYPE ISSUE */
// ====================================================================================
// ===================================== START ========================================
// ====================================================================================

/**
 * A Cutomized version from {@link RouteLocationRaw} to fix the apperance of the String object
 * methods and properties in the {@link RouteLocationRaw} caused by {@link _LiteralUnion} type.
 */
type _RouteLocationRaw<
  Name extends keyof CustomRouteMap = keyof CustomRouteMap,
> = RouteMapGeneric extends CustomRouteMap
  ?
      | RouteLocationAsString
      | RouteLocationAsRelativeGeneric
      | RouteLocationAsPathGeneric
  :
      | RouteNameToPath<Name>
      | RouteLocationAsRelativeTypedList<CustomRouteMap>[Name]
      | RouteLocationAsPathTypedList<CustomRouteMap>[Name];

/** A custom {@link NavigationGuardNext} */
export interface CustomNavigationGuardNext<
  Name extends keyof CustomRouteMap = keyof CustomRouteMap,
> {
  (): void;
  (error: Error): void;
  (location: _RouteLocationRaw<Name>): void;
  (valid: boolean | undefined): void;
  (cb: NavigationGuardNextCallback): void;
}

/** A custom {@link NavigationGuardReturn} */
type CustomNavigationGuardReturn<
  Name extends keyof CustomRouteMap = keyof CustomRouteMap,
> =
  | void
  | (Error & { name: never }) // fix the conflict with (Error.name) and (_RouteLocationRaw.name)
  | boolean
  | _RouteLocationRaw<Name>;

/** A custom {@link NavigationGuard} */
interface CustomNavigationGuard<
  Name extends keyof CustomRouteMap = keyof CustomRouteMap,
> {
  (
    to: RouteLocationNormalized<Name>,
    from: RouteLocationNormalizedLoaded,
    next: CustomNavigationGuardNext,
  ): _Awaitable<CustomNavigationGuardReturn>;
}

/**
 * A custom {@link NavigationHookAfter}
 */
interface CustomNavigationHookAfter<
  Name extends keyof CustomRouteMap = keyof CustomRouteMap,
> {
  (
    to: RouteLocationNormalized<Name>,
    from: RouteLocationNormalizedLoaded,
    failure?: NavigationFailure | void,
  ): any;
}

/**
 *  A custom {@link NavigationGuardWithThis}
 * */
interface CustomNavigationGuardWithThis<
  T = undefined,
  Name extends keyof CustomRouteMap = keyof CustomRouteMap,
> {
  (
    this: T,
    to: RouteLocationNormalized<Name>,
    from: RouteLocationNormalizedLoaded,
    next: CustomNavigationGuardNext,
  ): _Awaitable<CustomNavigationGuardReturn>;
}

/** A custom {@link UseLinkOptions} */
interface CustomUseLinkOptions<
  Name extends keyof CustomRouteMap = keyof CustomRouteMap,
> {
  to: MaybeRef<
    | RouteNameToPath<Name>
    | RouteLocationAsRelativeTyped<CustomRouteMap, Name>
    | RouteLocationAsPath<Name>
    | _RouteLocationRaw<Name>
  >;
  replace?: MaybeRef<boolean | undefined>;
  viewTransition?: boolean;
}

//====================================================================================
//===================================== END ==========================================
//====================================================================================

interface CustomErrorListener<
  Name extends keyof CustomRouteMap = keyof CustomRouteMap,
> {
  (
    error: Error | NavigationFailure,
    to: RouteLocationNormalized<Name>,
    from: RouteLocationNormalizedLoaded,
  ): any;
}

declare module "vue-router" {
  // Add types to system by overriding
  // --------------------------------------------------------------

  interface RouteRecordSingleView {
    path: RouteRecordPathFromName;
    name?: keyof CustomRouteMap;
    beforeEnter?:
      | CustomNavigationGuardWithThis
      | CustomNavigationGuardWithThis[];
  }

  interface RouteRecordSingleViewWithChildren {
    path: RouteRecordPathFromName;
    name?: keyof CustomRouteMap;
    beforeEnter?:
      | CustomNavigationGuardWithThis
      | CustomNavigationGuardWithThis[];
  }

  interface RouteRecordMultipleViews {
    path: RouteRecordPathFromName;
    name?: keyof CustomRouteMap;
    beforeEnter?:
      | CustomNavigationGuardWithThis
      | CustomNavigationGuardWithThis[];
  }

  interface RouteRecordMultipleViewsWithChildren {
    path: RouteRecordPathFromName;
    name?: keyof CustomRouteMap;
    beforeEnter?:
      | CustomNavigationGuardWithThis
      | CustomNavigationGuardWithThis[];
  }

  interface RouteRecordRedirect {
    path: RouteRecordPathFromName;
    name?: keyof CustomRouteMap;
    beforeEnter?:
      | CustomNavigationGuardWithThis
      | CustomNavigationGuardWithThis[];
  }

  interface RouteLocationAsPathTyped<
    RouteMap extends RouteMapGeneric = RouteMapGeneric,
    Name extends keyof CustomRouteMap = keyof CustomRouteMap,
  > {
    query?: RouteQueryFromName<Name>;
    hash?: RouteHashFromName<Name>;
    state?: RouteHistoryStateFromName<Name>;
  }

  interface RouteLocationAsRelativeTyped<
    RouteMap extends RouteMapGeneric = RouteMapGeneric,
    Name extends keyof CustomRouteMap = keyof CustomRouteMap,
  > {
    query?: RouteQueryFromName<Name>;
    hash?: RouteHashFromName<Name>;
    state?: RouteHistoryStateFromName<Name>;
  }

  interface RouteLocationNormalizedLoadedTyped<
    RouteMap extends RouteMapGeneric = RouteMapGeneric,
    Name extends keyof CustomRouteMap = keyof CustomRouteMap,
  > {
    query: RouteQueryFromName<Name>;
    hash: RouteHashFromName<Name>;
    path: RouteNameToPath<Name>;
    meta: RouteMeta<Name>;
  }

  interface RouteLocationNormalizedTyped<
    RouteMap extends RouteMapGeneric = RouteMapGeneric,
    Name extends keyof CustomRouteMap = keyof CustomRouteMap,
  > {
    query: RouteQueryFromName<Name>;
    hash: RouteHashFromName<Name>;
    path: RouteNameToPath<Name>;
    meta: RouteMeta<Name>;
  }

  // There's no need to override this interface because it depends on (RouteLocationTyped)
  interface RouteLocationResolvedTyped<
    RouteMap extends RouteMapGeneric,
    Name extends keyof CustomRouteMap,
  > {
    path: RouteNameToPath<Name>;
    query: RouteQueryFromName<Name>;
    hash: RouteHashFromName<Name>;
    meta: RouteMeta<Name>;
    state?: RouteHistoryStateFromName<Name>;
  }

  interface RouteLocationTyped<
    RouteMap extends RouteMapGeneric,
    Name extends keyof CustomRouteMap,
  > {
    path: RouteNameToPath<Name>;
    query: RouteQueryFromName<Name>;
    hash: RouteHashFromName<Name>;
    meta: RouteMeta<Name>;
    state?: RouteHistoryStateFromName<Name>;
  }

  // --------------------------------------------------------------

  function loadRouteLocation<
    Name extends keyof CustomRouteMap = keyof CustomRouteMap,
  >(
    route: RouteLocation<Name> | RouteLocationNormalized<Name>,
  ): Promise<RouteLocationNormalizedLoaded<Name>>;

  function useLink<Name extends keyof CustomRouteMap = keyof CustomRouteMap>(
    props: CustomUseLinkOptions<Name>,
  ): UseLinkReturn<Name>;

  function onBeforeRouteLeave<
    Name extends keyof CustomRouteMap = keyof CustomRouteMap,
  >(leaveGuard: CustomNavigationGuard<Name>): void;

  function onBeforeRouteUpdate<
    Name extends keyof CustomRouteMap = keyof CustomRouteMap,
  >(updateGuard: CustomNavigationGuard<Name>): void;

  // Extend Router types
  interface Router {
    push<Name extends keyof CustomRouteMap = keyof CustomRouteMap>(
      to: _RouteLocationRaw<Name>,
    ): Promise<NavigationFailure | void | undefined>;

    replace<Name extends keyof CustomRouteMap = keyof CustomRouteMap>(
      to: _RouteLocationRaw<Name>,
    ): Promise<NavigationFailure | void | undefined>;

    addRoute(
      parentName: NonNullable<keyof CustomRouteMap>,
      route: _RouteRecordRaw,
    ): () => void;
    addRoute(route: _RouteRecordRaw): () => void;

    removeRoute(name: NonNullable<keyof CustomRouteMap>): void;

    hasRoute(name: NonNullable<keyof CustomRouteMap>): boolean;

    beforeEach<Name extends keyof CustomRouteMap = keyof CustomRouteMap>(
      guard: CustomNavigationGuardWithThis<undefined, Name>,
    ): () => void;

    beforeResolve<Name extends keyof CustomRouteMap = keyof CustomRouteMap>(
      guard: CustomNavigationGuardWithThis<undefined, Name>,
    ): () => void;

    afterEach<Name extends keyof CustomRouteMap = keyof CustomRouteMap>(
      guard: CustomNavigationHookAfter<Name>,
    ): () => void;

    onError<Name extends keyof CustomRouteMap = keyof CustomRouteMap>(
      handler: CustomErrorListener<Name>,
    ): () => void;
  }

  /**
   * Extend the type of the (to) property and use {@link _RouteLocationRaw} intead of {@link RouteLocationRaw}
   * to fix the {@link _LiteralUnion} types issue.
   */
  interface RouterLinkProps {
    to: _RouteLocationRaw;
  }

  // Customized the RouteRecordInfo
  interface RouteRecordInfo<
    Name extends string | symbol = string,
    Path extends string = string,
    ParamsRaw extends RouteParamsRawGeneric = RouteParamsRawGeneric,
    Params extends RouteParamsGeneric = RouteParamsGeneric,
    ChildrenNames extends string | symbol = never,
  > {
    name: Name;
    path: Path;
    paramsRaw: ParamsRaw;
    childrenNames: ChildrenNames;
    params: Params;
    query: RouteQueryFromName<Name>;
    props: RouteRecordPropsFromName<Name>;
    historyState: RouteHistoryStateFromName<Name>;
    hash: RouteHashFromName<Name>;
  }

  // Add Route Named Map
  type RouteNamedMap = {
    [Name in keyof CustomRouteMap]: RouteRecordInfo<
      Name,
      RouteNameToPath<Name>,
      RouteParamsFromName<Name>,
      RouteParamsFromName<Name>,
      CustomRouteMap[Name]["childrenNames"]
    >;
  };

  // Customize internal types
  interface TypesConfig {
    RouteNamedMap: RouteNamedMap;

    /** Fix the {@link _LiteralUnion} issue */
    beforeRouteEnter: CustomNavigationGuardWithThis;
    beforeRouteUpdate: CustomNavigationGuard;
    beforeRouteLeave: CustomNavigationGuard;
    // ------------------------------------

    // Fix the name property in the RouterView component
    RouterView: typeof RouterView &
      DefineComponent<{
        name?: RoutePropsKeysFromName<keyof CustomRouteMap>;
      }>;
  }

  // Custom route meta
  interface RouteMeta<
    Name extends keyof CustomRouteMap = keyof CustomRouteMap,
  > {
    /**
     * The route title (document.title) value.
     */
    title?: RouteMetaTitleTyped<Name>;
  }
}

// Utils
// ---------------------------------------------------------------------

/**
 * Join a tuple of string segments into paths,
 * producing all suffix-unions (like progressively dropping the first element).
 *
 * @example
 *
 * ```ts
 * convert tuple to union
 * ['a', 'b', 'c', 'd']  =>  "a/b/c/d" | "b/c/d" | "c/d" | "d"
 * ```
 */
type JoinPaths<T extends string[]> = T extends [
  infer Head extends string,
  ...infer Tail extends string[],
]
  ? `${Head}${Tail extends [] ? "" : `/${Join<Tail>}`}` | JoinPaths<Tail>
  : never;

/**
 * Helper to fully join a tuple into one string.
 */
type Join<T extends string[]> = T extends [
  infer Head extends string,
  ...infer Tail extends string[],
]
  ? `${Head}${Tail extends [] ? "" : `/${Join<Tail>}`}`
  : "";

/**
 * Ignore empty string from a union type
 *
 * @example
 *
 * ```ts
 * '' | 'a' | 'b'  =>  'a' | 'b'
 * ```
 */
type NonEmpty<T extends string> = T extends "" ? never : T;

// ---------------------------------------------------------------------

export {};
