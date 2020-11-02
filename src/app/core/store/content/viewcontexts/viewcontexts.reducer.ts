import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { CallParameters } from 'ish-core/models/call-parameters/call-parameters.model';
import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import { setLoadingOn } from 'ish-core/utils/ngrx-creators';

import {
  loadViewContextEntrypoint,
  loadViewContextEntrypointFail,
  loadViewContextEntrypointSuccess,
} from './viewcontexts.actions';

declare type ContentPageletEntryPointWithContext = ContentPageletEntryPoint & {
  viewContextId: string;
  callParameters: CallParameters;
};

export function serializeContextSpecificViewContextId(viewContextId: string, callParameters: CallParameters) {
  return (
    viewContextId +
    Object.keys(callParameters)
      .map(key => `@${key}-${callParameters[key]}`)
      .join('')
  );
}

export const viewcontextsAdapter = createEntityAdapter<ContentPageletEntryPointWithContext>({
  selectId: viewcontext => serializeContextSpecificViewContextId(viewcontext.viewContextId, viewcontext.callParameters),
});

export interface ViewcontextsState extends EntityState<ContentPageletEntryPointWithContext> {
  loading: boolean;
}

export const initialState: ViewcontextsState = viewcontextsAdapter.getInitialState({
  loading: false,
});

export const viewcontextsReducer = createReducer(
  initialState,
  setLoadingOn(loadViewContextEntrypoint),
  on(loadViewContextEntrypointFail, (state: ViewcontextsState) => ({
    ...state,
    loading: false,
  })),
  on(loadViewContextEntrypointSuccess, (state: ViewcontextsState, action) => {
    const { entrypoint, viewContextId, callParameters } = action.payload;

    return {
      ...viewcontextsAdapter.upsertOne({ ...entrypoint, viewContextId, callParameters }, state),
      loading: false,
    };
  })
);
