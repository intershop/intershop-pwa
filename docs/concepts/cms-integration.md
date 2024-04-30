<!--
kb_concepts
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# CMS Integration

## Introduction

The Intershop REST API contains resources reflecting the aspects of Intershop's integrated Content Management System (CMS), i.e.
Pagelets, Includes, Pages.

Calling the `/cms` resource will list the available CMS sub resources for the different CMS artifacts.

```json
{
  "elements": [
    {
      "type": "Link",
      "uri": "inSPIRED-inTRONICS-Site/-/cms/viewcontexts",
      "title": "viewcontexts"
    },
    {
      "type": "Link",
      "uri": "inSPIRED-inTRONICS-Site/-/cms/includes",
      "title": "includes"
    },
    {
      "type": "Link",
      "uri": "inSPIRED-inTRONICS-Site/-/cms/pagelets",
      "title": "pagelets"
    },
    {
      "type": "Link",
      "uri": "inSPIRED-inTRONICS-Site/-/cms/pages",
      "title": "pages"
    },
    {
      "type": "Link",
      "uri": "inSPIRED-inTRONICS-Site/-/cms/pagetree",
      "title": "pagetree"
    }
  ],
  "type": "ResourceCollection"
}
```

With this API, a client can retrieve a composition of involved CMS objects (e.g. include, component, slot, component and so on).
It is the client's responsibility to interpret and "render" such a composition tree.
In the PWA this is done by mapping each element onto an Angular specific render component.

![CMS Integration Overview](cms-integration.png)

## Angular CMS Components

A CMS render component in Angular has to fulfill the following requirements:

- It is declared in the `CMSModule`.
- The component must have an input for the assigned pagelet.
- It is added to the `CMSModule` as an `entryComponent` (required, so a factory is generated as it is not referenced directly).
- A mapping has to be provided in the `CMSModule` to map the `definitionQualifiedName` of the ICM realm to the PWA render component.
- It needs to implement the `CMSComponent` interface.

```typescript
providers: [
  {
    provide: CMS_COMPONENT,
    useValue: {
      definitionQualifiedName: 'app_sf_customer_cm:component.custom.inventory.pagelet2-Component',
      class: CMSInventoryComponent,
    },
    multi: true,
  },
];
```

When using `ng generate` with PWA custom schematics, you can apply all those changes described automatically.
For example, the following code block creates a new Angular component named `cms-inventory` and registers it with the `CMSModule`.

```bash
$ ng generate cms inventory --definition-qualified-name app_sf_customer_cm:component.custom.inventory.pagelet2-Component
CREATE src/app/cms/components/cms-inventory/cms-inventory.component.ts (386 bytes)
CREATE src/app/cms/components/cms-inventory/cms-inventory.component.html (32 bytes)
CREATE src/app/cms/components/cms-inventory/cms-inventory.component.spec.ts (795 bytes)
UPDATE src/app/cms/cms.module.ts (4956 bytes)
```

## View Contexts

With the Intershop PWA version 2.0.0 we introduced demo/example view contexts that are now by default disabled with Intershop PWA 5.2.0.
Each integrated view context triggers a REST call that will potentially decrease the SSR rendering performance, something that is not necessary if this feature is not actively used in a PWA project.
If the used ICM does not have the integrated view context instances configured, the requests result in 404 responses which is not helpful either.
For that reason the examples were commented out in the source code and have to be activated in the project source code if needed.

The PWA is prepared to work with the following set of view contexts.

```
viewcontext.include.category.base.bottom
viewcontext.include.category.base.top
viewcontext.include.category.content.bottom
viewcontext.include.category.content.top
viewcontext.include.category.navigation
viewcontext.include.family.base.bottom
viewcontext.include.family.base.top
viewcontext.include.family.content.bottom
viewcontext.include.family.content.top
viewcontext.include.family.navigation
viewcontext.include.product.base.bottom
viewcontext.include.product.base.top
viewcontext.include.product.content.bottom
viewcontext.include.product.content.top
viewcontext.include.product.productinfo
```

To easily add these view contexts to the used ICM (other then the inSPIRED demo data that already contains these view contexts) a content import file is provided in the project sources ([`src/assets/sample-data/view_contexts_import.xml`](../../src/assets/sample-data/view_contexts_import.xml)) that can be imported on organization level.

To activate the view contexts in the PWA search for `<!-- DISABLED VIEW CONTEXT --` and `-- DISABLED VIEW CONTEXT -->` and remove these lines around the view contexts that should be used.
Be aware that some Jest component tests need to be adapted once view contexts are enabled (`MockComponent(ContentViewcontextComponent),`).

> [!NOTE]
> The default view contexts are examples for demonstration purposes that could be used in the same way in a customer project.
> It is advised though to actually evaluate which view contexts are really needed in the project and to activate them accordingly or create the once that fit the project requirements even better.

## Design View

> [!IMPORTANT]
> To use the new Design View for the PWA within the Intershop Administration Portal ICM version 11.7.0 or above is needed.

The Intershop PWA 5.0.0 introduces experimental support for the new Design View that can be used within the Intershop Administration Portal (IAP).
Besides access to the IAP ICM 11 is required, that provides the necessary CMS Management REST API to get information about available CMS models and the CMS page tree and to edit CMS components.

ICM 11 does not provide the basic support for a design preview (as mentioned in the next section) so the _Design View_ tab in the ICM backoffice cannot be used to preview content changes in the PWA.
The new Design View in the IAP currently only supports content editing but not content preview.

## Design Preview

In conjunction with Intershop Commerce Management (ICM) 7.10.39.1, Intershop PWA 3.3.0 introduced basic support for a design preview.
This means the _Design View_ tab in the ICM backoffice can be used to preview content changes in the PWA, but without any direct editing capabilities.
Direct item preview for products, categories and content pages works now as well in the context of the PWA.

The preview feature basically consists of the [`PreviewService`](../../src/app/core/utils/preview/preview.service.ts) that handles the preview functionality by listening for `PreviewContextID` initialization or changes and saving it to the browser session storage.
The [`PreviewInterceptor`](../../src/app/core/interceptors/preview.interceptor.ts) than handles adding a currently available PreviewContextID as matrix parameter `;prectx=` to all REST requests so they can be evaluated on the ICM side returning content fitting to the set preview context.

To end a preview session and to delete the saved `PreviewContextID` in the browser session storage, use the _Finish Preview_ button of the _Design View_ configuration.

## Navigation CMS Components

With the Intershop PWA release 5.1.0 three new CMS rendering components are introduced that can be used to extend the main navigation.

| Component           | Description                                                                                  |
| ------------------- | -------------------------------------------------------------------------------------------- |
| Navigation Category | Renders a main navigation entry based on the selected category with optional sub navigation. |
| Navigation Link     | Renders a main navigation entry to the given link with optional sub navigation.              |
| Navigation Page     | Renders a main navigation entry based on the selected page with optional sub navigation.     |

The according content models, to configure these new components in the ICM backoffice, are part of `icm-as-customization-headless:1.7.0` (ICM 11.9.0).
They are all assignable to the _Header - Navigation_ include and can be combined to extend the main navigation.
It would also be possible to completely configure the main navigation with these components without the default main navigation by only rendering the `<ish-lazy-content-include includeId="include.header.navigation.pagelet2-Include"/>` in the `HeaderNavigationComponent`.
To fulfill such a requirement the source code needs to be adapted accordingly.

All three component allow the configuration of additional freestyle HTML that is rendered within the sub navigation layer.
The root element as well as the depth of the sub navigation tree is configurable for the _Navigation Category_ and the _Navigation Page_ component.

## Integration with an External CMS

Since the Intershop PWA can integrate any other REST API in addition to the ICM REST API, it should not be a problem to integrate an external 3rd party CMS that provides an own REST API, instead of using the integrated ICM CMS.
Even combinations would be possible.

In case an external API has to be integrated, the native Angular `httpClient` must to be used for the REST calls instead of the PWA's `apiService`.
In addition, the mapping of content to the according places in the PWA needs to be handled in a way fitting to the external CMS.
