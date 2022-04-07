import { createAction } from '@ngrx/store';

import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const loadPagelet = createAction('[Pagelets] Load Pagelet', payload<{ pageletId: string }>());

export const loadPageletFail = createAction('[Pagelets API] Load Pagelet Fail', httpError());

export const loadPageletSuccess = createAction(
  '[Pagelets API] Load Pagelet Success',
  payload<{ pagelet: ContentPagelet }>()
);
