import { createAction } from '@ngrx/store';

import { SuggestTerm } from 'ish-core/models/suggest-term/suggest-term.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const searchProducts = createAction(
  '[Shopping] Search Products',
  payload<{ searchTerm: string; page?: number; sorting?: string }>()
);

export const searchProductsFail = createAction('[Shopping] Search Products Fail', httpError());

export const suggestSearch = createAction(
  '[Suggest Search] Load Search Suggestions',
  payload<{ searchTerm: string }>()
);

export const suggestSearchSuccess = createAction(
  '[Suggest Search Internal] Return Search Suggestions',
  payload<{ searchTerm: string; suggests: SuggestTerm[] }>()
);
