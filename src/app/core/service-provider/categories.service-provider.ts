import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, map, take } from 'rxjs';

import { CategoryTree } from 'ish-core/models/category-tree/category-tree.model';
import { SPARQUE_FEATURES, SparqueConfig } from 'ish-core/models/sparque/sparque-config.model';
import { CategoriesService } from 'ish-core/services/categories/categories.service';
import { SparqueCategoriesService } from 'ish-core/services/sparque-categories/sparque-categories.service';
import { getSparqueConfig } from 'ish-core/store/core/configuration';

@Injectable({ providedIn: 'root' })
export class CategoriesServiceProvider {
  constructor(
    private categoriesService: CategoriesService,
    private sparqueCategoriesService: SparqueCategoriesService,
    private store: Store
  ) {}

  /**
   * Gets the appropriate categories service based on the store configuration.
   *
   * @returns An observable emitting either SparqueCategoriesService or CategoriesService.
   */
  get(): Observable<CategoriesServiceInterface> {
    return this.store.pipe(
      select(getSparqueConfig),
      take(1),
      map(sparqueConfig =>
        this.isSparqueNavigationEnabled(sparqueConfig) ? this.sparqueCategoriesService : this.categoriesService
      )
    );
  }

  private isSparqueNavigationEnabled(config: SparqueConfig | undefined): boolean {
    return config && Array.isArray(config.features) && config?.features?.includes(SPARQUE_FEATURES.CATEGORY);
  }
}

/**
 * Service interface for handling categories-related operations.
 * This abstract class provides methods for retrieving top level categories.
 * Implementations of this service should define the behavior for these category functionalities.
 */
export interface CategoriesServiceInterface {
  /**
   * Get the sorted top level categories (e.g. for main navigation creation) with sorted sub categories up to the given depth.
   *
   * @param limit  The number of levels to be returned (depth) in hierarchical view.
   * @returns      A Sorted list of top level categories with sub categories.
   */
  getTopLevelCategories(limit: number): Observable<CategoryTree>;

  /**
   * Get a category tree for a specific category with its subcategories.
   *
   * @param categoryUniqueId  The unique identifier of the category to retrieve.
   * @returns                 A category tree containing the specified category and its subcategories.
   */
  getCategory(categoryUniqueId: string): Observable<CategoryTree>;
}
