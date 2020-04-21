<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Angular Change Detection

Change detection is on of the core concepts of Angular.
Component templates contain data bindings that embed data from the component class into the view.
The change detection cycle keeps view and data in sync.
To do so, Angular re-evaluates all data expressions from the templates every time the CD runs.
If the newly returned value differs from the current value, the corresponding DOM element will be updated in the view.
This way, the template stays synchronized with the underlying data.

## Zones

Change detection needs to be triggered whenever a potential change happens.
Data changes are most likely invoked by async events (timeout/interval or XHR) or user events (click, input, …).
Running CD whenever such an event occurs is – in most cases – enough for establishing a solid view update mechanism.

To access those events, Angular uses the concept of zones.
In short words, a zone is an asynchronous execution context that keeps track of all events happening and reports their status to our program.
See also: [Using Zones in Angular for better performance](https://blog.thoughtram.io/angular/2017/02/21/using-zones-in-angular-for-better-performance.html)

Zones wrap asynchronous browser APIs, and notify a consumer when an asynchronous task has started or ended.
Angular takes advantage of these APIs to get notified when any asynchronous task is done.
This includes things like XHR calls, `setTimeout()` and pretty much all user events like `click`, `submit`, `mousedown`, … etc.

When async events happen in the application, the zone informs Angular which then triggers change detection.

## Zone Stability

The zone tracks all ongoing async events and does also know whether there are pending tasks in the queue.
If so (e.g., a running timer or XHR) it is likely that some change will happen in near future.
This makes the zone **unstable**.
Once all async tasks have been finished, the zone enters the **stable** status.

- The zone will never become stable with an endless interval running in the application.

- A **zone is stable** when all pending async tasks have been finished.

The stability of the Angular zone can be used to make decisions in the code. `ApplicationRef.isStable` exposes an Observable stream which gives information about whether the zone is stable or not.

```typescript
import { ApplicationRef } from '@angular/core';

@Component({
  /* ... */
})
export class MyComponent {
  constructor(private appRef: ApplicationRef) {
    appRef.isStable.subscribe(stable => {
      if (stable) {
        console.log('Zone is stable');
      }
    });
  }
}
```

## Using Zone Stability

Getting to know whether a zone is stable or not is crucial when programmatically accessing the application from the "outside".
Having a stable zone means that Angular has finished rendering and that we do not expect any async tasks to finish in near future.
The Intershop PWA effectively uses this concept for communication with the CMS Design View.
Also, Angular waits for stability in Service Workers and in Universal Rendering (Server-Side Rendering).

### Design View Communication

The Design View, which is part of the ICM backoffice, displays the Intershop PWA in an iframe.
It analyzes the component structure of the rendered page and displays it as a tree so that users can edit the structure of the CMS components.

In order to be able to analyze the structure, the application needs to wait for the rendering to be finished – using `isStable`.
After each router navigation, the app waits for the zone to become stable before the component tree will be analyzed.
The corresponding code can be found in the `SfeAdapterService` class.

### Service Workers and Universal

Both `@angular/service-worker` and `@angular/platform-server` use zone stability information internally.
The Service Worker will not be attached to the page before the zone has become stable.
The same applies for server-side rendering: The page will be rendered as soon as the zone is stable.
This is necessary because data from HTTP requests must be resolved to render meaningful content.

### Pitfall: The Zone Must Become Stable

For all of those aspects – Design View, Service Workers and Universal rendering – it is essential to get a stable zone at some point.
If not, those aspects will not work properly, e.g.
Universal rendering will never return the rendered HTML and the Design View will never render the component tree view.

> **Note**  
> Avoid long-running timers and intervals. If this is unavoidable, make sure the async tasks do not start before the zone has become stable once.

If you have any intervals in the application, wait for zone stability first before starting them.
