import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { getCheckoutStep } from '../../store/viewconf';

@Component({
  templateUrl: './checkout-page.container.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CheckoutPageContainerComponent implements OnInit {
  checkoutStep$: Observable<number>;

  constructor(private store: Store<{}>) {}

  ngOnInit() {
    this.checkoutStep$ = this.store.pipe(select(getCheckoutStep));
  }
}
