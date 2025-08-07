import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CategoryTree } from 'ish-core/models/category-tree/category-tree.model';
import { SparqueCategoryTreeResponse } from 'ish-core/models/sparque-category-tree/sparque-category-tree.interface';
import { SparqueCategoryTreeMapper } from 'ish-core/models/sparque-category-tree/sparque-category-tree.mapper';
import { CategoriesServiceInterface } from 'ish-core/service-provider/categories.service-provider';
import { SparqueApiService } from 'ish-core/services/sparque-api/sparque-api.service';

/**
 * Service for interacting with the Sparque API to handle categories operations.
 * Provides methods to fetch category trees from the Sparque wrapper API.
 */
@Injectable({ providedIn: 'root' })
export class SparqueCategoriesService implements CategoriesServiceInterface {
  // API version for Sparque API
  private readonly apiVersion = 'v3';

  constructor(
    private sparqueApiService: SparqueApiService,
    private sparqueCategoryTreeMapper: SparqueCategoryTreeMapper
  ) {}

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
      .get<SparqueCategoryTreeResponse>('categorytree', this.apiVersion, { params, skipApiErrorHandling: true })
      .pipe(map(result => this.sparqueCategoryTreeMapper.fromData(result)));
  }
}
