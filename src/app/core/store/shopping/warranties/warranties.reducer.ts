import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Warranty } from 'ish-core/models/warranty/warranty.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { warrantyActions, warrantyApiActions } from './warranties.actions';

export const warrantiesAdapter = createEntityAdapter<Warranty>({
  selectId: warranty => warranty.id,
});

export interface WarrantiesState extends EntityState<Warranty> {
  loading: boolean;
  error: HttpError;
}

const initialState: WarrantiesState = warrantiesAdapter.getInitialState({
  loading: false,
  error: undefined,
});

export const warrantiesReducer = createReducer(
  initialState,
  setLoadingOn(warrantyActions.loadWarranty),
  setErrorOn(warrantyApiActions.loadWarrantyFail),
  unsetLoadingAndErrorOn(warrantyApiActions.loadWarrantySuccess),
  on(warrantyApiActions.loadWarrantySuccess, (state, action) =>
    warrantiesAdapter.upsertOne(action.payload.warranty, state)
  )
);
