# Search Engine Optimization (SEO)

This section describes how to do Onpage Search Engine Optimization for the Intershop Progressive Web App.

## Server Side Rendering

First of all, the PWA is a Single Page Application (SPA) and needs to run with Server Side Rendering (SSR) to benefit from all the included seo features. 
[Universal](https://angular.io/guide/universal) is a build in feature of Angular and provides Server Side Rendering. 

`npm start` builds the Application and run the Universal Server (SSR)

## robots.txt

By default the universal server provides a robots.txt with access to all pages excepted some restricted paths (e.g. /error or /account)

To use a custom robots.txt place it as a file in dist folder before the server starts.

```
dist
├─ robots.txt <- here
├─ browser
├─ server
└─ server.js
```

## Page Header

Edit the tags in page header to customize title, meta description, robots, canonical link and open graph infos. In general it is possible to use translated text.

The PWA uses the npm package [@ngx-meta/core](https://www.npmjs.com/package/@ngx-meta/core) for that.

#### default config

The default "MetaSettings" are configured in `src/app/extensions/seo/seo.module.ts` and documented in @ngx-meta/core.

```
  const settings: MetaSettings = {
    callback: (key: string) => translate.get(key),
    pageTitlePositioning: PageTitlePositioning.PrependPageTitle,
    pageTitleSeparator: ' | ',
    applicationName: 'seo.applicationName',
    defaults: {
      title: 'seo.defaults.title',
      description: 'seo.defaults.description',
      robots: 'index, follow',
      'og:type': 'website',
      'og:locale': locales[0].lang,
      'og:locale:alternate': locales.map(x => x.lang).join(','),
    },
  };
```

#### static data

`src/app/pages/app-routing.module.ts` is the central place for seo customizations with static content e.g. robots no-index on internal pages. Important is the *MetaGuard* in canActivate and the static values in `data.meta`.

```
const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('./home/home-page.module').then(m => m.HomePageModule),
    canActivate: [MetaGuard],
    data: {
      meta: {
        title: 'seo.title.home',
        description: 'seo.description.home',
      },
    },
  },
  ...
```


#### dynamic data

`src/app/extensions/seo/store/seo/seo.effects.ts` is the central place for seo customizations with dynamic content e.g. names of products or categories (async data by api). Effects are an essential part of our [State Management](./state-management.md).

```
// example: set an alternative page title with searchTerm by url param
@Effect()
seoSearch$ = this.actions$.pipe(
  ofRoute('search/:searchTerm'),
  mapToParam<string>('searchTerm'),
  switchMap(searchTerm => this.translate.get('seo.title.search', { 0: searchTerm })),
  whenTruthy(),
  map(metaTitle => new SetSeoAttributes({ metaTitle }))
);

```

## Customizations already done by Intershop

For some special cases Intershop provides a build-in solution.

#### robots.txt

If there is no custom robots.txt in dist-folder, the universal server generates a default robots.txt.

```
User-agent: *
Disallow: /error
Disallow: /account
Disallow: /compare
Disallow: /recently
Disallow: /basket
Disallow: /checkout
Disallow: /register
Disallow: /login
Disallow: /logout
Disallow: /forgotPassword
Disallow: /contact
```

#### Static Content

Many routes has static configurations for robots and title tags. (see `src/app/pages/app-routing.module.ts`)

#### Dynamic Content

(see: `src/app/extensions/seo/store/seo/seo.effects.ts`)

The **canonical link will set on every page** to prevent duplicated content.

seoCategory$ 
- seoAttributes  by api
- canonical to default category path

seoProduct$
- seoAttributes by api
- canonical to full product path
- Variation Product to Master Product

seoSearch$
- set an alternative page-title with searchTerm by url-param

seoContentPage$
- set an alternative page-title based on content by api
