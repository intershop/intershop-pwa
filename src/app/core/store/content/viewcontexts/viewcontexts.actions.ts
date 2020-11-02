import { createAction } from '@ngrx/store';

import { CallParameters } from 'ish-core/models/call-parameters/call-parameters.model';
import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const loadViewContextEntrypoint = createAction(
  '[Content View Context] Load Entrypoint',
  payload<{ viewContextId: string; callParameters: CallParameters }>()
);

export const loadViewContextEntrypointFail = createAction(
  '[Content View Context API] Load Entrypoint Fail',
  httpError()
);

export const loadViewContextEntrypointSuccess = createAction(
  '[Content View Context API] Load Entrypoint Success',
  payload<{
    entrypoint: ContentPageletEntryPoint;
    pagelets: ContentPagelet[];
    viewContextId: string;
    callParameters: CallParameters;
  }>()
);
