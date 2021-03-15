<!--
kb_concepts
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# State Management

This concept describes how [NgRx](https://ngrx.io/) is integrated into the Intershop Progressive Web App for the application wide state management.

## Architecture

![State Management](state-management.svg 'State Management')

NgRx is a framework for handling state information in Angular applications following the Redux pattern.
It consist of a few basic parts:

### State

The state is seen as the single source of truth for getting information of the current application state.
There is only one immutable state per application, which is composed of substates.
To get information out of the state, selectors have to be used.
Changing the state can only be done by dispatching actions.

### Selectors

Selectors are functions used to retrieve information about the current state from the store.
The selectors are grouped in a separate file.
They always start the query from the root of the state tree and navigate to the required information.
Selectors return observables which can be held in containers and be bound to in templates.

### Actions

Actions are simple objects used to alter the current state via reducers or trigger effects.
They contain the type of the action and an optional payload.
Action objects are not created directly but rather through action creator functions.
Action creators are held in a separate file.
To alter the state synchronously, reducers have to be composed.
To alter the state asynchronously, effects are used.

### Reducers

Reducers are pure functions which alter the state synchronously.
They take the previous state and an incoming action to compose a new state.
This state is then published and all listening components react automatically to the new state information.
Reducers should be simple operations which are easily testable.

### Effects

Effects use incoming actions to trigger asynchronous tasks like querying REST resources.
After successful or erroneous completion, an effect might trigger another action as a way to alter the current state of the application.

### Facades

Facades are injectable instances which provide simplified and abstracted access to the store via exposed observables and helper methods for dispatching actions.
Facades themselves don't store any data, everything should be delegated to the NgRx store.
They should be used in Angular artifacts but not within NgRx artifacts themselves.

### Context Facades

Context facades provide an elevated access to the state management.
They store data that is unique to the context (i.e. product context: SKU & quantity of the product), so that this context doesn't have to be provided using further helper methods and `Observable` streams.
For implementing these context facades, we use the library [@rx-angular/state][rx-angular-state].

Context facades are provided using [`ElementInjector`](https://angular.io/guide/hierarchical-dependency-injection#elementinjector) and can then be used in providing components and their children:

- Provided in the `@Component` decorator
- Provided via directives on the template

For a more detailed introduction see [here][facades-meetup].
Extensive documentation for the [Product Context Facade](../guides/product-context.md) is also available.

## File Structure

The file structure looks like this:

```txt
src/app/core
        ├─ facades
        |  └─ foobar.facade.ts
        └─ store
           └─ foobar
              ├─ foo
              |  ├─ foo.actions.ts
              |  ├─ foo.effects.ts
              |  ├─ foo.reducer.ts
              |  ├─ foo.selectors.ts
              |  └─ index.ts
              ├─ bar
              |  └─ ...
              ├─ foobar-store.ts
              └─ foobar-store.module.ts
```

An application module named `foobar` with substates named `foo` and `bar` serves as an example.
The files handling NgRx store should then be contained in the folder `foobar`.
Each substate should aggregate its store components in separate subfolders correspondingly named `foo` and `bar`:

- _foo.actions.ts_: This file contains all action creators for the `foo` state.

- _foo.effects.ts_: This file defines an effect class with all its containing effect implementations for the `FooState`.

- _foo.reducer.ts_: This file exports a reducer function which modifies the state of `foo`. Additionally, the `FooState` and its `initialState` is contained here.

- _foo.selectors.ts_: This file exports all selectors working on the state of `foo`.

- _index.ts_: This file exports the public API for the state of the `foo` substate. This includes all specific selectors and actions.

Furthermore, the state of foobar is aggregated in two files:

- _foobar-store.ts_: Contains the `FoobarState` as an aggregate of the `foo` and `bar` states.

- _foobar-store.module.ts_: Contains aggregations for `foobarReducers` and `foobarEffects` of the corresponding substates as well as the store module.

Access to the state slice of `foobar` is provided with the `FoobarFacade` located in _foobar.facade.ts_

## Core Store Structure

The PWA has a core state initializing the [StoreModule.forRoot](https://ngrx.io/api/store/StoreModule#forroot) and multiple feature modules using [StoreModule.forFeature](https://ngrx.io/api/store/StoreModule#forfeature).

- `core`: PWA runtime independent of the ICM like configuration, global error handling or [@ngrx/router-store](https://ngrx.io/guide/router-store) integration.
- `shopping`: Logic and data for browsing the PWA independent of the current user.
- `customer`: Everything user-related (anonymous or logged in) like the current basket or the user profile.
- `content`: Everything related to the CMS.
- `general`: Minor features that don't require a fully fledged feature store.
- ...

All store modules are aggregated and imported in the [`StateManagementModule`](../../src/app/core/state-management.module.ts).

## Naming

Related to the example in the previous paragraph, we want to establish a particular naming scheme.

### Actions - Types

The string value of the type should contain the feature in brackets and a readable action description.
The description should give hints about the dispatcher of the said action, i.e., actions dispatched due to a HTTP service response should have 'API' in their name, actions dispatched by other actions should have 'Internal' in their description.

```typescript
  '[Foo Internal] Load Foo',
  '[Foo] Insert Foo',
  '[Foo API] Load Foo Success',
  ...
```

### Actions - Creators

The action creator is a function with a type argument and an optional payload argument.
Its camelCase name should correspond to its type.
The name should not contain 'Action' as the action is always dispatched via the store and is therefore implicitly correctly named.
The action creator is defined using the [createAction](https://ngrx.io/api/store/createAction) function.
To attach data to an action, use the payload or httpError adapters from [ngrx-creators.ts](../../src/app/core/utils/ngrx-creators.ts).

```typescript
export const loadFoo = createAction('[Foo Internal] Load Foo');
export const loadFooSuccess = createAction('[Foo API] Load Foo Success', payload<{ foo: Foo[] }>());
export const loadFooFail = createAction('[Foo API] Load Foo Fail', httpError());
```

### Reducer

The exported function for the reducer should be named like the substate + 'Reducer' in camelCase.
The reducer function is defined using the [createReducer](https://ngrx.io/api/store/createReducer) function.
Associations between actions and state changes are defined via callbacks in the on function.
To easily set loading or error states, use the setLoadingOn and setErrorOn helpers from [ngrx-creators.ts](../../src/app/core/utils/ngrx-creators.ts).

```typescript
export const fooReducer = createReducer(
  initialState,
  setLoadingOn(loadFoo),
  setErrorOn(loadFooFail),
  on(loadFooSuccess, (state, action) => {
    // state changes
  }),
  ...
)
```

### State

State interfaces should have the state name followed by 'State' in PascalCase.

```typescript
export interface FooState {
...
```

### Selectors

Selectors should always be camelCase and start with 'get' or 'is'.

```typescript
export const getSelectedFoo = createSelector( ...
```

### Facades - Streams

Any field ending with \$ indicates that a stream is supplied. i.e. `foos$()`, `bars$`, `foo$(id)`.
The facade takes care that the stream will be loaded or initialized.
The naming should just refer to the object itself without any verbs.

### Facades - Action Dispatchers

Action dispatcher helpers are represented by methods with verbs. i.e. `addFoo(foo)`, `deleteBar(id)`, `clearFoos()`.

## Entity State Adapter for Managing Record Collections: @ngrx/entity

[@ngrx/entity](https://ngrx.io/guide/entity) provides an API to manipulate and query entity collections.

- Reduces boilerplate for creating reducers that manage a collection of models.
- Provides performant CRUD operations for managing entity collections.
- Extensible type-safe adapters for selecting entity information.

## Normalized State

It is important to have a normalized state when working with NgRx.
To give an example, only the product's state should save products.
Every other slice of the state that also uses products must only save identifiers (in this case SKUs) for products.
In selectors, the data can be linked to views to be easily usable by components.

see: [NgRx: Normalizing state](https://medium.com/@timdeschryver/ngrx-normalizing-state-d3960a86a3aa)

# Further References

- [@rx-angular/state][rx-angular-state]
- [Facades – The Best Layer of your Angular Application @ ngLeipzig #36][facades-meetup]

[rx-angular-state]: https://github.com/rx-angular/rx-angular/blob/master/libs/state/README.md
[facades-meetup]: https://www.youtube.com/watch?v=I14r3joLu9A
