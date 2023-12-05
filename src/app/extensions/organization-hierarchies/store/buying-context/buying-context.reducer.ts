import { createReducer, on } from '@ngrx/store';

import { OrganizationGroup } from '../../models/organization-group/organization-group.model';

import { assignBuyingContextSuccess } from './buying-context.actions';

export interface BuyingContextState {
  bctx: string;
  group: OrganizationGroup;
}

const initialState: BuyingContextState = {
  bctx: undefined,
  group: undefined,
};

export const buyingContextReducer = createReducer(
  initialState,
  on(assignBuyingContextSuccess, (state: BuyingContextState, action) => {
    const payload = action.payload;
    return {
      ...state,
      bctx: payload.bctx,
      group: payload.group,
    };
  })
);
