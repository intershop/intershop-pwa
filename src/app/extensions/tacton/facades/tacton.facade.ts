import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { TactonProductConfigurationParameter } from '../models/tacton-product-configuration/tacton-product-configuration.model';
import {
  commitTactonConfigurationValue,
  getConfigurationStepTree,
  getCurrentProductConfiguration,
  getCurrentStepConfig,
  getProductConfigurationLoading,
} from '../store/product-configuration';
import {
  getSelfServiceApiConfiguration,
  getTactonProductForSKU,
  isGroupLevelNavigationEnabled,
} from '../store/tacton-config';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class TactonFacade {
  constructor(private store: Store) {}

  loading$ = this.store.pipe(select(getProductConfigurationLoading));
  selfServiceApiConfiguration$ = this.store.pipe(select(getSelfServiceApiConfiguration));

  getTactonProductForSKU$(sku$: Observable<string>) {
    return sku$.pipe(switchMap(sku => this.store.pipe(select(getTactonProductForSKU(sku)))));
  }

  configureProduct$ = this.store.pipe(select(getCurrentProductConfiguration));

  configurationTree$ = this.store.pipe(select(getConfigurationStepTree));

  currentStep$ = this.store.pipe(select(getCurrentStepConfig));

  groupLevelNavigationEnabled$ = this.store.pipe(select(isGroupLevelNavigationEnabled));

  commitValue(parameter: TactonProductConfigurationParameter, value: string) {
    this.store.dispatch(commitTactonConfigurationValue({ valueId: parameter.name, value }));
  }
}
