---
applyTo: '**/*.ts'
---

## Performance Optimization Patterns

### Component Performance

- **OnPush Strategy:** Always use `ChangeDetectionStrategy.OnPush`
- **TrackBy Functions:** Use `trackBy` with `*ngFor` for dynamic lists
- **Subscription Management:** Unsubscribe properly to prevent memory leaks
- **Lazy Loading:** Use lazy loading for modules and components

### Observable Optimization

- **ShareReplay:** Use for expensive operations that should be cached
- **DistinctUntilChanged:** Prevent unnecessary emissions
- **DebounceTime:** For user input and frequent events
- **Take(1):** For one-time operations

### NgRx Performance

- **Selectors:** Use memoized selectors for computed state
- **Entity Adapters:** Use for normalized state management
- **Effects Concurrency:** Use appropriate merge strategies (switchMap, mergeMap, concatMap)

### Bundle Optimization

- **Tree Shaking:** Import only what you need
- **Shared Chunks:** Optimize webpack splitting
- **Dead Code:** Regular cleanup of unused code

### Memory Management

- **Avoid Memory Leaks:** Unsubscribe from observables
- **Component Cleanup:** Clear references in ngOnDestroy
- **Event Listeners:** Remove manual event listeners

### Lazy Loading Patterns

- **Feature Modules:** Load modules on demand
- **Image Loading:** Use `loading="lazy"` for non-critical images
- **Route-based:** Split large features into separate bundles

### State Management Performance

- **Minimal State Updates:** Only update what changed
- **Immutable Operations:** Use immutable update patterns
