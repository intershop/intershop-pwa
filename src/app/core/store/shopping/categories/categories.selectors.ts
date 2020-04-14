import { Dictionary } from '@ngrx/entity';
import { createSelector, createSelectorFactory, defaultMemoize } from '@ngrx/store';
import { isEqual } from 'lodash-es';

import { CategoryTree, CategoryTreeHelper } from 'ish-core/models/category-tree/category-tree.model';
import { CategoryView, createCategoryView } from 'ish-core/models/category-view/category-view.model';
import { Category, CategoryHelper } from 'ish-core/models/category/category.model';
import { NavigationCategory } from 'ish-core/models/navigation-category/navigation-category.model';
import { generateCategoryUrl } from 'ish-core/routing/category/category.route';
import { selectRouteParam } from 'ish-core/store/core/router';
import { ShoppingState, getShoppingState } from 'ish-core/store/shopping/shopping-store';

const getCategoriesState = createSelector(getShoppingState, (state: ShoppingState) => state.categories);

export const getCategoryTree = createSelector(getCategoriesState, state => state.categories);

/**
 * Retrieve the {@link Dictionary} of {@link Category} entities.
 */
export const getCategoryEntities = createSelector(getCategoryTree, tree => tree.nodes);

const getCategorySubTree = (uniqueId: string) =>
  createSelectorFactory(projector =>
    defaultMemoize(projector, CategoryTreeHelper.equals, CategoryTreeHelper.equals)
  )(getCategoryTree, (tree: CategoryTree) => CategoryTreeHelper.subTree(tree, uniqueId));

export const getCategory = (uniqueId: string) =>
  createSelectorFactory(projector => defaultMemoize(projector, CategoryTreeHelper.equals, isEqual))(
    getCategorySubTree(uniqueId),
    (tree: CategoryTree) => createCategoryView(tree, uniqueId)
  );

/**
 * Retrieves the currently resolved selected category.
 */
export const getSelectedCategory = createSelectorFactory(projector => defaultMemoize(projector, undefined, isEqual))(
  getCategoryTree,
  selectRouteParam('categoryUniqueId'),
  createCategoryView
);

export const getCategoryLoading = createSelector(getCategoriesState, categories => categories.loading);

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

function mapNavigationCategoryFromId(uniqueId: string): NavigationCategory {
  return {
    uniqueId,
    name: this.nodes[uniqueId].name,
    url: generateCategoryUrl(this.nodes[uniqueId]),
    hasChildren: !!this.edges[uniqueId]?.length,
  };
}

export const getNavigationCategories = (uniqueId: string) =>
  createSelectorFactory(projector => defaultMemoize(projector, CategoryTreeHelper.equals, isEqual))(
    getCategoryTree,
    (tree: CategoryTree): NavigationCategory[] => {
      if (!uniqueId) {
        return tree.rootIds.map(mapNavigationCategoryFromId.bind(tree));
      }
      const subTree = CategoryTreeHelper.subTree(tree, uniqueId);
      return subTree.edges[uniqueId] ? subTree.edges[uniqueId].map(mapNavigationCategoryFromId.bind(subTree)) : [];
    }
  );
