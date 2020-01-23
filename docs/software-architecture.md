# Software Architecture

This section introduces some decisions made from an architectural point of view.

The Intershop Progressive Web App is a REST API based storefront client that works on top of the Intershop Commerce Management server version 7.10. This means that the communication between the Angular based storefront and Intershop Commerce Management only functions via REST. Customizations should fit into that REST based pattern as well.

## Overview

Please refer to [Angular - Architecture Overview](https://angular.io/guide/architecture) for an in-depth overview of how an Angular application is structured and composed. In short, an Angular application consists of templates, components and services. Templates contain the HTML that is rendered for the browser and displays the UI. Services implement business functionality using [TypeScript](https://en.wikipedia.org/wiki/TypeScript). Components are small and (mostly) independent bridges between services and templates that prepare data for display in templates and collect input from the user to interact with services. Data binding links the template with methods and properties from the component.

Services should have a single responsibility by encapsulating all functionality required in it. The API to a service should be as narrow as possible because services are used throughout the application. It is also possible to combine functionality of multiple services in another more general service if necessary.

The components handling the templates should only handle view logic and should not implement too much specific functionalities. If a component does more than just providing data for the template, it might be better to transfer this to service instances instead.

Multiple components and their respective templates are then composed to pages.

## Concepts

### Mocking REST API Calls

Mocking complete REST responses is configured in _environment.ts_. The property `"mockServerAPI"` switches between mocking all calls (true) and only mocking paths that have to be mocked because they do not yet exist in the [REST API](http://developer.cloud.intershop.com/). The property `"mustMockPaths"` is an array of regular expressions for paths that have to be mocked. Mocked data is put in the folder _assets/mock-data/<path>_. The path is the full path to the endpoint of the service. The JSON response is put into a file called _get.json_ in the respective folder. Serving content dependent on query parameters is done by adding underscored values to the file name.

Mocking REST API Calls is handled by the classes `ApiService` and `MockApiService` which read all the configuration and act accordingly.

### Change Detection

Change detection is on of the core concepts of Angular. Component templates contain data bindings that embed data from the component class into the view. The change detection cycle keeps view and data in sync. To do so, Angular re-evaluates all data expressions from the templates every time the CD runs. If the newly returned value differs from the current value, the corresponding DOM element will be updated in the view. This way, the template stays synchronized with the underlying data.

### Zones

Change detection needs to be triggered whenever a potential change happens. Data changes are most likely invoked by async events (timeout/interval or XHR) or user events (click, input, …). Running CD whenever such an event occurs is – in most cases – enough for establishing a solid view update mechanism.

To access those events, Angular uses the concept of zones. In short words, a zone is an asynchronous execution context that keeps track of all events happening and reports their status to our program.  
See also: [Using Zones in Angular for better performance](https://blog.thoughtram.io/angular/2017/02/21/using-zones-in-angular-for-better-performance.html)

> ![Note](icons/note.png) **Note**  
>Zones wrap asynchronous browser APIs, and notify a consumer when an asynchronous task has started or ended. Angular takes advantage of these APIs to get notified when any asynchronous task is done. This includes things like XHR calls, `setTimeout()` and pretty much all user events like `click`, `submit`, `mousedown`, … etc.

When async events happen in the application, the zone informs Angular which then triggers change detection.

#### Zone Stability

The zone tracks all ongoing async events and does also know whether there are pending tasks in the queue. If so (e.g., a running timer or XHR) it is likely that some change will happen in near future. This makes the zone **unstable**. Once all async tasks have been finished, the zone enters the **stable** status.

> ![Note](icons/note.png) **Note**  
> The zone will never become stable with an endless interval running in the application.

> A **zone is stable** when all pending async tasks have been finished.

The stability of the Angular zone can be used to make decisions in the code. `ApplicationRef.isStable` exposes an Observable stream which gives information about whether the zone is stable or not.

````typescript
import { ApplicationRef } from '@angular/core';

@Component({ /* ... */ })
export class MyComponent {
  constructor(private appRef: ApplicationRef) {
    appRef.isStable.subscribe(stable => {
      if (stable) {
        console.log('Zone is stable');
      }
    });
  }
}
````

#### Using Zone Stability

Getting to know whether a zone is stable or not is crucial when programmatically accessing the application from the "outside". Having a stable zone means that Angular has finished rendering and that we do not expect any async tasks to finish in near future. The Intershop PWA effectively uses this concept for communication with the CMS Design View. Also, Angular waits for stability in Service Workers and in Universal Rendering (Server-Side Rendering).

##### Design View Communication

The Design View, which is part of the ICM backoffice, displays the Intershop PWA in an iframe. It analyzes the component structure of the rendered page and displays it as a tree so that users can edit the structure of the CMS components.

In order to be able to analyze the structure, the application needs to wait for the rendering to be finished – using `isStable`. After each router navigation, the app waits for the zone to become stable before the component tree will be analyzed. The corresponding code can be found in the `SfeAdapterService` class.

##### Service Workers and Universal

Both `@angular/service-worker` and `@angular/platform-server` use zone stability information internally. The Service Worker won't be attached to the page before the zone has become stable. The same applies for Server-Side Rendering: The page will be rendered as soon as the zone is stable. This is necessary because data from HTTP requests need to be resolved to render meaningful content.

##### Pitfall: The zone Needs to Become Stable

For all of those aspects – Design View, Service Workers and Universal rendering – it is essential to get a stable zone at some point. If not, those aspects will not work properly, e.g. Universal rendering will never return the rendered HTML and the Design View will never render the component tree view.

> **Note**  
> Avoid long-running timers and intervals. If this is unavoidable, make sure the async tasks do not start before the zone has become stable once.

If you have any intervals in the application, wait for zone stability first before starting them.

## Best Practices

### Data Handling with Mappers dataHandling

The data (server-side and client-side) have to be separated, because the data sent by the server may change over iterations or may not be in the right format, while the client side shop data handling may be stable for a long time. Therefore, each existing model served by the `httpclient` has to fit the mapper pattern.  
First of all, the raw data (from the server) is defined by an interface (_\<name\>.interface.ts_) and mapped to a type used in the Angular application (_\<name\>.model.ts_). Both files have to be close together so they share a parent directory in _src/core/models_. Next to them is a _\<name\>.mapper.ts_ to map the raw type to the other and back.  
  
**category.interface.ts**

````typescript
export interface CategoryData {
  id: string;
  name: string;
  raw: string;
}
````

**category.model.ts**

````typescript
export class Category {
  id: string;
  name: string;
  transformed: number;
}
````

**category.mapper.ts**

````typescript
@Injectable({ providedIn: 'root'})
export class CategoryMapper {

  fromData(categoryData: CategoryData): Category {
    const category: Category = {
      id: categoryData.id,
      name: categoryData.id,
      transformed: CategoryHelper.transform(categoryData.raw)
    }
    return category;
  }

  fromObject(category: Category): CategoryData {
    const categoryData: CategoryData = {
      id: category.id,
      name: category.id,
      raw: CategoryHelper.raw(categoryData.transformed)
    }
    return categoryData;
  }
}
````

A _\<name\>.helper.ts_ can be introduced to provide utility functions for the model.
