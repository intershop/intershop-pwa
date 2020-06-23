import { createAction } from '@ngrx/store';

import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const loadContentInclude = createAction(
  '[Content Include] Load Content Include',
  payload<{ includeId: string }>()
);

export const loadContentIncludeFail = createAction('[Content Include API] Load Content Include Fail', httpError());

export const loadContentIncludeSuccess = createAction(
  '[Content Include API] Load Content Include Success',
  payload<{ include: ContentPageletEntryPoint; pagelets: ContentPagelet[] }>()
);
