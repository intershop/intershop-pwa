import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

@Component({
  selector: 'ish-mini-basket-content',
  templateUrl: './mini-basket-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class MiniBasketContentComponent implements OnInit {
  basketError$: Observable<HttpError>;
  lineItems$: Observable<LineItemView[]>;

  constructor(private checkoutFacade: CheckoutFacade) {}

  ngOnInit() {
    this.basketError$ = this.checkoutFacade.basketError$;
    this.lineItems$ = this.checkoutFacade.basketLineItems$;
  }
}
