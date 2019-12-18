import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';

@Component({
  templateUrl: './checkout-page.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CheckoutPageComponent implements OnInit {
  checkoutStep$: Observable<number>;

  constructor(private checkoutFacade: CheckoutFacade) {}

  ngOnInit() {
    this.checkoutStep$ = this.checkoutFacade.checkoutStep$;
  }
}
