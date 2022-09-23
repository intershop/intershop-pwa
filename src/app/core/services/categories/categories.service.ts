import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { CategoryTree, CategoryTreeHelper } from 'ish-core/models/category-tree/category-tree.model';
import { CategoryData } from 'ish-core/models/category/category.interface';
import { CategoryMapper } from 'ish-core/models/category/category.mapper';
import { CategoryCompletenessLevel, CategoryHelper } from 'ish-core/models/category/category.model';
import { ApiService, unpackEnvelope } from 'ish-core/services/api/api.service';

/**
 * The Categories Service handles the interaction with the 'categories' REST API.
 */
@Injectable({ providedIn: 'root' })
export class CategoriesService {
  constructor(private apiService: ApiService, private categoryMapper: CategoryMapper) {}

  /**
   * Get the full Category data for the given unique category ID.
   *
   * @param categoryUniqueId  The unique category id for the category of interest (encodes the category path).
   * @returns                 The Category information.
   */
  getCategory(categoryUniqueId: string): Observable<CategoryTree> {
    if (!categoryUniqueId) {
      return throwError(() => new Error('getCategory() called without categoryUniqueId'));
    }

    return this.apiService
      .get<CategoryData>(`categories/${CategoryHelper.getCategoryPath(categoryUniqueId)}`, { sendSPGID: true })
      .pipe(
        map(element => this.categoryMapper.fromData(element)),
        // bump up completeness level as it won't get any better than this
        tap(
          tree =>
            (tree.nodes[tree.categoryRefs[categoryUniqueId] ?? categoryUniqueId].completenessLevel =
              CategoryCompletenessLevel.Max)
        )
      );
  }

  /**
   * Get the sorted top level categories (e.g. for main navigation creation) with sorted sub categories up to the given depth.
   *
   * @param limit  The number of levels to be returned (depth) in hierarchical view.
   * @returns      A Sorted list of top level categories with sub categories.
   */
  getTopLevelCategories(limit: number): Observable<CategoryTree> {
    return this.apiService.get('categories', { sendSPGID: true, params: this.setTreeParams(limit) }).pipe(
      unpackEnvelope<CategoryData>(),
      map(categoriesData =>
        categoriesData
          .map(element => this.categoryMapper.fromData(element))
          .reduce((a, b) => CategoryTreeHelper.merge(a, b), CategoryTreeHelper.empty())
      )
    );
  }

  /**
   * Get the category tree data for a given categoryRef up to the given depth limit.
   * If no limit is given or the limit is 0 the simple category detail REST call is made.
   *
   * @param categoryRef  The categoryRef for the category of interest
   * @param depth        The number of depth levels to be returned in a hierarchical structure.
   * @returns            A category tree for the given category ref.
   */
  getCategoryTree(categoryRef: string, depth?: number): Observable<CategoryTree> {
    if (!categoryRef) {
      return throwError(() => new Error('getCategoryTree() called without categoryRef'));
    }
    return this.apiService
      .get<CategoryData>(`categories/${categoryRef}`, { sendSPGID: true, params: this.setTreeParams(depth) })
      .pipe(map(categoryData => this.categoryMapper.fromData(categoryData)));
  }

  /**
   * Set the necessary parameters for a REST call that should return a categories tree for the given depth.
   * Http params for a tree REST call are only needed if a depth > 0 is set.
   */
  private setTreeParams(depth?: number): HttpParams {
    let params = new HttpParams();
    if (depth > 0) {
      params = params
        .set('view', 'tree')
        .set('limit', depth.toString())
        .set('omitHasOnlineProducts', 'true')
        .set('imageView', 'NO-IMAGE');
    }
    return params;
  }
}
