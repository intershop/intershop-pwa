import { createSelector } from '@ngrx/store';

import { createCategoryView } from '../../../models/category-view/category-view.model';
import { ShoppingState, getShoppingState } from '../shopping.state';

const getCategoryState = createSelector(getShoppingState, (state: ShoppingState) => state.categories);

/**
 * Retrieves the currently selected categoryUniqueId.
 * Be aware that it can have invalid values and it can change
 * so the referenced category might not yet be available.
 *
 * When in doubt prefere using getSelectedCategory.
 */
export const getSelectedCategoryId = createSelector(getCategoryState, state => state.selected);

const getCategoryTree = createSelector(getCategoryState, state => state.categories);

/**
 * Retrieve the {@link Dictionary} of {@link Category} entities.
 */
export const getCategoryEntities = createSelector(getCategoryTree, tree => tree.nodes);

export const getCategoryIds = createSelector(getCategoryTree, tree => Object.keys(tree.nodes));

/**
 * Retrieves the currently resolved selected category.
 */
export const getSelectedCategory = createSelector(getCategoryTree, getSelectedCategoryId, createCategoryView);

export const getCategoryLoading = createSelector(getCategoryState, categories => categories.loading);

export const getTopLevelCategories = createSelector(getCategoryTree, tree =>
  tree.rootIds.map(id => createCategoryView(tree, id))
);
