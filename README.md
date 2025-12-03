<p align="center">
  <img src="./logo.svg" width="300" />
</p>

# **Strict Vue Router Type System**

A comprehensive TypeScript type system for Vue Router that provides **full type safety and autocomplete** throughout your application's routing layer. Never worry about typos in route names, invalid parameters, or missing query properties again.

> **Transform Vue Router from loosely-typed to fully-typed routing with declaration merging and compile-time validation.**

---

## Features

✅ **Full Type Safety** - Catch routing errors at compile-time, not runtime  
✅ **IDE Autocomplete** - Get intelligent suggestions for routes, params, and query  
✅ **Parent-Child Validation** - Ensure child routes only belong to valid parents  
✅ **Dynamic Title Resolution** - Automatically set page titles with parameter interpolation  
✅ **Query & Params Typing** - Strict types for all route parameters and query strings  
✅ **History State Support** - Type-safe navigation state that survives back/forward navigation  
✅ **Hash & Props Support** - Full support for URL hashes and component props  
✅ **Declaration Merging** - Simple interface augmentation to define your routes  
✅ **Zero Runtime Overhead** - All validation happens at compile-time  
✅ **Vue Router 4+ Compatible** - Works with Vue Router 4.6.3 and above  

---

## Installation

```bash
npm install strict-vue-router
# or
pnpm add strict-vue-router
# or
yarn add strict-vue-router
```

**Requirements:**
- Vue 3.5.22+
- Vue Router 4.6.3+
- TypeScript 5.8+

---

## Quick Start

### 1. Define Your Routes

Create a `src/types/routes.d.ts` file and extend the `CustomRouteMap`:

```typescript
declare module 'strict-vue-router' {
  interface CustomRouteMap {
    home: CustomRouteInfo<
      ['/'],           // routePath
      ['/'],           // path
      'Home'           // staticTitle
    >;

    users: CustomRouteInfo<
      ['/users'],
      ['/users'],
      'Users'
    >;

    user: CustomRouteInfo<
      ['/users', ':userid'],
      ['/users', '1' | '2' | '3' | '4' | '5'],
      'User',
      'User #<[userid]>',           // dynamicTitle
      'userPosts' | 'userSettings', // childrenNames
      { userid: string | number },  // params
      { tab?: 'info' | 'activity' } // query
    >;

    userPosts: CustomRouteInfo<
      ['posts'],
      ['posts'],
      'User Posts'
    >;

    userSettings: CustomRouteInfo<
      ['settings'],
      ['settings'],
      'User Settings'
    >;

    notFound: CustomRouteInfo<
      ['/:pathMatch(.*)*'],
      never,
      '404 - Page Not Found',
      never,
      never,
      { pathMatch: string[] }
    >;
  }
}
```

### 2. Define Route Records

```typescript
import { 
  defineRouteRecord, 
  defineChildRouteRecord, 
  defineRoutes,
  resolveRouteTitle 
} from 'strict-vue-router';
import { createRouter, createWebHistory } from 'vue-router';

const routes = defineRoutes([
  defineRouteRecord<'home'>({
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
    meta: { title: { default: 'Home' } },
  }),

  defineRouteRecord<'users'>({
    path: '/users',
    name: 'users',
    component: () => import('@/views/Users.vue'),
    meta: { title: { default: 'Users' } },
  }),

  defineRouteRecord<'user'>({
    path: '/users/:userid',
    name: 'user',
    component: () => import('@/views/User.vue'),
    meta: {
      title: {
        default: 'User',
        isDynamic: true,
        pattern: 'User #<[userid]>',
        propsMap: [['userid', 'params.userid']],
      },
    },
    children: [
      {
        name: 'userPosts',
        path: 'posts',
        component: () => import('@/views/UserPosts.vue'),
        meta: { title: { default: 'User Posts' } },
      },
      {
        name: 'userSettings',
        path: 'settings',
        component: () => import('@/views/UserSettings.vue'),
        meta: { title: { default: 'User Settings' } },
      },
    ],
  }),

  defineRouteRecord<'notFound'>({
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: { default: '404 - Page Not Found' } },
  }),
]);

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Automatically set page titles on navigation
router.afterEach((to) => {
  resolveRouteTitle(to);
});

export default router;
```

### 3. Use in Your Components

```vue
<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// ✅ Full autocomplete! Knows only valid route names
// ✅ Type error if you use invalid route name
router.push({ name: 'user', params: { userid: '5' } });

// ✅ Query params are fully typed
router.push({
  name: 'user',
  params: { userid: '5' },
  query: { tab: 'activity' }, // Only 'info' | 'activity' allowed
});

// ✅ Access typed params
const userid = route.params.userid; // string | number

// ✅ Access typed query
const tab = route.query.tab; // 'info' | 'activity' | undefined

// ❌ Type error if you access non-existent properties
const invalid = route.query.nonexistent; // TypeScript error!
</script>
```

---

## Core Types & Functions

### `CustomRouteMap` Interface

The central interface that defines all your application routes. Extend this via declaration merging.

```typescript
declare module 'strict-vue-router' {
  interface CustomRouteMap {
    routeName: CustomRouteInfo<...>;
  }
}
```

### `CustomRouteInfo<T>` Generic Type

Captures complete type information for a single route:

```typescript
CustomRouteInfo<
  RoutePath,        // ['/users', ':id'] - raw path with placeholders
  Path,             // ['/users', '1'|'2'|'3'] - resolved path values
  StaticTitle,      // 'Users' - fallback page title
  DynamicTitle,     // 'User #<[id]>' - interpolated title pattern
  ChildrenNames,    // 'userProfile' | 'userSettings' - valid child route names
  Params,           // { id: string } - route params
  Query,            // { sort?: 'name' | 'date' } - query parameters
  Props,            // { id: string } - component props
  HistoryState,     // { fromPage: string } - navigation state
  Hash              // `#${'tab1' | 'tab2'}` - URL hash values
>
```

### `defineRouteRecord<Name>(config)` Function

Creates a top-level route with full type checking.

```typescript
const homeRoute = defineRouteRecord<'home'>({
  path: '/',
  name: 'home',
  component: Home,
  meta: { title: { default: 'Home' } },
});
```

**Features:**
- Generic parameter enforces route name exists in `CustomRouteMap`
- Config object is validated against the route's type definition
- Supports children, redirects, and all Vue Router options

### `defineChildRouteRecord(parent, config)` Function

Optional helper for creating child routes with explicit parent-child validation.

```typescript
const childRoute = defineChildRouteRecord('users', {
  name: 'user',
  path: ':id',
  component: User,
  meta: { title: { default: 'User' } },
});
```

**Note:** This is optional! TypeScript automatically validates children through the `ChildrenNames` type, so you can define child routes directly in the `children` array without this wrapper.

**Features:**
- Optional wrapper for explicit validation
- Validates that child name is in parent's `childrenNames`
- Type error if you try to add an invalid child to a parent
- Can be used for clarity and documentation purposes

### `createChildDefiner(parent)` Function

Creates a reusable child route definer for cleaner code.

```typescript
const defineUserChild = createChildDefiner('users');

const childRoute1 = defineUserChild({
  name: 'userProfile',
  path: 'profile',
  component: Profile,
});

const childRoute2 = defineUserChild({
  name: 'userSettings',
  path: 'settings',
  component: Settings,
});
```

**Benefit:** Reduces repetition when defining multiple children for the same parent.

### `defineRoutes(routes)` Function

Wraps your routes array for final type conversion before passing to `createRouter`.

```typescript
const routes = defineRoutes([
  defineRouteRecord<'home'>({ ... }),
  defineRouteRecord<'users'>({ ... }),
]);

const router = createRouter({
  history: createWebHistory(),
  routes, // ✅ Fully typed
});
```

### `resolveRouteTitle(route)` Function

Resolves and sets the page title with dynamic parameter interpolation.

```typescript
router.afterEach((to) => {
  resolveRouteTitle(to);
});

// For a route with dynamicTitle: 'User #<[userid]>'
// When navigating to /users/5
// → document.title becomes "User #5"
```

**How it works:**
1. Checks if route has dynamic title pattern
2. Replaces placeholders using `propsMap` configuration
3. Falls back to static title if not dynamic
4. Sets `document.title` automatically

---

## Advanced Examples

### Route with Query Parameters

```typescript
declare module 'strict-vue-router' {
  interface CustomRouteMap {
    products: CustomRouteInfo<
      ['/products'],
      ['/products'],
      'Products',
      never,
      never,
      never,
      {
        category?: 'electronics' | 'clothing' | 'books';
        sort?: 'price' | 'name' | 'rating';
        page?: `${number}`;
      }
    >;
  }
}

// Usage - full autocomplete!
router.push({
  name: 'products',
  query: {
    category: 'electronics',
    sort: 'price',
    page: '1',
  },
});

// ❌ Type error - only specific categories allowed
router.push({ name: 'products', query: { category: 'invalid' } });
```

### Route with Dynamic Parameters

```typescript
declare module 'strict-vue-router' {
  interface CustomRouteMap {
    article: CustomRouteInfo<
      ['/articles', ':slug'],
      ['/articles', 'vue-3' | 'typescript-guide' | 'react-vs-vue'],
      'Article',
      'Article: <[slug]>',
      never,
      { slug: string },
      { highlight?: 'true' | 'false' }
    >;
  }
}

// ✅ Correct usage with autocomplete
router.push({ name: 'article', params: { slug: 'vue-3' } });

// ❌ Type error - invalid slug
router.push({ name: 'article', params: { slug: 'invalid' } });
```

### Route with History State

```typescript
declare module 'strict-vue-router' {
  interface CustomRouteMap {
    search: CustomRouteInfo<
      ['/search'],
      ['/search'],
      'Search Results',
      never,
      never,
      never,
      { q: string; page?: `${number}` },
      never,
      {
        previousQuery?: string;
        scrollPosition: number;
      }
    >;
  }
}

// Navigate with state
router.push({
  name: 'search',
  query: { q: 'vue' },
  state: {
    scrollPosition: 0,
    previousQuery: 'react',
  },
});

// Access state in component
const route = useRoute();
console.log(route.state?.scrollPosition); // Full type safety!
```

### Route with Hash Anchors

```typescript
declare module 'strict-vue-router' {
  interface CustomRouteMap {
    docs: CustomRouteInfo<
      ['/docs'],
      ['/docs'],
      'Documentation',
      never,
      never,
      never,
      never,
      never,
      never,
      `#${'intro' | 'getting-started' | 'api' | 'faq'}`
    >;
  }
}

// Navigate to specific section with full type safety
router.push({ name: 'docs', hash: '#api' }); // ✅
router.push({ name: 'docs', hash: '#invalid' }); // ❌ Type error!
```

### Multiple Named Views with Props

```typescript
declare module 'strict-vue-router' {
  interface CustomRouteMap {
    dashboard: CustomRouteInfo<
      ['/dashboard'],
      ['/dashboard'],
      'Dashboard',
      never,
      never,
      never,
      never,
      {
        sidebar: { collapsed: boolean; items: string[] };
        main: { title: string; content: string };
      }
    >;
  }
}

// Route definition with named views
defineRouteRecord<'dashboard'>({
  path: '/dashboard',
  name: 'dashboard',
  components: {
    sidebar: () => import('@/components/Sidebar.vue'),
    main: () => import('@/components/MainContent.vue'),
  },
  props: {
    sidebar: { collapsed: false, items: ['item1', 'item2'] },
    main: { title: 'Welcome', content: 'Dashboard content' },
  },
  meta: { title: { default: 'Dashboard' } },
});
```

### Catch-All / 404 Routes

```typescript
declare module 'strict-vue-router' {
  interface CustomRouteMap {
    notFound: CustomRouteInfo<
      ['/:pathMatch(.*)*'],    // Catch-all pattern
      never,                   // No specific path
      '404 - Page Not Found'
    >;
  }
}

// The catch-all params are automatically typed
defineRouteRecord<'notFound'>({
  path: '/:pathMatch(.*)*',
  name: 'notFound',
  component: NotFoundView,
  meta: { title: { default: '404 - Page Not Found' } },
});
```

### Nested Routes with Multiple Levels

```typescript
declare module 'strict-vue-router' {
  interface CustomRouteMap {
    dashboard: CustomRouteInfo<
      ['/dashboard'],
      ['/dashboard'],
      'Dashboard',
      never,
      'stats' | 'settings'
    >;

    stats: CustomRouteInfo<
      ['stats'],
      ['stats'],
      'Statistics',
      never,
      'statsYear' | 'statsMonth'
    >;

    statsYear: CustomRouteInfo<
      [':year'],
      ['2024' | '2025'],
      'Year Statistics'
    >;

    statsMonth: CustomRouteInfo<
      [':month'],
      ['01' | '02' | '03'],
      'Month Statistics'
    >;

    settings: CustomRouteInfo<
      ['settings'],
      ['settings'],
      'Settings'
    >;
  }
}

// Usage with nested children - type-safe through ChildrenNames
defineRouteRecord<'dashboard'>({
  path: '/dashboard',
  name: 'dashboard',
  component: Dashboard,
  meta: { title: { default: 'Dashboard' } },
  children: [
    {
      name: 'stats',
      path: 'stats',
      component: Stats,
      meta: { title: { default: 'Statistics' } },
      children: [
        {
          name: 'statsYear',
          path: ':year',
          component: StatsYear,
        },
        {
          name: 'statsMonth',
          path: ':month',
          component: StatsMonth,
        },
      ],
    },
    {
      name: 'settings',
      path: 'settings',
      component: Settings,
      meta: { title: { default: 'Settings' } },
    },
  ],
});
```

---

## Type Safety Benefits

### Before (Standard Vue Router)

```typescript
// ❌ Typo in route name - no error until runtime!
router.push({ name: 'usre', params: { id: '5' } }); // Runtime error!

// ❌ Wrong param structure - no type checking
const user = route.params; // Could be anything!

// ❌ No autocomplete for query
router.push({ name: 'products', query: { cat: 'test' } }); // Accidental typo

// ❌ Valid routes but wrong structure
router.push({ name: 'article', params: { id: '5' } }); // Needs 'slug'!
```

### After (Strict Vue Router)

```typescript
// ✅ Autocomplete catches typos immediately
router.push({ name: 'user', params: { userid: '5' } }); // ✅ Correct!

// ✅ Params are fully typed
const userid = route.params.userid; // string | number

// ✅ Autocomplete for all query keys
router.push({
  name: 'products',
  query: { category: 'electronics', sort: 'price' }, // Full suggestions!
});

// ✅ Compile-time validation of route structure
router.push({ name: 'article', params: { slug: 'vue-3' } }); // Type-checked!

// ❌ This causes a compile error immediately
router.push({ name: 'user', params: { invalidParam: '5' } }); // TS Error!
```

---

## Best Practices

### 1. **Organize Route Types Separately**

Keep route type definitions in a `.d.ts` file:

```typescript
// routes/types.d.ts
declare module 'strict-vue-router' {
  interface CustomRouteMap {
    // ... all route definitions
  }
}

// router/index.ts
import { defineRouteRecord, defineRoutes } from 'strict-vue-router';
// Types are automatically available through declaration merging
```

### 2. **Use Dynamic Titles for Better UX**

```typescript
// For routes with parameters, always set up dynamic titles
meta: {
  title: {
    default: 'User',
    isDynamic: true,
    pattern: 'User #<[userid]> Profile',
    propsMap: [['userid', 'params.userid']],
  },
}
```

### 3. **Define Children Names Carefully**

```typescript
// ❌ Avoid overly permissive children
childrenNames: keyof CustomRouteMap; // Too loose!

// ✅ Be explicit about which routes can be children
childrenNames: 'profile' | 'settings' | 'notifications';
```

### 4. **Type Safety is Automatic Through ChildrenNames**

```typescript
// ✅ Define children directly - TypeScript validates through ChildrenNames
children: [
  { name: 'user', path: ':id', component: User },
  { name: 'userProfile', path: 'profile', component: Profile },
  { name: 'userSettings', path: 'settings', component: Settings },
]

// ❌ This causes a compile error if 'invalidChild' is not in parent's ChildrenNames
children: [
  { name: 'invalidChild', ... }, // TypeScript error!
]
```

### 5. **Always Call `resolveRouteTitle`**

```typescript
// ✅ Set titles automatically on every navigation
router.afterEach((to) => {
  resolveRouteTitle(to);
});
```

---

## Migration from Standard Vue Router

### Step 1: Set Up Route Types

Create `src/types/routes.d.ts` and define your routes in `CustomRouteMap`.

### Step 2: Update Route Definitions

Replace Vue Router's route definitions with `defineRouteRecord`. Child routes are automatically type-checked through `ChildrenNames`.

### Step 3: Update Router Creation

Wrap your routes array with `defineRoutes()` before passing to `createRouter()`.

### Step 4: Add Title Resolution

Add `router.afterEach((to) => resolveRouteTitle(to))` to automatically set page titles.

### Step 5: Update Navigation Calls

Start using typed `router.push()` with full autocomplete. TypeScript will catch any type mismatches.

---

## Performance

- **Zero Runtime Overhead** - All type validation happens at compile-time
- **Type Erasure** - TypeScript types are completely removed in compiled JavaScript
- **Tree-Shakable** - Unused route definitions are removed by bundlers
- **Minimal Bundle Impact** - Only the small runtime functions are included

---

## Browser Support

Works in all environments that support Vue Router 4:

- Modern browsers (ES2020+)
- Node.js 16+
- All evergreen browsers

---

## Troubleshooting

### "Cannot find module 'strict-vue-router'"

Make sure the package is installed:
```bash
npm install strict-vue-router
```

### Types not recognized in CustomRouteMap

Ensure your type definitions are properly declared in your project. The module declaration will be automatically picked up by TypeScript through declaration merging:

```typescript
declare module 'strict-vue-router' {
  interface CustomRouteMap {
    // Your routes...
  }
}
```

### Route autocomplete not working

1. Check that `tsconfig.json` has `strict: true`
2. Rebuild the TypeScript project
3. Restart your IDE/editor

### Dynamic titles not updating

Make sure you're calling `resolveRouteTitle` in an `afterEach` guard:
```typescript
router.afterEach((to) => {
  resolveRouteTitle(to); // Must be called on every navigation
});
```

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## License

MIT - See LICENSE file for details

---

## Related Projects

- [Vue Router](https://router.vuejs.org/) - Official routing library for Vue
- [Vue 3](https://vuejs.org/) - Progressive JavaScript framework

---

**Made with ❤️ for Vue developers who love type safety**

