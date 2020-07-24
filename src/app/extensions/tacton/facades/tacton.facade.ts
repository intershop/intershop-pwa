import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { TactonProductConfigurationParameter } from '../models/tacton-product-configuration/tacton-product-configuration.model';
import {
  acceptTactonConfigurationConflictResolution,
  changeTactonConfigurationStep,
  commitTactonConfigurationValue,
  getConfigurationStepConfig,
  getConfigurationStepTree,
  getCurrentProductConfiguration,
  getCurrentProductConfigurationConflicts,
  getCurrentStepConfig,
  getProductConfigurationLoading,
  startConfigureTactonProduct,
  submitTactonConfiguration,
  uncommitTactonConfigurationValue,
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
  selfServiceApiConfiguration$ = this.store.pipe(select(getSelfServiceApiConfiguration));

  getTactonProductForSKU$(sku$: Observable<string>) {
    return sku$.pipe(switchMap(sku => this.store.pipe(select(getTactonProductForSKU(sku)))));
  }

  configureProduct$ = this.store.pipe(select(getCurrentProductConfiguration));

  configurationTree$ = this.store.pipe(select(getConfigurationStepTree));

  currentStep$ = this.store.pipe(select(getCurrentStepConfig));
  stepConfig$ = this.store.pipe(select(getConfigurationStepConfig));

  conflicts$ = this.store.pipe(select(getCurrentProductConfigurationConflicts));

  changeConfigurationStep(step: string) {
    this.store.dispatch(changeTactonConfigurationStep({ step }));
  }

  commitValue(parameter: TactonProductConfigurationParameter, value: string) {
    this.store.dispatch(commitTactonConfigurationValue({ valueId: parameter.name, value }));
  }
  uncommitValue(parameter: TactonProductConfigurationParameter) {
    this.store.dispatch(uncommitTactonConfigurationValue({ valueId: parameter.name }));
  }
  acceptConflictResolution() {
    this.store.dispatch(acceptTactonConfigurationConflictResolution());
  }

  resetConfiguration() {
    this.store
      .pipe(select(getTactonProductForSelectedProduct), take(1))
      .subscribe(productPath => this.store.dispatch(startConfigureTactonProduct({ productPath })));
  }

  submitConfiguration() {
    this.store.dispatch(submitTactonConfiguration());
  }
}
