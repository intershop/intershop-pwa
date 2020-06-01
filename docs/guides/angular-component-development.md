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

See [The essential difference between Constructor and ngOnInit in Angular](https://indepth.dev/the-essential-difference-between-constructor-and-ngoninit-in-angular/) and [Angular constructor versus ngOnInit](https://ultimatecourses.com/blog/angular-constructor-ngoninit-lifecycle-hook).

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

## Pattern for Conditions (ngif) with Alternative Template (else) in Component Templates

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
<ng-container *ngIf="(observable$ | async) as synchronized; else loading">
```

## Do Not Unsubscribe, Use Destroy Observable and takeUntil Instead

Following the ideas of the article [RxJS: Don’t Unsubscribe](https://medium.com/@benlesh/rxjs-dont-unsubscribe-6753ed4fda87), the following pattern is used for ending subscriptions to observables that are not handled via async pipe in the templates.

:heavy_check_mark: **'unsubscribe' via destroy\$ Subject**

```typescript
export class AnyComponent implements OnInit, OnDestroy {
  ...
  private destroy$ = new Subject();
  ...
  ngOnInit() {
    ...
    observable$.pipe(takeUntil(this.destroy$))
      .subscribe(/* ... */);
  }
  ...
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

The TSLint rule `rxjs-prefer-angular-takeuntil` enforces the usage of a `destroy$` Subject with `takeUntil` when subscribing in an Angular artifact.
You can use the schematic `add-destroy` to automatically generate the required logic:

```
$ ng g add-destroy shared/components/common/accordion

UPDATE src/app/shared/components/common/accordion/accordion.component.ts (425 bytes)
```

## Use `OnPush` Change Detection if Possible

To reduce the number of ChangeDetection computation cycles, all components should have their `Component` decorator property `changeDetection` set to `ChangeDetectionStrategy.OnPush`.

## Split Components When Necessary

Consider splitting one into multiple components when:

- **Size**: Component code becomes too complex to be easily understandable

- **Separation of concerns**: A component serves different concerns that should be separated

- **Reusability**: A component should be reused in different contexts. This can introduce a shared component which could be placed in a shared module.

- **Async data**: Component relies on async data from the store which makes the component code unnecessarily complex. Use a container component then which resolves the observables at the outside of the child component and passes data in via property bindings. Do not do this for simple cases.

Single-use dumb components are always okay if it improves readability.

## Mock Facades in Tests

Angular Artifacts like Components, Directives and Pipes should solely depend on facades to interact with the [State Management](../concepts/state-management.md).
This is enforced with the TSLint rule `no-intelligence-in-artifacts` which rejects every usage of REST API Services and NgRx Artifacts.

Use [ts-mockito](https://github.com/NagRock/ts-mockito) for creating and managing these mocks.
Providers for Facades can easily be added by using the VSCode snippet `ish-provider-ts-mockito`:

![ish-provider-ts-mockito](ish-provider-ts-mockito.gif 'VSCode snippet ish-provider-ts-mockito in action')
