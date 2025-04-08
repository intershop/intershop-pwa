import { Injectable } from '@angular/core';

import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { CategoryTree, CategoryTreeHelper } from 'ish-core/models/category-tree/category-tree.model';
import { Category } from 'ish-core/models/category/category.model';
import { SparqueImageMapper } from 'ish-core/models/sparque-image/sparque-image.mapper';

import { SparqueCategory, SparqueCategoryTree } from './sparque-category.interface';

// not-dead-code
@Injectable({ providedIn: 'root' })
export class SparqueCategoryMapper {
  constructor(private sparqueImageMapper: SparqueImageMapper) {}
  private path: { [key: string]: string[] } = {};

  // not-dead-code
  fromData(treeData: SparqueCategoryTree): CategoryTree {
    if (!treeData?.categories) {
      return CategoryTreeHelper.empty();
    }
    const allCategories = this.flatCategories(treeData.categories);
    allCategories.forEach(category => {
      let path = [category.categoryID];
      if (category.parentCategoryId) {
        path = [...this.path[category.parentCategoryId], ...path];
      }
      this.path[category.categoryID] = path;
    });

    return allCategories.reduce((acc, category) => {
      const categoryTree = this.fromCategoryData(category);

      acc.rootIds = [...acc.rootIds, ...categoryTree.rootIds];
      acc.nodes = { ...acc.nodes, ...categoryTree.nodes };
      acc.edges =
        categoryTree.edges && categoryTree.edges[category.categoryID]?.length > 0
          ? { ...acc.edges, ...categoryTree.edges }
          : acc.edges;
      acc.categoryRefs = { ...acc.categoryRefs, ...categoryTree.categoryRefs };
      return acc;
    }, CategoryTreeHelper.empty());
  }

  private fromCategoryData(categoryData: SparqueCategory): CategoryTree {
    const category = this.mapData(categoryData);
    return {
      rootIds: categoryData.deep === 0 ? [category.uniqueId] : [],
      nodes: { [category.uniqueId]: category },
      edges: categoryData.subCategories
        ? {
            [category.uniqueId]: categoryData.subCategories.map(sub => this.createUniqueId(this.path[sub.categoryID])),
          }
        : {},
      categoryRefs: { [category.categoryRef]: category.uniqueId },
    };
  }

  private mapData(categoryData: SparqueCategory): Category {
    if (categoryData) {
      const categoryPath = this.path[categoryData.categoryID];
      const uniqueId = this.createUniqueId(categoryPath);

      return {
        uniqueId,
        categoryRef: categoryData.categoryID,
        categoryPath,
        name: categoryData.categoryName,
        hasOnlineProducts: AttributeHelper.getAttributeValueByAttributeName(categoryData.attributes, 'online')
          ? AttributeHelper.getAttributeValueByAttributeName(categoryData.attributes, 'online') === '1'
          : false,
        productCount: categoryData.totalCount,
        description: AttributeHelper.getAttributeValueByAttributeName(categoryData.attributes, 'description'),
        images: categoryData.attributes ? this.sparqueImageMapper.mapCategoryImage(categoryData.attributes) : [],
        attributes: categoryData.attributes,
        completenessLevel: this.computeCompleteness(categoryData, categoryPath.length),
      };
    } else {
      throw new Error(`'categoryData' is required`);
    }
  }

  private createUniqueId(path: string[]): string {
    return path.length > 1 ? path[path.length - 2].concat('.').concat(path[path.length - 1]) : path[0];
  }

  private flatCategories(
    treeData: SparqueCategory[],
    result: SparqueCategory[] = [],
    deep: number = 0
  ): SparqueCategory[] {
    treeData.forEach(category => {
      category.deep = deep;
      result.push(category);
      if (category.subCategories?.length) {
        this.flatCategories(category.subCategories, result, deep + 1);
      }
    });

    return result.sort((a, b) => a.deep - b.deep);
  }

  /**
   * Compute completeness level of incoming raw data.
   */
  private computeCompleteness(categoryData: SparqueCategory, pathLength: number): number {
    if (!categoryData) {
      return -1;
    }

    // adjust CategoryCompletenessLevel.Max accordingly
    let count = 0;

    if (pathLength > 0) {
      // root categories have no images but a single-entry categoryPath
      count++;
    }
    if (categoryData.attributes?.find(attr => attr.name === 'image')) {
      // images are supplied for sub categories in the category details call
      count++;
    }
    if (categoryData.categoryName) {
      count++;
    }
    if (categoryData.attributes?.find(attr => attr.name === 'description')) {
      count++;
    }

    return count;
  }
}
