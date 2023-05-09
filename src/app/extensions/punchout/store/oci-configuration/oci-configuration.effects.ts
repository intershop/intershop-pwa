import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map } from 'rxjs/operators';

import { mapErrorToAction, mapToPayloadProperty } from 'ish-core/utils/operators';

import { PunchoutService } from '../../services/punchout/punchout.service';

import {
  loadOciConfigurations,
  loadOciConfigurationsFail,
  loadOciConfigurationsSuccess,
  updateOciConfiguration,
  updateOciConfigurationFail,
  updateOciConfigurationSuccess,
} from './oci-configuration.actions';

@Injectable()
export class OciConfigurationsEffects {
  constructor(private actions$: Actions, private punchoutService: PunchoutService) {}

  loadOciConfigurations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOciConfigurations),
      concatMap(() =>
        this.punchoutService.getOciConfigurations().pipe(
          map(ociConfigurations => loadOciConfigurationsSuccess({ ociConfigurations })),
          mapErrorToAction(loadOciConfigurationsFail)
        )
      )
    )
  );

  updateOciConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateOciConfiguration),
      mapToPayloadProperty('ociConfiguration'),
      concatMap(configuration =>
        this.punchoutService.updateOciConfiguration(configuration).pipe(
          map(ociConfiguration => updateOciConfigurationSuccess({ ociConfiguration })),
          mapErrorToAction(updateOciConfigurationFail)
        )
      )
    )
  );
}
