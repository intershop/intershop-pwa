import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';
import { URLFormParams } from 'ish-core/utils/url-form-params';

export const loadParametersProductListFilter = createAction(
  '[Content Configuration Parameters] Load Product List (Filter)',
  payload<{ id: string; searchParameter: URLFormParams; amount?: number }>()
);

export const loadParametersProductListFilterFail = createAction(
  '[Content Configuration Parameters API] Load Product List (Filter) Fail',
  httpError()
);

export const loadParametersProductListFilterSuccess = createAction(
  '[Content Configuration Parameters API] Load Product List (Filter) Success',
  payload<{ id: string; productList: string[] }>()
);
