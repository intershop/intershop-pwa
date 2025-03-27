import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { take } from 'rxjs';

import { CategoriesService } from 'ish-core/services/categories/categories.service';
import { NavigationService } from 'ish-core/services/navigation/navigation.service';
import { SparqueNavigationService } from 'ish-core/services/sparque-navigation/sparque-navigation.service';
import { getSparqueConfig } from 'ish-core/store/core/configuration';

@Injectable({ providedIn: 'root' })
export class NavigationServiceProvider {
  constructor(
    private categoriesService: CategoriesService,
    private sparqueNavigationService: SparqueNavigationService,
    private store: Store
  ) {}

  /**
   * Gets the appropriate navigation service based on the store configuration.
   *
   * @returns An instance of either SparqueNavigationService or CategoriesService.
   */
  get(): NavigationService {
    let isSparque = false;
    this.store
      .pipe(select(getSparqueConfig), take(1))
      .subscribe(state => (state ? (isSparque = true) : (isSparque = false)));
    return isSparque ? this.sparqueNavigationService : this.categoriesService;
  }
}
