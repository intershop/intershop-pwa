import { createAction } from '@ngrx/store';

import { ContentPageTree } from 'ish-core/models/content-page-tree/content-page-tree.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const loadContentPageTree = createAction(
  '[Content Page] Load Content Page Tree',
  payload<{ contentPageId: string; depth: string }>()
);

export const loadContentPageTreeFail = createAction('[Content Page API] Load Content Page Tree Fail', httpError());

export const loadContentPageTreeSuccess = createAction(
  '[Content Page API] Load Content Page Tree Success',
  payload<{ tree: ContentPageTree }>()
);
