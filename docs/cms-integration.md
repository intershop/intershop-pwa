# CMS Integration

## Introduction


Intershops REST API contains resources reflecting the main aspects of CMS, i.e., Pagelets, Pages and Includes. The API is still in **beta** state as not all business features of the classic (ISML) storefront are supported yet. With this API a client can retrieve a composition of involved CMS objects (page, page variant, slot, component and so on). It is the client's responsibility to interpret and "render" such a composition tree. In the PWA this is done by mapping each element onto an Angular specific render component.

CMS\_Overview 2

## Angular

A render component in Angular has to fulfill the following requirements:

* It is declared in the `CMSModule`.
* The component must have an input for the assigned pagelet.
* It is added to the `CMSModule` as an `entryComponent` (required, so a factory is generated as it is not referenced directly).
* A mapping has to be provided in the `CMSModule` to map the `definitionQualifiedName` of the ICM realm to the PWA render component.

````typescript
providers: [
   ...
  {
    provide: CMS_COMPONENT,
    useValue: {
      definitionQualifiedName: 'app_sf_customer_cm:component.custom.inventory.pagelet2-Component',
      class: CMSInventoryComponent,
    },
    multi: true,
  }
]
````

When using `ng generate` with PWA custom schematics, you can apply all those changes described automatically. For example, the following code block creates a new Angular component named `cms-inventory` and registers it with the `CMSModule`.

````bash
$ ng generate cms inventory --definitionQualifiedName app_sf_customer_cm:component.custom.inventory.pagelet2-Component
CREATE src/app/cms/components/cms-inventory/cms-inventory.component.ts (386 bytes)
CREATE src/app/cms/components/cms-inventory/cms-inventory.component.html (32 bytes)
CREATE src/app/cms/components/cms-inventory/cms-inventory.component.spec.ts (795 bytes)
UPDATE src/app/cms/cms.module.ts (4956 bytes)
````

> **Visual Studio Code integration**  
> For Visual Studio Code there is an extension that offers comfortable usage options for the schematics, see [Angular Schematics](https://marketplace.visualstudio.com/items?itemName=cyrilletuzi.angular-schematics).
