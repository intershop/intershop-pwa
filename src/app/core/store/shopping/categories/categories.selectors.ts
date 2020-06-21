import { Dictionary } from '@ngrx/entity';
import { createSelector, createSelectorFactory, defaultMemoize } from '@ngrx/store';
import { isEqual } from 'lodash-es';

import { CategoryView, createCategoryView } from 'ish-core/models/category-view/category-view.model';
import { Category, CategoryHelper } from 'ish-core/models/category/category.model';
import { generateCategoryUrl } from 'ish-core/routing/category/category.route';
import { selectRouteParam } from 'ish-core/store/core/router';
import { ShoppingState, getShoppingState } from 'ish-core/store/shopping/shopping-store';

const getCategoriesState = createSelector(getShoppingState, (state: ShoppingState) => state.categories);

export const getCategoryTree = createSelector(getCategoriesState, state => state.categories);

/**
 * Retrieve the {@link Dictionary} of {@link Category} entities.
 */
export const getCategoryEntities = createSelector(getCategoryTree, tree => tree.nodes);

/**
 * Retrieves the currently resolved selected category.
 */
export const getSelectedCategory = createSelector(
  getCategoryTree,
  selectRouteParam('categoryUniqueId'),
  createCategoryView
);

export const getCategoryLoading = createSelector(getCategoriesState, categories => categories.loading);

export const getTopLevelCategories = createSelector(getCategoryTree, tree =>
  tree.rootIds.map(id => createCategoryView(tree, id))
);

export const isTopLevelCategoriesLoaded = createSelector(getCategoriesState, state => state.topLevelLoaded);

export const getBreadcrumbForCategoryPage = createSelectorFactory(projector =>
  defaultMemoize(projector, undefined, isEqual)
)(getSelectedCategory, getCategoryEntities, (category: CategoryView, entities: Dictionary<Category>) =>
  CategoryHelper.isCategoryCompletelyLoaded(category)
    ? (category.categoryPath || [])
        .map(id => entities[id])
        .filter(x => !!x)
        .map((cat, idx, arr) => ({
          text: cat.name,
          link: idx === arr.length - 1 ? undefined : generateCategoryUrl(cat),
        }))
    : undefined
);
