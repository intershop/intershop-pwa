# Modules

## only 3 main kinds of (flexible) modules

### page modules

- import SharedModule
- only loaded via routing
- never imported
- declares Components specific for this page
- also contains Routing information

### Feature Modules

- declares only routing and ngrx information for this feature
- could be split

### Shared Component Modules

- only needed if Component is used on both pages and application shell
- should not export more than one Component

## general/exceptional modules

### SharedModule

- declares and exports all Components used by more than one page

### CoreModule

- declarations for Application Shell
- Providers for application-wide stuff
- should not have exports ?

### Utility Modules

- PipesModule
- FeatureToggleModule
- FormsSharedModule
- FormsAddressModule

```
src/app
  (feature)/
    (feature).module.ts
    services/
    store/
    (ṕage)/
      (page)-page.module
      components/
      containers/
  shared/
    (feature)/
      (feature)-.*.module.ts
      components/
      containers/
```

# Problems

- CMSModule as extra module, CMSProductList requires ProductTileContainer --> more component feature modules
  - current solution: provide CMSProductList in SharedModule

# next steps

## Division of ngrx and pages

- ngrx, services and models move to a specific folder under `src/app`
- pages are then not furtherly ordered into features
  --> the current main components can be found via the current route
- CoreModule is also divided into application shell and real core functionality --> Application shell components could then be re-imported into SharedModule

```
src/app
  core/ <-- contains everything ngrx and services
    store/ <-- represents the store structre
      checkout
        basket
        viewconf
      shopping
        category
        product
      user
    services/ <-- represents the REST endpoints
      address
      basket
      categories
      filter
      products
    models/ <-- moved models folder
      address
      attribute
  util/ <-- utility modules
  shell/
    header/
    footer/
  pages/ <-- first name like routing structure, then grouped by artifact
    basket/
      components
        shopping-basket
        shopping-basket-empty
      basket-page.module.ts
      basket-page.container.html
      basket-page.container.ts
    checkout/
      components
        checkout-progress-bar
      checkout-page.module.ts
      checkout-page.container.html
      checkout-page.container.ts
    checkout-address-X/
      components
      ((checkout-address-page.module.ts)) <-- leave out when synchronous
      checkout-address-page.container.html
      checkout-address-page.container.ts
    category/
    ...
  shared/
    shared.module.ts
  app.routing.module
  core.module.ts
```
