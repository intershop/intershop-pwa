import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs';

import { WarrantyService } from 'ish-core/services/warranty/warranty.service';
import { mapErrorToAction, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { loadWarranty, loadWarrantyFail, loadWarrantySuccess } from './warranties.actions';

@Injectable()
export class WarrantiesEffects {
  constructor(private actions$: Actions, private warrantyService: WarrantyService) {}

  loadWarranty$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadWarranty),
      mapToPayloadProperty('warrantyId'),
      whenTruthy(),
      mergeMap(warrantyId =>
        this.warrantyService.getWarranty(warrantyId).pipe(
          map(warranty => loadWarrantySuccess({ warranty })),
          mapErrorToAction(loadWarrantyFail)
        )
      )
    )
  );
}
