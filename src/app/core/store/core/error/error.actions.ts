import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const communicationTimeoutError = createAction('[Error Internal] Communication Timeout Error', httpError());

export const serverError = createAction('[Error Internal] Server Error (5xx)', httpError());

export const businessError = createAction('[Error] Business Error', payload<{ error: string }>());

export const serverConfigError = createAction('[Error Internal] Load Server Configuration Error', httpError());
