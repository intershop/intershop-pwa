import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';

import { whenFalsy } from 'ish-core/utils/operators';
import { StatePropertiesService } from 'ish-core/utils/state-transfer/state-properties.service';

import { AddressDoctorConfig } from '../../models/address-doctor/address-doctor-config.model';

import { addressDoctorInternalActions } from './address-doctor.actions';
import { getAddressDoctorConfig } from './address-doctor.selectors';

@Injectable()
export class AddressDoctorEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private statePropertiesService: StatePropertiesService
  ) {}

  loadAddressDoctorConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addressDoctorInternalActions.loadAddressDoctorConfig),
      switchMap(() =>
        this.statePropertiesService
          .getStateOrEnvOrDefault<AddressDoctorConfig>('ADDRESS_DOCTOR', 'addressDoctor')
          .pipe(map(config => addressDoctorInternalActions.setAddressDoctorConfig({ config })))
      )
    )
  );

  loadAddressDoctorConfigOnInit$ = createEffect(() =>
    this.store.pipe(
      select(getAddressDoctorConfig),
      whenFalsy(),
      map(() => addressDoctorInternalActions.loadAddressDoctorConfig())
    )
  );
}
