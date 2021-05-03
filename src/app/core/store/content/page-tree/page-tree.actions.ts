import { createAction } from '@ngrx/store';

import { ContentPageTree } from 'ish-core/models/content-page-tree/content-page-tree.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const loadContentPageTree = createAction(
  '[Content Page Tree] Load Content Page Tree',
  payload<{ rootId: string; depth: number }>()
);

export const loadContentPageTreeFail = createAction('[Content Page Tree API] Load Content Page Tree Fail', httpError());

export const loadContentPageTreeSuccess = createAction(
  '[Content Page Tree API] Load Content Page Tree Success',
  payload<{ pagetree: ContentPageTree }>()
);
