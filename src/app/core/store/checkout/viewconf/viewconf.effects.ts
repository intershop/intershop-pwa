import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { selectRouteData } from 'ish-core/store/router';

import { SetCheckoutStep } from './viewconf.actions';

@Injectable()
export class ViewconfEffects {
  constructor(private store: Store<{}>) {}

  @Effect()
  retrieveCheckoutStepFromRouting$ = this.store.pipe(
    select(selectRouteData<number>('checkoutStep')),
    map(step => new SetCheckoutStep({ step }))
  );
}
