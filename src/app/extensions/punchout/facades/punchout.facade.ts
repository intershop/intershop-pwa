import { Injectable, inject } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { selectQueryParam } from 'ish-core/store/core/router';
import { decamelizeString } from 'ish-core/utils/functions';
import { ModuleLoaderService } from 'ish-core/utils/module-loader/module-loader.service';
import { whenTruthy } from 'ish-core/utils/operators';

import { CxmlConfiguration } from '../models/cxml-configuration/cxml-configuration.model';
import { OciConfigurationItem } from '../models/oci-configuration-item/oci-configuration-item.model';
import { PunchoutType, PunchoutUser } from '../models/punchout-user/punchout-user.model';
import {
  cxmlConfigurationActions,
  getCxmlConfiguration,
  getCxmlConfigurationError,
  getCxmlConfigurationLoading,
} from '../store/cxml-configuration';
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

@Injectable({ providedIn: 'root' })
export class PunchoutFacade {
  private moduleLoader = inject(ModuleLoaderService);

  constructor(private store: Store) {}

  punchoutLoading$ = this.moduleLoader.whenLoaded('punchout', () =>
    combineLatest([this.store.pipe(select(getPunchoutLoading)), this.store.pipe(select(getPunchoutTypesLoading))]).pipe(
      map(([loading, typesLoading]) => loading || (typesLoading as boolean))
    )
  );

  punchoutError$ = this.moduleLoader.whenLoaded('punchout', () => this.store.pipe(select(getPunchoutError)));
  punchoutTypesError$: Observable<HttpError> = this.moduleLoader.whenLoaded('punchout', () =>
    this.store.pipe(select(getPunchoutTypesError))
  );
  supportedPunchoutTypes$: Observable<PunchoutType[]> = this.moduleLoader.whenLoaded('punchout', () =>
    this.store.pipe(select(getPunchoutTypes))
  );

  selectedPunchoutType$ = this.moduleLoader.whenLoaded('punchout', () =>
    combineLatest([this.store.pipe(select(selectQueryParam('format'))), this.store.pipe(select(getPunchoutTypes))]).pipe(
      filter(([format, types]) => !!format || types?.length > 0),
      map(([format, types]) => (format as PunchoutType) || types[0]),
      distinctUntilChanged()
    )
  );

  punchoutUsersByRoute$() {
    return this.selectedPunchoutType$.pipe(
      whenTruthy(),
      switchMap(type => this.moduleLoader.whenLoaded('punchout', () => this.store.pipe(select(getPunchoutUsers(type)))))
    );
  }

  selectedPunchoutUser$ = this.moduleLoader.whenLoaded('punchout', () => this.store.pipe(select(getSelectedPunchoutUser)));

  addPunchoutUser(user: PunchoutUser) {
    void this.moduleLoader.ensureLoaded('punchout').then(() => this.store.dispatch(addPunchoutUser({ user })));
  }

  updatePunchoutUser(user: PunchoutUser) {
    void this.moduleLoader.ensureLoaded('punchout').then(() => this.store.dispatch(updatePunchoutUser({ user })));
  }

  deletePunchoutUser(user: PunchoutUser) {
    void this.moduleLoader.ensureLoaded('punchout').then(() => this.store.dispatch(deletePunchoutUser({ user })));
  }

  transferBasket() {
    void this.moduleLoader.ensureLoaded('punchout').then(() => this.store.dispatch(transferPunchoutBasket()));
  }

  ociConfiguration$() {
    return this.moduleLoader.whenLoaded('punchout', () => {
      this.store.dispatch(ociConfigurationActions.loadOCIOptionsAndConfiguration());
      return this.store.pipe(select(getOciConfiguration));
    });
  }
  ociConfigurationLoading$ = this.moduleLoader.whenLoaded('punchout', () =>
    this.store.pipe(select(getOciConfigurationLoading))
  );
  ociConfigurationError$ = this.moduleLoader.whenLoaded('punchout', () =>
    this.store.pipe(select(getOciConfigurationError))
  );
  ociFormatterSelectOptions$ = this.moduleLoader.whenLoaded('punchout', () =>
    this.store.pipe(
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
    )
  );
  ociPlaceholders$ = this.moduleLoader.whenLoaded('punchout', () => this.store.pipe(select(getOciPlaceholders)));

  updateOciConfiguration(configuration: OciConfigurationItem[]) {
    void this.moduleLoader
      .ensureLoaded('punchout')
      .then(() => this.store.dispatch(ociConfigurationActions.updateOCIConfiguration({ configuration })));
  }

  cxmlConfiguration$() {
    return this.moduleLoader.whenLoaded('punchout', () => {
      this.store.dispatch(cxmlConfigurationActions.loadCXMLConfiguration());
      return this.store.pipe(select(getCxmlConfiguration));
    });
  }

  cxmlConfigurationLoading$ = this.moduleLoader.whenLoaded('punchout', () =>
    this.store.pipe(select(getCxmlConfigurationLoading))
  );

  cxmlConfigurationError$ = this.moduleLoader.whenLoaded('punchout', () =>
    this.store.pipe(select(getCxmlConfigurationError))
  );

  updateCxmlConfiguration(configuration: CxmlConfiguration[]) {
    void this.moduleLoader
      .ensureLoaded('punchout')
      .then(() => this.store.dispatch(cxmlConfigurationActions.updateCXMLConfiguration({ configuration })));
  }

  resetCxmlConfiguration() {
    void this.moduleLoader
      .ensureLoaded('punchout')
      .then(() => this.store.dispatch(cxmlConfigurationActions.resetCXMLConfiguration()));
  }
}
