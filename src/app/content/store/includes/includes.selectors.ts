import { Dictionary } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';

import { ContentInclude } from '../../../models/content-include/content-include.model';
import { ContentPagelet } from '../../../models/content-pagelet/content-pagelet.model';
import { ContentIncludeView, createIncludeView } from '../../../models/content-view/content-views';
import { getContentState } from '../content.state';
import { getContentPageletEntities } from '../pagelets';

import { includesAdapter } from './includes.reducer';

const getIncludesState = createSelector(getContentState, state => state.includes);

const { selectEntities: getContentIncludeEntities } = includesAdapter.getSelectors(getIncludesState);

// TODO: maybe use a factory for memoization (https://blog.angularindepth.com/ngrx-parameterized-selector-e3f610529f8)
export const getContentInclude = createSelector(
  getContentIncludeEntities,
  getContentPageletEntities,
  (
    contentIncludes: Dictionary<ContentInclude>,
    pagelets: Dictionary<ContentPagelet>,
    includeId: string
  ): ContentIncludeView =>
    !contentIncludes[includeId] ? undefined : createIncludeView(contentIncludes[includeId], pagelets)
);
