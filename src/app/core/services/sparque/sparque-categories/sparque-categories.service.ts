import { Injectable, inject } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { CategoryTree } from 'ish-core/models/category-tree/category-tree.model';
import { SparqueCategoriesMapper } from 'ish-core/models/sparque-categories/sparque-categories.mapper';
import { SparqueResponse } from 'ish-core/models/sparque/sparque.interface';
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
    return this.sparqueApiService
      .get<SparqueResponse>('api/v2/categorytree?WorkspaceName=intershop-obi&ApiName=PWA&Locale=en-US')
      .pipe(
        switchMap(categoriesData =>
          this.store.pipe(
            select(getCurrentLocale),
            map(locale => SparqueCategoriesMapper.fromData(categoriesData, locale))
          )
        )
      );
  }
}
