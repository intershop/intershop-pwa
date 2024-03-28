import { createAction } from '@ngrx/store';

import { BreadcrumbItem } from 'ish-core/models/breadcrumb-item/breadcrumb-item.interface';
import { payload } from 'ish-core/utils/ngrx-creators';

export const setBreadcrumbData = createAction(
  '[Viewconf Internal] Set Breadcrumb Data',
  payload<{ breadcrumbData: BreadcrumbItem[] }>()
);

export const setStickyHeader = createAction('[Viewconf Internal] Set Sticky Header', payload<{ sticky: boolean }>());

export const setInstantSearchHeader = createAction(
  '[Viewconf Internal] Set Instant Search Header',
  payload<{ instantSearch: boolean }>()
);

export const setDefaultInstantSearchQuery = createAction(
  '[Viewconf Internal] Set Default Instant Search Query',
  payload<{ instantSearchQuery: string }>()
);
