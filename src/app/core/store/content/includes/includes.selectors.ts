import { Dictionary } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';

import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import { ContentEntryPointView, createContentEntryPointView } from 'ish-core/models/content-view/content-views';
import { ContentPagelet } from '../../../models/content-pagelet/content-pagelet.model';
import { getContentState } from '../content-store';
import { getContentPageletEntities } from '../pagelets';

import { includesAdapter } from './includes.reducer';

const getIncludesState = createSelector(
  getContentState,
  state => state.includes
);

const { selectEntities: getContentIncludeEntities } = includesAdapter.getSelectors(getIncludesState);

// TODO: maybe use a factory for memoization (https://blog.angularindepth.com/ngrx-parameterized-selector-e3f610529f8)
export const getContentInclude = createSelector(
  getContentIncludeEntities,
  getContentPageletEntities,
  (
    contentIncludes: Dictionary<ContentPageletEntryPoint>,
    pagelets: Dictionary<ContentPagelet>,
    includeId: string
  ): ContentEntryPointView =>
    !contentIncludes[includeId] ? undefined : createContentEntryPointView(contentIncludes[includeId], pagelets)
);
