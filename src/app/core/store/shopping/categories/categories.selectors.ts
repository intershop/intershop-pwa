import { Dictionary } from '@ngrx/entity';
import { createSelector, createSelectorFactory, defaultMemoize, resultMemoize } from '@ngrx/store';
import { isEqual } from 'lodash-es';

import { BreadcrumbItem } from 'ish-core/models/breadcrumb-item/breadcrumb-item.interface';
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
  createSelectorFactory<object, CategoryTree>(projector =>
    defaultMemoize(projector, CategoryTreeHelper.equals, CategoryTreeHelper.equals)
  )(getCategoryTree, (tree: CategoryTree) => CategoryTreeHelper.subTree(tree, uniqueId));

export const getCategory = (uniqueId: string) =>
  createSelectorFactory<object, CategoryView>(projector =>
    defaultMemoize(projector, CategoryTreeHelper.equals, isEqual)
  )(getCategorySubTree(uniqueId), (tree: CategoryTree) => createCategoryView(tree, uniqueId));

/**
 * Retrieves the currently resolved selected category.
 */
export const getSelectedCategory = createSelectorFactory<object, CategoryView>(projector =>
  resultMemoize(projector, isEqual)
)(getCategoryTree, selectRouteParam('categoryUniqueId'), createCategoryView);

export const getBreadcrumbForCategoryPage = createSelectorFactory<object, BreadcrumbItem[]>(projector =>
  resultMemoize(projector, isEqual)
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
  createSelectorFactory<object, NavigationCategory[]>(projector =>
    defaultMemoize(projector, CategoryTreeHelper.equals, isEqual)
  )(getCategoryTree, (tree: CategoryTree): NavigationCategory[] => {
    if (!uniqueId) {
      return tree.rootIds.map(mapNavigationCategoryFromId.bind(tree));
    }
    const subTree = CategoryTreeHelper.subTree(tree, uniqueId);
    return subTree.edges[uniqueId] ? subTree.edges[uniqueId].map(mapNavigationCategoryFromId.bind(subTree)) : [];
  });
