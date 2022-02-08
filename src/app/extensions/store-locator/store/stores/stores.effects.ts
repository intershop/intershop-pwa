import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map } from 'rxjs/operators';

import { mapErrorToAction } from 'ish-core/utils/operators';

import { StoresService } from '../../services/stores/stores.service';

import { loadStores, loadStoresFail, loadStoresSuccess } from './stores.actions';

@Injectable()
export class StoresEffects {
  constructor(private actions$: Actions, private storesService: StoresService) {}

  loadStores$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadStores),
      concatMap(action =>
        this.storesService.getStores(action.payload.countryCode, action.payload.postalCode, action.payload.city).pipe(
          map(stores => loadStoresSuccess({ stores })),
          mapErrorToAction(loadStoresFail)
        )
      )
    )
  );
}
