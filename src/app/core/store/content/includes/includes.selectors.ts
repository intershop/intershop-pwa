import { Dictionary } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';

import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import {
  ContentPageletEntryPointView,
  createContentPageletEntryPointView,
} from 'ish-core/models/content-view/content-views';
import { ContentPagelet } from '../../../models/content-pagelet/content-pagelet.model';
import { getContentState } from '../content-store';
import { getContentPageletEntities } from '../pagelets';

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
  getContentPageletEntities,
  (
    contentIncludes: Dictionary<ContentPageletEntryPoint>,
    pagelets: Dictionary<ContentPagelet>,
    includeId: string
  ): ContentPageletEntryPointView =>
    !contentIncludes[includeId] ? undefined : createContentPageletEntryPointView(contentIncludes[includeId], pagelets)
);
