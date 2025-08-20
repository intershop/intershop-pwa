import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CategoryTree } from 'ish-core/models/category-tree/category-tree.model';
import { CategoryHelper } from 'ish-core/models/category/category.helper';
import { SparqueCategory } from 'ish-core/models/sparque-category/sparque-category.interface';
import { SparqueCategoryMapper } from 'ish-core/models/sparque-category/sparque-category.mapper';
import { CategoriesServiceInterface } from 'ish-core/service-provider/categories.service-provider';
import { unpackEnvelope } from 'ish-core/services/api/api.service';
import { SparqueApiService } from 'ish-core/services/sparque-api/sparque-api.service';

/**
 * Service for interacting with the Sparque API to handle categories operations.
 * Provides methods to fetch category trees from the Sparque wrapper API.
 */
@Injectable({ providedIn: 'root' })
export class SparqueCategoriesService implements CategoriesServiceInterface {
  // API version for Sparque API
  private readonly apiVersion = 'v3';

  constructor(private sparqueApiService: SparqueApiService, private sparqueCategoryMapper: SparqueCategoryMapper) {}

  /**
   * Get the sorted top level categories (e.g. for main navigation creation) with sorted sub categories up to the given depth.
   *
   * @param limit  The number of levels to be returned (depth) in hierarchical view.
   * @returns      A Sorted list of top level categories with sub categories.
   */
  getTopLevelCategories(limit: number): Observable<CategoryTree> {
    let params = new HttpParams();

    if (limit > 0) {
      params = params.set('Levels', limit.toString());
    }

    return this.sparqueApiService
      .get<SparqueCategory[]>('categorytree', this.apiVersion, { params, skipApiErrorHandling: true })
      .pipe(
        unpackEnvelope<SparqueCategory>('categories'),
        map(categories => this.sparqueCategoryMapper.fromCategoryTreeData(categories || []))
      );
  }

  /**
   * Get a category tree for a specific category with its subcategories.
   *
   * @param categoryUniqueId  The unique identifier of the category to retrieve.
   * @returns                 A category tree containing the specified category and its subcategories.
   */
  getCategory(categoryUniqueId: string): Observable<CategoryTree> {
    const params = new HttpParams()
      .set('EntryCategoryId', CategoryHelper.getCategoryID(categoryUniqueId))
      .set('Levels', categoryUniqueId.split(CategoryHelper.uniqueIdSeparator).length.toString());

    return this.sparqueApiService
      .get<SparqueCategory[]>('categorytree', this.apiVersion, { params, skipApiErrorHandling: true })
      .pipe(
        unpackEnvelope<SparqueCategory>('categories'),
        map(categories =>
          this.sparqueCategoryMapper.fromCategoryTreeData(categories || [], this.getCategoryPath(categoryUniqueId))
        )
      );
  }

  private getCategoryPath(categoryUniqueId: string): string[] {
    const path = [];
    const splittedCategoryId = categoryUniqueId.split(CategoryHelper.uniqueIdSeparator);

    if (splittedCategoryId.length > 0) {
      let currentPath = splittedCategoryId[0];
      path.push(currentPath);

      for (let i = 1; i < splittedCategoryId.length; i++) {
        currentPath = `${currentPath}.${splittedCategoryId[i]}`;
        path.push(currentPath);
      }
    }

    return path;
  }
}
