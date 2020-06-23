import { createAction } from '@ngrx/store';

import { SuggestTerm } from 'ish-core/models/suggest-term/suggest-term.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const searchProducts = createAction(
  '[Search Internal] Search Products',
  payload<{ searchTerm: string; page?: number; sorting?: string }>()
);

export const searchProductsFail = createAction('[Search API] Search Products Fail', httpError());

export const suggestSearch = createAction(
  '[Suggest Search Internal] Load Search Suggestions',
  payload<{ searchTerm: string }>()
);

export const suggestSearchSuccess = createAction(
  '[Suggest Search API] Return Search Suggestions',
  payload<{ searchTerm: string; suggests: SuggestTerm[] }>()
);
