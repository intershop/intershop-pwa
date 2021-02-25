import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, map, take } from 'rxjs/operators';

import { whenTruthy } from 'ish-core/utils/operators';

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
import { getSelfServiceApiConfiguration, getTactonProductForSelectedProduct } from '../store/tacton-config';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class TactonFacade {
  constructor(private store: Store) {}

  loading$ = this.store.pipe(select(getProductConfigurationLoading));

  configureProduct$ = this.store.pipe(select(getCurrentProductConfiguration));

  configurationTree$ = this.store.pipe(select(getConfigurationStepTree));

  currentStep$ = this.store.pipe(select(getCurrentStepConfig));
  stepConfig$ = this.store.pipe(select(getConfigurationStepConfig));

  conflicts$ = this.store.pipe(select(getCurrentProductConfigurationConflicts));

  getImageUrl$(imgName: string): Observable<string> {
    return this.store.pipe(
      select(getSelfServiceApiConfiguration),
      whenTruthy(),
      map(({ apiKey, endPoint }) => `${endPoint}${imgName}${imgName.includes('?') ? '&' : '?'}_key=${apiKey}`)
    );
  }
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

  private internalCurrentGroup$ = new ReplaySubject<string>(1);
  currentGroup$ = this.internalCurrentGroup$.pipe(distinctUntilChanged());
  setCurrentGroup(name: string) {
    this.internalCurrentGroup$.next(name);
  }
}
