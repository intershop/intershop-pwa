import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, switchMap } from 'rxjs';

import { toObservable } from 'ish-core/utils/functions';

import {
  addToCompare,
  getCompareProductsCount,
  getCompareProductsSKUs,
  isInCompareProducts,
  removeFromCompare,
  toggleCompare,
} from '../store/compare';

/* eslint-disable @typescript-eslint/member-ordering */
@Injectable({ providedIn: 'root' })
export class CompareFacade {
  constructor(private store: Store) {}

  compareProducts$ = this.store.pipe(select(getCompareProductsSKUs));
  compareProductsCount$ = this.store.pipe(select(getCompareProductsCount));

  inCompareProducts$(sku: string | Observable<string>) {
    return toObservable(sku).pipe(switchMap(plainSKU => this.store.pipe(select(isInCompareProducts(plainSKU)))));
  }

  addProductToCompare(sku: string) {
    this.store.dispatch(addToCompare({ sku }));
  }

  toggleProductCompare(sku: string) {
    this.store.dispatch(toggleCompare({ sku }));
  }

  removeProductFromCompare(sku: string) {
    this.store.dispatch(removeFromCompare({ sku }));
  }
}
