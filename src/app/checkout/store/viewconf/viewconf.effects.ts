import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ofRoute, RouteNavigation } from 'ngrx-router';
import { map } from 'rxjs/operators';
import { CheckoutState } from '../checkout.state';
import { SetCheckoutStep } from './viewconf.actions';

@Injectable()
export class ViewconfEffects {
  constructor(private actions$: Actions, private store: Store<CheckoutState>) {}

  @Effect()
  retrieveCheckoutStepFromRouting$ = this.actions$.pipe(
    ofRoute(/^checkout.*/),
    map((action: RouteNavigation) => action.payload.data.checkoutStep),
    map(checkoutStep => new SetCheckoutStep(checkoutStep))
  );
}
