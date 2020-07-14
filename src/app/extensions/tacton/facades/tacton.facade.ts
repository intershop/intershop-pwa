import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first, switchMap, switchMapTo, take, tap } from 'rxjs/operators';

import { whenTruthy } from 'ish-core/utils/operators';

import { TactonProductConfigurationParameter } from '../models/tacton-product-configuration/tacton-product-configuration.model';
import {
  commitTactonConfigurationValue,
  getConfigurationStepTree,
  getCurrentProductConfiguration,
  getCurrentStepConfig,
  getProductConfigurationLoading,
  startConfigureTactonProduct,
} from '../store/product-configuration';
import {
  getSelfServiceApiConfiguration,
  getTactonProductForSKU,
  getTactonProductForSelectedProduct,
} from '../store/tacton-config';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class TactonFacade {
  constructor(private store: Store) {}

  loading$ = this.store.pipe(select(getProductConfigurationLoading));

  getTactonProductForSKU$(sku$: Observable<string>) {
    return sku$.pipe(switchMap(sku => this.store.pipe(select(getTactonProductForSKU(sku)))));
  }

  configureProduct$() {
    return this.store.pipe(
      select(getSelfServiceApiConfiguration),
      whenTruthy(),
      first(),
      switchMap(() => this.store.pipe(select(getTactonProductForSelectedProduct), whenTruthy(), take(1))),
      tap(productPath => {
        this.store.dispatch(startConfigureTactonProduct({ productPath }));
      }),
      switchMapTo(this.store.pipe(select(getCurrentProductConfiguration)))
    );
  }

  configurationTree$ = this.store.pipe(select(getConfigurationStepTree));

  currentStep$ = this.store.pipe(select(getCurrentStepConfig));

  commitValue(parameter: TactonProductConfigurationParameter, value: string) {
    this.store.dispatch(commitTactonConfigurationValue({ valueId: parameter.name, value }));
  }
}
