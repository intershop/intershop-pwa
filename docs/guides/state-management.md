<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Developing with NgRx

## NgRx Pitfalls

### Using Services and catchError

The operator handling the possible error of a service call must always be contained in the returned observable of the service call, otherwise it has no effect.

See: [Handling Errors in NgRx Effects](https://medium.com/city-pantry/handling-errors-in-ngrx-effects-a95d918490d9)

```typescript
@Effect()
effect = this.actions$.pipe(
  ofType(ActionLoad),
  switchMap(this.service.method().pipe(
    map(x => new ActionSuccess(x)),
    mapErrorToAction(ActionFail)
  ),
)
```

### Using `switchMap` can Lead to Race Conditions

Using flatmapping operators can lead to unexpected behavior. If in doubt, use `concatMap`.

See [RxJS: Avoiding switchMap-Related Bugs](https://medium.com/angular-in-depth/switchmap-bugs-b6de69155524) for more information.

### Should I put XYZ into the Store or the Component?

Follow the [SHARI-Principle](https://ngrx.io/docs#when-should-i-use-ngrx-for-state-management).
