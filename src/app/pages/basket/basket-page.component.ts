import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SpCheckoutFacade } from 'src/app/extensions/single-page-checkout/facades/spCheckoutFacade';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

@Component({
  selector: 'ish-basket-page',
  templateUrl: './basket-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketPageComponent implements OnInit {
  basket$: Observable<BasketView>;
  basketLoading$: Observable<boolean>;
  basketError$: Observable<HttpError>;

  constructor(
    private checkoutFacade: CheckoutFacade,
    private featureToggleService: FeatureToggleService,
    private spCheckout: SpCheckoutFacade
  ) {}

  ngOnInit() {
    this.basket$ = this.checkoutFacade.basket$;
    this.basketLoading$ = this.checkoutFacade.basketLoading$;
    this.basketError$ = this.checkoutFacade.basketError$;
  }

  nextStep() {
    this.featureToggleService.enabled('spCheckout') ? this.spCheckout.continue(1) : this.checkoutFacade.continue(1);
  }
}
