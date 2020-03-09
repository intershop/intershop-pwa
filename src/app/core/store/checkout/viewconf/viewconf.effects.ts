import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { mapToData, ofRoute } from 'ngrx-router';
import { map } from 'rxjs/operators';

import { SetCheckoutStep } from './viewconf.actions';

@Injectable()
export class ViewconfEffects {
  constructor(private actions$: Actions) {}

  @Effect()
  retrieveCheckoutStepFromRouting$ = this.actions$.pipe(
    ofRoute(/^checkout.*/),
    mapToData<number>('checkoutStep'),
    map(step => new SetCheckoutStep({ step }))
  );
}
