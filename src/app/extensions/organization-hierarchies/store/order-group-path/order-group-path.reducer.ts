import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { loadOrdersSuccess } from 'ish-core/store/customer/orders';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { OrderGroupPath } from '../../models/order-group-path/order-group-path.model';

import {
  loadOrdersWithGroupPaths,
  loadOrdersWithGroupPathsFail,
  loadOrdersWithGroupPathsSuccess,
} from './order-group-path.actions';

export const pathAdapter = createEntityAdapter<OrderGroupPath>({
  selectId: orderGroupPath => orderGroupPath.orderId,
});

export interface OrderGroupPathState extends EntityState<OrderGroupPath> {
  loading: boolean;
  error: HttpError;
}

const initialState: OrderGroupPathState = pathAdapter.getInitialState({
  loading: false,
  error: undefined,
});

export const orderGroupPathReducer = createReducer(
  initialState,
  setLoadingOn(loadOrdersWithGroupPaths),
  setErrorOn(loadOrdersWithGroupPathsFail),
  unsetLoadingAndErrorOn(loadOrdersWithGroupPathsSuccess),
  on(loadOrdersWithGroupPathsSuccess, (state: OrderGroupPathState, action) => {
    const { paths } = action.payload;
    return {
      ...pathAdapter.upsertMany(paths, state),
      loading: false,
      ids: paths.map(p => p.orderId),
    };
  }),
  on(loadOrdersSuccess, (state: OrderGroupPathState) => ({
    ...state,
    loading: false,
  }))
);
