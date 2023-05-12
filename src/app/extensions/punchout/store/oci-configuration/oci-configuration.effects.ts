import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map } from 'rxjs/operators';

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

  //TODO: The update function should be replaced with Silke's method.
  updateOciConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ociConfigurationActions.updateOciConfiguration),
      mapToPayloadProperty('ociConfiguration'),
      concatMap(configuration =>
        this.punchoutService.updateOciConfiguration(configuration).pipe(
          map(ociConfiguration =>
            ociConfigurationActionsApiActions.updateOciConfigurationSuccess({ ociConfiguration })
          ),
          mapErrorToAction(ociConfigurationActionsApiActions.updateOciConfigurationFail)
        )
      )
    )
  );
}
