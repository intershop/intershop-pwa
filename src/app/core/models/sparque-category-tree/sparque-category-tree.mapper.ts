import { Injectable } from '@angular/core';

import { CategoryTree, CategoryTreeHelper } from 'ish-core/models/category-tree/category-tree.model';
import { SparqueCategoryMapper } from 'ish-core/models/sparque-category/sparque-category.mapper';

import { SparqueCategoryTreeResponse } from './sparque-category-tree.interface';

@Injectable({ providedIn: 'root' })
export class SparqueCategoryTreeMapper {
  constructor(private sparqueCategoryMapper: SparqueCategoryMapper) {}

  fromData(data: SparqueCategoryTreeResponse): CategoryTree {
    if (!data?.categories?.length) {
      return CategoryTreeHelper.empty();
    }

    return this.sparqueCategoryMapper.fromCategoryTreeData(data.categories);
  }
}
