import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map, mergeMap } from 'rxjs/operators';

import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { mapErrorToAction, mapToPayloadProperty } from 'ish-core/utils/operators';

import { PunchoutService } from '../../services/punchout/punchout.service';

import { ociConfigurationActions, ociConfigurationActionsApiActions } from './oci-configuration.actions';

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

  loadOciConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ociConfigurationActions.loadOciConfiguration),
      concatMap(() =>
        this.punchoutService.getOciConfiguration().pipe(
          mergeMap(configuration => [ociConfigurationActionsApiActions.loadOciConfigurationSuccess({ configuration })]),
          mapErrorToAction(ociConfigurationActionsApiActions.loadOciConfigurationFail)
        )
      )
    )
  );

  loadOciConfigurationOptions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ociConfigurationActions.loadOciConfigurationOptions),
      concatMap(() =>
        this.punchoutService.getOciConfigurationOptions().pipe(
          map(options => ociConfigurationActionsApiActions.loadOciConfigurationOptionsSuccess({ options })),
          mapErrorToAction(ociConfigurationActionsApiActions.loadOciConfigurationOptionsFail)
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
            ociConfigurationActionsApiActions.updateOciConfigurationSuccess({ configuration }),
            displaySuccessMessage({
              message: 'account.punchout.configuration.save_success.message',
            }),
          ]),
          mapErrorToAction(ociConfigurationActionsApiActions.updateOciConfigurationFail)
        )
      )
    )
  );
}
