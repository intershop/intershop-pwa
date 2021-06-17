import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { OrderGroupPath } from '../../models/order-group-path/order-group-path.model';

export const loadOrdersWithGroupPaths = createAction('[Organizational Groups API] Load Orders with Group Paths');

export const loadOrdersWithGroupPathsSuccess = createAction(
  '[Organizational Groups API] Load Orders with Group Paths Success',
  payload<{ paths: OrderGroupPath[] }>()
);

export const loadOrdersWithGroupPathsFail = createAction(
  '[Organizational Groups API] Load Orders with Group Paths Fail',
  httpError()
);
