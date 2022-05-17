import { createSelector, createSelectorFactory, defaultMemoize, resultMemoize } from '@ngrx/store';
import { isEqual } from 'lodash-es';

import { BreadcrumbItem } from 'ish-core/models/breadcrumb-item/breadcrumb-item.interface';
import { CategoryTree, CategoryTreeHelper } from 'ish-core/models/category-tree/category-tree.model';
import { CategoryView, createCategoryView } from 'ish-core/models/category-view/category-view.model';
import { CategoryHelper } from 'ish-core/models/category/category.model';
import { NavigationCategory } from 'ish-core/models/navigation-category/navigation-category.model';
import { generateCategoryUrl } from 'ish-core/routing/category/category.route';
import { selectRouteParamAorB } from 'ish-core/store/core/router';
import { ShoppingState, getShoppingState } from 'ish-core/store/shopping/shopping-store';

const getCategoriesState = createSelector(getShoppingState, (state: ShoppingState) => state.categories);

export const getCategoryTree = createSelector(getCategoriesState, state => state.categories);

/**
 * Retrieve the {@link Dictionary} of {@link Category} entities.
 */
export const getCategoryEntities = createSelector(getCategoryTree, tree => tree.nodes);

export const getCategoryRefs = createSelector(getCategoryTree, tree => tree.categoryRefs);

export const getCategory = (uniqueId: string) =>
  createSelectorFactory<object, CategoryView>(projector =>
    defaultMemoize(projector, CategoryTreeHelper.equals, isEqual)
  )(getCategoryTree, (tree: CategoryTree) => createCategoryView(tree, uniqueId));

export const getCategoryIdByRefId = (categoryRefId: string) =>
  createSelectorFactory<object, string>(projector => defaultMemoize(projector, isEqual))(
    getCategoryRefs,
    (refs: { [id: string]: string }) => refs[categoryRefId]
  );

/**
 * Retrieves the currently resolved selected category.
 */
export const getSelectedCategory = createSelectorFactory<object, CategoryView>(projector =>
  resultMemoize(projector, isEqual)
)(getCategoryTree, selectRouteParamAorB('categoryUniqueId', 'categoryRefId'), createCategoryView);

export const getBreadcrumbForCategoryPage = createSelectorFactory<object, BreadcrumbItem[]>(projector =>
  resultMemoize(projector, isEqual)
)(getSelectedCategory, getCategoryTree, (category: CategoryView, tree: CategoryTree) =>
  CategoryHelper.isCategoryCompletelyLoaded(category)
    ? (category.categoryPath || [])
        .map(id => createCategoryView(tree, id))
        .filter(x => !!x)
        .map((cat, idx, arr) => ({
          text: cat.name,
          link: idx === arr.length - 1 ? undefined : generateCategoryUrl(cat),
        }))
    : undefined
);

function mapNavigationCategoryFromId(uniqueId: string, tree: CategoryTree, subTree?: CategoryTree): NavigationCategory {
  const selected = subTree || tree;
  return {
    uniqueId,
    name: selected.nodes[uniqueId].name,
    url: generateCategoryUrl(createCategoryView(tree, uniqueId)),
    hasChildren: !!selected?.edges[uniqueId]?.length,
  };
}

export const getNavigationCategories = (uniqueId: string) =>
  createSelectorFactory<object, NavigationCategory[]>(projector =>
    defaultMemoize(projector, CategoryTreeHelper.equals, isEqual)
  )(getCategoryTree, (tree: CategoryTree): NavigationCategory[] => {
    if (!uniqueId) {
      return tree.rootIds.map(id => mapNavigationCategoryFromId(id, tree));
    }
    const subTree = CategoryTreeHelper.subTree(tree, uniqueId);
    return subTree.edges[uniqueId]
      ? subTree.edges[uniqueId].map(id => mapNavigationCategoryFromId(id, tree, subTree))
      : [];
  });
