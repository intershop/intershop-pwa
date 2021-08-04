import { createSelector, createSelectorFactory, resultMemoize } from '@ngrx/store';

import { getContentState } from 'ish-core/store/content/content-store';
import { isArrayEqual } from 'ish-core/utils/functions';

const getParametersState = createSelector(getContentState, state => state.parameters);

const getParametersProductLists = createSelector(getParametersState, parameters => parameters.productLists);

export const getParametersProductList = (id: string) =>
  createSelectorFactory<object, string[]>(projector => resultMemoize(projector, isArrayEqual))(
    getParametersProductLists,
    (productLists: { [id: string]: string[] }): string[] => productLists[id]
  );
