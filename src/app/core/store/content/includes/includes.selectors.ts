import { Dictionary } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';

import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import {
  ContentPageletEntryPointView,
  createContentPageletEntryPointView,
} from 'ish-core/models/content-view/content-view.model';
import { getContentState } from 'ish-core/store/content/content-store';

import { includesAdapter } from './includes.reducer';

const getIncludesState = createSelector(
  getContentState,
  state => state.includes
);

const { selectEntities: getContentIncludeEntities } = includesAdapter.getSelectors(getIncludesState);

export const getContentIncludeLoading = createSelector(
  getIncludesState,
  includes => includes.loading
);

export const getContentInclude = createSelector(
  getContentIncludeEntities,
  (contentIncludes: Dictionary<ContentPageletEntryPoint>, includeId: string): ContentPageletEntryPointView =>
    createContentPageletEntryPointView(contentIncludes[includeId])
);
