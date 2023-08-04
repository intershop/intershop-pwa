<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Angular Component Development

## Declare Components in the Right NgModule

Angular requires you to declare a component in one and only one NgModule.
Find the right one in the following order:

_Your Component is used only on one page?_ - Add it to the declarations of the corresponding page.module.

_Your Component is used among multiple pages?_ - Declare it in the shared.module and also export it there.

_Your Component is used in the application shell (and maybe again on certain pages)?_ - Declare it in the shell.module and also export it there.

_(advanced) Your component relates to a specific B2B extension?_ - Declare it in that extension module and add it as an entryComponent, add a lazy-loaded component and add that to the extension exports, which are then im-/exported in the shared.module.

When using `ng generate`, the right module should be found automatically.

## Do not use NgRx or Services in Components

Using NgRx or Services directly in components violates our model of abstraction.
Only facades should be used in components, as they provide the simplest access to the business logic.

## Delegate Complex Component Logic to Services

There should not be any string or URL manipulation, routing mapping or REST endpoint string handling within components.
This is supposed to be handled by methods of services.
See also [Angular Style Guide](https://angular.io/guide/styleguide#style-05-15).

## Put as Little Logic Into `constructor` as Possible - Use `ngOnInit`

See [The essential difference between Constructor and ngOnInit in Angular](https://indepth.dev/posts/1119/the-essential-difference-between-constructor-and-ngoninit-in-angular) and [Angular constructor versus ngOnInit](https://ultimatecourses.com/blog/angular-constructor-ngoninit-lifecycle-hook).

## Use Property Binding to Bind Dynamic Values to Attributes or Properties

See [Explanation of the difference between an HTML attribute and a DOM property](https://angular.io/guide/template-syntax#html-attribute-vs-dom-property).

There are often two ways to bind values dynamically to attributes or properties: interpolation or property binding.
In the PWA we prefer using property binding since this covers more cases in the same way.
So the code will be more consistent.

There is an exception for direct string value bindings where we use for example `routerLink="/logout"` instead of `[routerLink]="'/logout'"`.

:warning: **Pattern to avoid**

```html
<div attr.data-testing-id="category-{{category.id}}">
  <img src="{{base_url + category.images[0].effectiveUrl}}" />
</div>
```

:heavy_check_mark: **Correct pattern**

```html
<div [attr.data-testing-id]="'category-' + category.id">
  <img [src]="base_url + category.images[0].effectiveUrl" />
</div>
```

## Pattern for Conditions (ngIf) with Alternative Template (else) in Component Templates

Also for consistency reasons, we want to establish the following pattern for conditions in component templates:

:warning: **Condition in template**

```typescript
<ng-container *ngIf="show; else elseBlock">
 ... (template code for if-branch)
</ng-container>

<ng-template #elseBlock>
  ... (template code for else-branch)
</ng-template>
```

This pattern provides the needed flexibility if used together with handling observables with `*ngIf` and the `async` pipe.
In this case the condition should look like this:

```typescript
<ng-container *ngIf="observable$ | async as synchronized; else loading">
```

## Pattern for Loops (ngFor) with Changing Data in Component Templates

Looping through an array in a component may sometimes be accompanied by side effects if the data within the array are changing.

```html
<ng-container *ngFor="let element of array$ | async">
  <another-component [element]="element"></another-component>
</ng-container>
```

In case the values of the array$ observable are varying somehow during the lifetime of the component (reordering elements, add/ delete elements, changing properties), all children DOM elements are destroyed and re-initialized with the new data.

To avoid these many and expensive DOM manipulations and persist the children DOM elements the loop elements has to be uniquely identified in the `NgFor` directive.
This can be achieved by using custom [`trackBy`](https://angular.io/api/core/TrackByFunction) functions within the `ngFor` directive.

```typescript
@Component({
  ...
  template: `
  <ng-container *ngFor="let element of array$ | async; trackBy: customTrackByFn">
    <another-component [element]="element"></another-component>
  </ng-container>`
})
export class AnyComponent implements OnInit, OnDestroy {
  ...
  customTrackByFn(index, element) {
    return element.id;
  }
}
```

The custom trackBy function needs to return unique values for all unique inputs.

## Do Not Unsubscribe, Use the takeUntilDestroyed Operator Instead

Following the ideas of the article [takeUntilDestroyed in Angular v16](https://indepth.dev/posts/1518/takeuntildestroy-in-angular-v16), the following pattern is used for ending subscriptions to observables that are not handled via async pipe in the templates.

:heavy_check_mark: **'unsubscribe' via takeUntilDestroyed**

```typescript
export class AnyComponent implements OnInit {
  ...
  ngOnInit() {
    ...
    observable$.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(/* ... */);
  }
}
```

The ESLint rule `rxjs-angular/prefer-takeuntil` enforces the usage of `takeUntilDestroyed` when subscribing in an Angular artifact.

## Use `OnPush` Change Detection if Possible

To reduce the number of ChangeDetection computation cycles, all components should have their `Component` decorator property `changeDetection` set to `ChangeDetectionStrategy.OnPush`.

## DOM Manipulations

When using Angular, avoid to access or change the DOM directly because this may lead to several issues:

- If you use direct DOM accessors like window, document etc., it might not refer to something relevant on the server-side code.
- It might open up your app as an easy target for the XSS injection attack or other security issues.
- The angular synchronization of components amd views are bypassed and this might lead to unwanted side effects.

However, if you need to manipulate the DOM use the multiple DOM manipulation methods of the Angular Renderer2 API or the pwa [DomService](../../src/app/core/utils/dom/dom.service.ts) or other angular techniques.

## Split Components When Necessary

Consider splitting one into multiple components when:

- **Size**: Component code becomes too complex to be easily understandable

- **Separation of concerns**: A component serves different concerns that should be separated

- **Reusability**: A component should be reused in different contexts. This can introduce a shared component which could be placed in a shared module.

- **Async data**: Component relies on async data from the store which makes the component code unnecessarily complex. Use a container component then which resolves the observables at the outside of the child component and passes data in via property bindings. Do not do this for simple cases.

Single-use dumb components are always okay if it improves readability.

## Mock Facades in Tests

Angular Artifacts like Components, Directives and Pipes should solely depend on facades to interact with the [State Management](../concepts/state-management.md).
This is enforced with the ESLint rule `no-intelligence-in-artifacts` which rejects every usage of REST API Services and NgRx Artifacts.

Use [ts-mockito](https://github.com/NagRock/ts-mockito) for creating and managing these mocks.
Providers for Facades can easily be added by using the VSCode snippet `ish-provider-ts-mockito`:

![ish-provider-ts-mockito](ish-provider-ts-mockito.gif 'VSCode snippet ish-provider-ts-mockito in action')
