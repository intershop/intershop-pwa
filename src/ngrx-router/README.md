Project imported from https://github.com/amcdnl/ngrx-router

# NGRX Router

Router bindings for NGRX Effects. It allows you to bind to route activation
to fetch data along with some common route actions such as go, back, foward.

This is different from ngrx-router-store in the fact this doesn't actually
add anything to your store, it just emits events.

For more information, checkout this [blog post](https://medium.com/@amcdnl/angular-routing-data-with-ngrx-effects-1cda1bd5e579).

## Getting Started

To get started, lets install the package thru npm:

```
npm i ngrx-router --S
```

then include the effect in your module:

```javascript
import { RouterEffects } from 'ngrx-router';

@NgModule({
  imports: [
    EffectsModule.forRoot([
      ...effects, // < Your other effects
      RouterEffects,
    ]),
  ],
})
export class MyModule {}
```

### Bindings

In an effect, you can do bind to route activations like:

```javascript
import { ofRoute, mapToParam } from 'ngrx-router';

@Injectable()
export class MyEffect {
    constructor(private update$: Actions) {}

    @Effect()
    navigate$ = this.update$.pipe(
        ofRoute('pizza/:id'),
        mapToParam<string>('id'),
        map(id => new LoadPizza(id))
    );
}
```

The operator `ofRoute` supports the following syntax:

- a simple match against a string `ofRoute('pizza/:id')`
- a match against an array of strings `ofRoute(['pizza/:id', 'burger/:id', 'burgers'])`
- a match against a regular expression `ofRoute(/pizza|burger/)`
- filter for all routing actions `ofRoute()`

### Data

The `RouteNavigation` event also contains data which is defined in the `Routes`:

```javascript
RouterModule.forRoot([
  {
    path: 'example',
    component: DummyComponent,
    data: { message: 'hello' },
  },
]);
```

```javascript
mapToData<string>('message'),
```

To get data aggregated from parent routes use the configuration parameter [`paramsInheritanceStrategy`](https://angular.io/api/router/Router#paramsInheritanceStrategy):

```javascript
RouterModule.forRoot(routes, { paramsInheritanceStrategy: 'always' });
```
