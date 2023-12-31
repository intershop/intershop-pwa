import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map, mergeMap, switchMap } from 'rxjs/operators';

import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { mapErrorToAction, mapToPayloadProperty } from 'ish-core/utils/operators';

import { PunchoutService } from '../../services/punchout/punchout.service';

import { ociConfigurationActions, ociConfigurationApiActions } from './oci-configuration.actions';

@Injectable()
export class OciConfigurationEffects {
  constructor(private actions$: Actions, private punchoutService: PunchoutService) {}

  loadOciOptionsAndConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ociConfigurationActions.loadOCIOptionsAndConfiguration),
      concatMap(() => [
        ociConfigurationActions.loadOCIConfigurationOptions(),
        ociConfigurationActions.loadOCIConfiguration(),
      ])
    )
  );

  loadOciConfigurationOptions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ociConfigurationActions.loadOCIConfigurationOptions),
      switchMap(() =>
        this.punchoutService.getOciConfigurationOptions().pipe(
          map(options => ociConfigurationApiActions.loadOCIConfigurationOptionsSuccess({ options })),
          mapErrorToAction(ociConfigurationApiActions.loadOCIConfigurationOptionsFail)
        )
      )
    )
  );

  loadOciConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ociConfigurationActions.loadOCIConfiguration),
      switchMap(() =>
        this.punchoutService.getOciConfiguration().pipe(
          map(configuration => ociConfigurationApiActions.loadOCIConfigurationSuccess({ configuration })),
          mapErrorToAction(ociConfigurationApiActions.loadOCIConfigurationFail)
        )
      )
    )
  );

  updateOciConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ociConfigurationActions.updateOCIConfiguration),
      mapToPayloadProperty('configuration'),
      concatMap(configuration =>
        this.punchoutService.updateOciConfiguration(configuration).pipe(
          mergeMap(configuration => [
            ociConfigurationApiActions.updateOCIConfigurationSuccess({ configuration }),
            displaySuccessMessage({
              message: 'account.punchout.configuration.save_success.message',
            }),
          ]),
          mapErrorToAction(ociConfigurationApiActions.updateOCIConfigurationFail)
        )
      )
    )
  );
}
