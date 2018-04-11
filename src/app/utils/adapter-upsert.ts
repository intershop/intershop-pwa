import { EntityAdapter, EntityState, Update } from '@ngrx/entity';

/*
 * These are self-built replacements for the upsert methods of @ngrx/entity v5
 * See https://github.com/ngrx/platform/issues/817
 * we can't use the original upsert since this overrides the id property if the key is different from "id"
 * They can be removed once NgRx 6 is out and the issue is fixed
 */

export function adapterUpsertOne<T, U extends EntityState<T>>(
  upsert: { id: string; entity: T },
  state: U,
  adapter: EntityAdapter<T>
): U {
  const { id, entity } = upsert;
  if (state.entities[id]) {
    return adapter.updateOne({ id, changes: entity }, state);
  } else {
    return adapter.addOne(entity, state);
  }
}

export function adapterUpsertMany<T, U extends EntityState<T>>(
  upserts: { id: string; entity: T }[],
  state: U,
  adapter: EntityAdapter<T>
): U {
  const toAdd: T[] = [];
  const toUpdate: Update<T>[] = [];

  upserts.forEach(({ id, entity }) => {
    if (state.entities[id]) {
      toUpdate.push({ id, changes: entity });
    } else {
      toAdd.push(entity);
    }
  });

  const addedState = adapter.addMany(toAdd, state);
  return adapter.updateMany(toUpdate, addedState);
}
