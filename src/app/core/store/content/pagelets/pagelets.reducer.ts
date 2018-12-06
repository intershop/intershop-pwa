import { EntityState, createEntityAdapter } from '@ngrx/entity';

import { ContentPagelet } from '../../../models/content-pagelet/content-pagelet.model';
import { IncludesAction, IncludesActionTypes } from '../includes/includes.actions';

export interface PageletsState extends EntityState<ContentPagelet> {}

export const pageletsAdapter = createEntityAdapter<ContentPagelet>();

export const initialState = pageletsAdapter.getInitialState();

export function pageletsReducer(state = initialState, action: IncludesAction) {
  if (action.type === IncludesActionTypes.LoadContentIncludeSuccess) {
    return pageletsAdapter.upsertMany(action.payload.pagelets, state);
  }
  return state;
}
