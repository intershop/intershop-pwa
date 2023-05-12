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

  loadOciConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ociConfigurationActions.loadOciConfiguration),
      concatMap(() =>
        this.punchoutService.getOciConfiguration().pipe(
          map(ociConfiguration => ociConfigurationActionsApiActions.loadOciConfigurationSuccess({ ociConfiguration })),
          mapErrorToAction(ociConfigurationActionsApiActions.loadOciConfigurationFail)
        )
      )
    )
  );

  updateOciConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ociConfigurationActions.updateOciConfiguration),
      mapToPayloadProperty('ociConfiguration'),
      concatMap(configuration =>
        this.punchoutService.updateOciConfiguration(configuration).pipe(
          mergeMap(ociConfiguration => [
            ociConfigurationActionsApiActions.updateOciConfigurationSuccess({ ociConfiguration }),
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
