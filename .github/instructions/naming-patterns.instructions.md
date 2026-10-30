---
applyTo: '**'
---

## File Naming Conventions

Use descriptive feature names with appropriate suffixes:

- Component: `[feature].component.ts`

- Service: `[feature].service.ts` (REST: `services/[feature]/`, utility: `utils/[feature]/`)
- Facade: `[feature].facade.ts`

- Action: `[feature].actions.ts`
- Reducer: `[feature].reducer.ts`
- Effect: `[feature].effects.ts`
- Selector: `[feature].selectors.ts`

- Interface: `[data-object].interface.ts`
- Mapper: `[data-object].mapper.ts`
- Model: `[data-object].model.ts`
- Helper: `[data-object].helper.ts`

## Model Folders

Each data object gets its own folder `models/[data-object]/`, and every file in it is named after that object:

- `[data-object].model.ts`: the PWA type
- `[data-object].interface.ts`: raw API data (`[DataObject]Data`), when it differs from the model
- `[data-object].mapper.ts`: class `[DataObject]Mapper` with static `fromData()`, see [Data Handling with Mappers](../../docs/guides/data-handling-with-mappers.md)
- `[data-object].helper.ts`: class `[DataObject]Helper` with static methods

A type repeated inline belongs to the existing model it derives from: name it there or use `Pick<Model, ...>`.
