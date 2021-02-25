import { Dictionary } from '@ngrx/entity';
import { createSelector, createSelectorFactory, resultMemoize } from '@ngrx/store';
import { isEqual } from 'lodash-es';

import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import { createContentPageletEntryPointView } from 'ish-core/models/content-view/content-view.model';
import { getContentState } from 'ish-core/store/content/content-store';

import { includesAdapter } from './includes.reducer';

const getIncludesState = createSelector(getContentState, state => state.includes);

const { selectEntities: getContentIncludeEntities } = includesAdapter.getSelectors(getIncludesState);

export const getContentIncludeLoading = createSelector(getIncludesState, includes => includes.loading);

const getContentIncludeMemoized = (includeId: string) =>
  createSelectorFactory<object, ContentPageletEntryPoint>(projector => resultMemoize(projector, isEqual))(
    getContentIncludeEntities,
    (contentIncludes: Dictionary<ContentPageletEntryPoint>) => contentIncludes[includeId]
  );

export const getContentInclude = (includeId: string) =>
  createSelector(getContentIncludeMemoized(includeId), createContentPageletEntryPointView);
