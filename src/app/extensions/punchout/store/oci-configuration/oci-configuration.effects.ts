import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map, mergeMap } from 'rxjs/operators';

import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { mapErrorToAction, mapToPayloadProperty } from 'ish-core/utils/operators';

import { PunchoutService } from '../../services/punchout/punchout.service';

import { ociConfigurationActions, ociConfigurationApiActions } from './oci-configuration.actions';

@Injectable()
export class OciConfigurationEffects {
  constructor(private actions$: Actions, private punchoutService: PunchoutService) {}

  loadOciOptionsAndConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ociConfigurationActions.loadOciOptionsAndConfiguration),
      concatMap(() => [
        ociConfigurationActions.loadOciConfigurationOptions(),
        ociConfigurationActions.loadOciConfiguration(),
      ])
    )
  );

  loadOciConfigurationOptions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ociConfigurationActions.loadOciConfigurationOptions),
      concatMap(() =>
        this.punchoutService.getOciConfigurationOptions().pipe(
          map(options => ociConfigurationApiActions.loadOciConfigurationOptionsSuccess({ options })),
          mapErrorToAction(ociConfigurationApiActions.loadOciConfigurationOptionsFail)
        )
      )
    )
  );

  loadOciConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ociConfigurationActions.loadOciConfiguration),
      concatMap(() =>
        this.punchoutService.getOciConfiguration().pipe(
          mergeMap(configuration => [ociConfigurationApiActions.loadOciConfigurationSuccess({ configuration })]),
          mapErrorToAction(ociConfigurationApiActions.loadOciConfigurationFail)
        )
      )
    )
  );

  updateOciConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ociConfigurationActions.updateOciConfiguration),
      mapToPayloadProperty('configuration'),
      concatMap(configuration =>
        this.punchoutService.updateOciConfiguration(configuration).pipe(
          mergeMap(configuration => [
            ociConfigurationApiActions.updateOciConfigurationSuccess({ configuration }),
            displaySuccessMessage({
              message: 'account.punchout.configuration.save_success.message',
            }),
          ]),
          mapErrorToAction(ociConfigurationApiActions.updateOciConfigurationFail)
        )
      )
    )
  );
}
