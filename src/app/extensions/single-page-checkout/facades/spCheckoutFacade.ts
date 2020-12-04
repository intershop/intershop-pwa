import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  spContinueCheckout,
} from '../store/sp-checkout/sp-checkout.action';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class SpCheckoutFacade {
  constructor(private store: Store) {}
  continue(targetStep: number) {
    this.store.dispatch(spContinueCheckout({ targetStep }));
  }
}
