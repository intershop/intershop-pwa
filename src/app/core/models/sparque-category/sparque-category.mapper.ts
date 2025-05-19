import { Injectable } from '@angular/core';

import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { CategoryTreeHelper } from 'ish-core/models/category-tree/category-tree.helper';
import { CategoryTree } from 'ish-core/models/category-tree/category-tree.model';
import { Category, CategoryHelper } from 'ish-core/models/category/category.model';
import { SparqueImageMapper } from 'ish-core/models/sparque-image/sparque-image.mapper';

import { SparqueCategory, SparqueParentCategory } from './sparque-category.interface';

@Injectable({ providedIn: 'root' })
export class SparqueCategoryMapper {
  constructor(private sparqueImageMapper: SparqueImageMapper) {}

  fromSuggestionsData(categoriesData: SparqueCategory[]): { categoryIds: string[]; categoryTree: CategoryTree } {
    const categoryIds: string[] = [];
    let categoryTree = CategoryTreeHelper.empty();

    if (categoriesData?.length) {
      categoriesData.forEach(category => {
        const result = this.fromData(category);
        categoryTree = CategoryTreeHelper.merge(categoryTree, result.categoryTree);
        categoryIds.push(result.category.uniqueId);
      });
    }

    return { categoryIds, categoryTree };
  }

  private fromData(data: SparqueCategory): { category: Category; categoryTree: CategoryTree } {
    let parentCategory: Category = undefined;
    let categoryTree = CategoryTreeHelper.empty();
    let uniqueId = data.categoryID;

    const parentsData = AttributeHelper.getAttributeValueByAttributeName<SparqueParentCategory[]>(
      data?.attributes,
      'hasParent'
    );

    if (parentsData) {
      const result = this.mapHierarchyFromParentsData(parentsData?.[0]);
      parentCategory = result.parentCategory;
      categoryTree = result.categoryTree;
      uniqueId = parentCategory.uniqueId + CategoryHelper.uniqueIdSeparator + data.categoryID;
    }

    const category: Category = {
      uniqueId,
      name: data.categoryName,
      categoryRef: undefined, // categoryRef not available in Sparque data
      categoryPath: parentCategory ? [...parentCategory.categoryPath, uniqueId] : [uniqueId],
      description: AttributeHelper.getAttributeValueByAttributeName<string>(data.attributes, 'description'),
      images: [
        this.sparqueImageMapper.fromImageUrl(
          AttributeHelper.getAttributeValueByAttributeName(data.attributes, 'image')
        ),
      ],
      hasOnlineProducts: !!data.totalCount,
      productCount: data.totalCount,
      completenessLevel: 0,
    };

    return { category, categoryTree: CategoryTreeHelper.add(categoryTree, category) };
  }

  // recursively map the hierarchy of categories from the parent data
  private mapHierarchyFromParentsData(data: SparqueParentCategory): {
    parentCategory: Category;
    categoryTree: CategoryTree;
  } {
    let category: Category = undefined;
    let parentCategory: Category = undefined;
    let categoryTree = CategoryTreeHelper.empty();
    let uniqueId = data.identifier;

    if (data) {
      const parentsData = data.hasParent?.[0];

      if (parentsData) {
        // recursively map the parent categories
        const result = this.mapHierarchyFromParentsData(parentsData);
        parentCategory = result.parentCategory;
        categoryTree = result.categoryTree;
        uniqueId = parentCategory.uniqueId + CategoryHelper.uniqueIdSeparator + data.identifier;
      }

      category = {
        uniqueId,
        name: data.name['en-US'], // TODO: implement locale specific value access
        categoryRef: undefined, // categoryRef not available in Sparque data
        categoryPath: parentCategory ? [...parentCategory.categoryPath, uniqueId] : [uniqueId],
        description: undefined, // TODO: do we need a description for parent categories?
        images: [this.sparqueImageMapper.fromImageUrl(data.image)],
        hasOnlineProducts: true,
        completenessLevel: 0,
      };

      categoryTree = CategoryTreeHelper.add(categoryTree, category);
    }
    return { parentCategory: category, categoryTree };
  }
}
