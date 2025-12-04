import { Injectable, inject } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, switchMap } from 'rxjs';

import { toObservable } from 'ish-core/utils/functions';
import { ModuleLoaderService } from 'ish-core/utils/module-loader/module-loader.service';

import {
  addToCompare,
  compareProducts,
  getCompareProductsCount,
  getCompareProductsSKUs,
  isInCompareProducts,
  removeFromCompare,
  toggleCompare,
} from '../store/compare';

@Injectable({ providedIn: 'root' })
export class CompareFacade {
  private moduleLoader = inject(ModuleLoaderService);

  constructor(private store: Store) {}

  compareProducts$ = this.moduleLoader.whenLoaded('compare', () => this.store.pipe(select(getCompareProductsSKUs)));
  compareProductsCount$ = this.moduleLoader.whenLoaded('compare', () =>
    this.store.pipe(select(getCompareProductsCount))
  );

  inCompareProducts$(sku: Observable<string> | string) {
    return toObservable(sku).pipe(
      switchMap(plainSKU =>
        this.moduleLoader.whenLoaded('compare', () => this.store.pipe(select(isInCompareProducts(plainSKU))))
      )
    );
  }

  addProductToCompare(sku: string) {
    void this.moduleLoader.ensureLoaded('compare').then(() => this.store.dispatch(addToCompare({ sku })));
  }

  toggleProductCompare(sku: string) {
    void this.moduleLoader.ensureLoaded('compare').then(() => this.store.dispatch(toggleCompare({ sku })));
  }

  removeProductFromCompare(sku: string) {
    void this.moduleLoader.ensureLoaded('compare').then(() => this.store.dispatch(removeFromCompare({ sku })));
  }

  compareProducts(skus: string[]) {
    void this.moduleLoader.ensureLoaded('compare').then(() => this.store.dispatch(compareProducts({ skus })));
  }
}
