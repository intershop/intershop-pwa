import { createAction } from '@ngrx/store';

import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const loadContentPage = createAction('[Content Page] Load Content Page', payload<{ contentPageId: string }>());

export const loadContentPageFail = createAction('[Content Page API] Load Content Page Fail', httpError());

export const loadContentPageSuccess = createAction(
  '[Content Page API] Load Content Page Success',
  payload<{ page: ContentPageletEntryPoint; pagelets: ContentPagelet[] }>()
);
