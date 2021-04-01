import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { CallParameters } from 'ish-core/models/call-parameters/call-parameters.model';
import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';

import { loadViewContextEntrypointSuccess } from './viewcontexts.actions';

declare type ContentPageletEntryPointWithContext = ContentPageletEntryPoint & {
  viewContextId: string;
  callParameters: CallParameters;
};

export function serializeContextSpecificViewContextId(viewContextId: string, callParameters: CallParameters) {
  const serializedParams = callParameters
    ? Object.entries(callParameters)
        .sort()
        .map(([key, value]) => `@@${key}-${value}`)
        .join('')
    : '';
  return viewContextId + serializedParams;
}

export const viewcontextsAdapter = createEntityAdapter<ContentPageletEntryPointWithContext>({
  selectId: viewcontext => serializeContextSpecificViewContextId(viewcontext.viewContextId, viewcontext.callParameters),
});

export interface ViewcontextsState extends EntityState<ContentPageletEntryPointWithContext> {}

const initialState: ViewcontextsState = viewcontextsAdapter.getInitialState({});

export const viewcontextsReducer = createReducer(
  initialState,

  on(loadViewContextEntrypointSuccess, (state, action) => {
    const { entrypoint, viewContextId, callParameters } = action.payload;

    return {
      ...viewcontextsAdapter.upsertOne({ ...entrypoint, viewContextId, callParameters }, state),
    };
  })
);
