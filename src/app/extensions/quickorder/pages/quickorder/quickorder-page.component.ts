import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';

@Component({
  selector: 'ish-quickorder-page',
  templateUrl: './quickorder-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickorderPageComponent implements OnInit {
  loading$: Observable<boolean>;

  constructor(private checkoutFacade: CheckoutFacade) {}

  ngOnInit(): void {
    this.loading$ = this.checkoutFacade.basketLoading$;
  }
}
