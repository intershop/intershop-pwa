import { createSelector } from '@ngrx/store';

import { ContentState, getContentState } from '../content.state';

import { includesAdapter } from './includes.reducer';

const getIncludesState = createSelector(getContentState, (state: ContentState) => state.includes);

const { selectEntities: getContentIncludeEntities } = includesAdapter.getSelectors(getIncludesState);

// TODO: maybe use a factory for memoization (https://blog.angularindepth.com/ngrx-parameterized-selector-e3f610529f8)
export const getContentInclude = createSelector(
  getContentIncludeEntities,
  (contentIncludes, props) => contentIncludes[props.includeId]
);
