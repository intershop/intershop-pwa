import { Injectable, inject } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { CategoryTree } from 'ish-core/models/category-tree/category-tree.model';
import { SparqueResponse } from 'ish-core/models/sparque/sparque.interface';
import { SparqueMapper } from 'ish-core/models/sparque/sparque.mapper';
import { CategoriesService } from 'ish-core/services/categories/categories.service';
import { SparqueApiService } from 'ish-core/services/sparque/sparque-api/sparque-api.service';
import { getCurrentLocale } from 'ish-core/store/core/configuration';

/**
 * The Sparque Categories Service handles the interaction with the sparque 'categories' REST API.
 */
@Injectable({ providedIn: 'root' })
export class SparqueCategoriesService extends CategoriesService {
  private sparqueApiService = inject(SparqueApiService);
  private store = inject(Store);

  getTopLevelCategories(_limit: number): Observable<CategoryTree> {
    return this.sparqueApiService.get<SparqueResponse>('e/categorytree/results?count=200').pipe(
      switchMap(categoriesData =>
        this.store.pipe(
          select(getCurrentLocale),
          map(locale => SparqueMapper.fromCategoriesData(categoriesData, locale))
        )
      )
    );
  }
}
