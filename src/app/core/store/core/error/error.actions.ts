import { createAction } from '@ngrx/store';

import { httpError } from 'ish-core/utils/ngrx-creators';

export const generalError = createAction('[Error] Communication Error', httpError());

export const communicationTimeoutError = createAction('[Error] Communication Timeout Error', httpError());

export const serverError = createAction('[Error] Server Error (5xx)', httpError());
