import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, map, mergeMap } from 'rxjs/operators';

import { displayErrorMessage, displaySuccessMessage } from 'ish-core/store/core/messages';
import { mapErrorToAction, mapToPayloadProperty } from 'ish-core/utils/operators';

import { PunchoutService } from '../../services/punchout/punchout.service';
import { getSelectedPunchoutUser } from '../punchout-users';

import { cxmlConfigurationActions, cxmlConfigurationApiActions } from './cxml-configuration.actions';

@Injectable()
export class CxmlConfigurationEffects {
  constructor(private actions$: Actions, private punchoutService: PunchoutService, private store: Store) {}

  loadCxmlConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(cxmlConfigurationActions.loadCXMLConfiguration),
      concatLatestFrom(() => this.store.pipe(select(getSelectedPunchoutUser))),
      concatMap(([_, user]) =>
        this.punchoutService.getCxmlConfiguration(user.id).pipe(
          map(configuration => cxmlConfigurationApiActions.loadCXMLConfigurationSuccess({ configuration })),
          mapErrorToAction(cxmlConfigurationApiActions.loadCXMLConfigurationFail)
        )
      )
    )
  );

  updateCxmlConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(cxmlConfigurationActions.updateCXMLConfiguration),
      mapToPayloadProperty('configuration'),
      concatLatestFrom(() => this.store.pipe(select(getSelectedPunchoutUser))),
      concatMap(([configuration, user]) =>
        this.punchoutService.updateCxmlConfiguration(configuration, user.id).pipe(
          mergeMap(configuration => [
            cxmlConfigurationApiActions.updateCXMLConfigurationSuccess({ configuration }),
            displaySuccessMessage({
              message: 'account.punchout.cxml.configuration.save_success.message',
            }),
          ]),
          mapErrorToAction(cxmlConfigurationApiActions.updateCXMLConfigurationFail)
        )
      )
    )
  );

  displayCxmlConfigurationErrorMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        cxmlConfigurationApiActions.updateCXMLConfigurationFail,
        cxmlConfigurationApiActions.loadCXMLConfigurationFail
      ),
      mapToPayloadProperty('error'),
      map(error =>
        displayErrorMessage({
          message: error.message,
        })
      )
    )
  );
}
