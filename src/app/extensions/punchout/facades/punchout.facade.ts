import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { selectRouteParam } from 'ish-core/store/core/router';
import { decamelizeString } from 'ish-core/utils/functions';
import { whenTruthy } from 'ish-core/utils/operators';

import { OciConfigurationItem } from '../models/oci-configuration-item/oci-configuration-item.model';
import { PunchoutType, PunchoutUser } from '../models/punchout-user/punchout-user.model';
import {
  getOciConfiguration,
  getOciConfigurationError,
  getOciConfigurationLoading,
  getOciFormatters,
  getOciPlaceholders,
  ociConfigurationActions,
} from '../store/oci-configuration';
import { transferPunchoutBasket } from '../store/punchout-functions';
import { getPunchoutTypes, getPunchoutTypesError, getPunchoutTypesLoading } from '../store/punchout-types';
import {
  addPunchoutUser,
  deletePunchoutUser,
  getPunchoutError,
  getPunchoutLoading,
  getPunchoutUsers,
  getSelectedPunchoutUser,
  updatePunchoutUser,
} from '../store/punchout-users';

/* eslint-disable @typescript-eslint/member-ordering */
@Injectable({ providedIn: 'root' })
export class PunchoutFacade {
  constructor(private store: Store) {}

  punchoutLoading$ = combineLatest([
    this.store.pipe(select(getPunchoutLoading)),
    this.store.pipe(select(getPunchoutTypesLoading)),
  ]).pipe(map(([loading, typesLoading]) => loading || (typesLoading as boolean)));

  punchoutError$ = this.store.pipe(select(getPunchoutError));
  punchoutTypesError$: Observable<HttpError> = this.store.pipe(select(getPunchoutTypesError));
  supportedPunchoutTypes$: Observable<PunchoutType[]> = this.store.pipe(select(getPunchoutTypes));

  selectedPunchoutType$ = combineLatest([
    this.store.pipe(select(selectRouteParam('format'))),
    this.store.pipe(select(getPunchoutTypes)),
  ]).pipe(
    filter(([format, types]) => !!format || types?.length > 0),
    map(([format, types]) => (format as PunchoutType) || types[0]),
    distinctUntilChanged()
  );

  punchoutUsersByRoute$() {
    return this.selectedPunchoutType$.pipe(
      whenTruthy(),
      switchMap(type => this.store.pipe(select(getPunchoutUsers(type))))
    );
  }

  selectedPunchoutUser$ = this.store.pipe(select(getSelectedPunchoutUser));

  addPunchoutUser(user: PunchoutUser) {
    this.store.dispatch(addPunchoutUser({ user }));
  }

  updatePunchoutUser(user: PunchoutUser) {
    this.store.dispatch(updatePunchoutUser({ user }));
  }

  deletePunchoutUser(user: PunchoutUser) {
    this.store.dispatch(deletePunchoutUser({ user }));
  }

  transferBasket() {
    this.store.dispatch(transferPunchoutBasket());
  }

  ociConfiguration$() {
    this.store.dispatch(ociConfigurationActions.loadOCIOptionsAndConfiguration());
    return this.store.pipe(select(getOciConfiguration));
  }
  ociConfigurationLoading$ = this.store.pipe(select(getOciConfigurationLoading));
  ociConfigurationError$ = this.store.pipe(select(getOciConfigurationError));
  ociFormatterSelectOptions$ = this.store.pipe(
    select(getOciFormatters),
    whenTruthy(),
    map(formatters => formatters.map(f => ({ label: decamelizeString(f), value: f }))),
    map(options => {
      options.push({
        value: '',
        label: 'account.punchout.configuration.option.none.label',
      });
      return options;
    })
  );
  ociPlaceholders$ = this.store.pipe(select(getOciPlaceholders));

  updateOciConfiguration(configuration: OciConfigurationItem[]) {
    this.store.dispatch(ociConfigurationActions.updateOCIConfiguration({ configuration }));
  }
}
