import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, combineLatest } from 'rxjs';
import { shareReplay, take } from 'rxjs/operators';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { CheckoutStepType } from 'ish-core/models/checkout/checkout-step.type';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ShippingMethod } from 'ish-core/models/shipping-method/shipping-method.model';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { BasketAddressSummaryComponent } from 'ish-shared/components/basket/basket-address-summary/basket-address-summary.component';
import { BasketCostSummaryComponent } from 'ish-shared/components/basket/basket-cost-summary/basket-cost-summary.component';
import { BasketDesiredDeliveryDateComponent } from 'ish-shared/components/basket/basket-desired-delivery-date/basket-desired-delivery-date.component';
import { BasketErrorMessageComponent } from 'ish-shared/components/basket/basket-error-message/basket-error-message.component';
import { BasketItemsSummaryComponent } from 'ish-shared/components/basket/basket-items-summary/basket-items-summary.component';
import { BasketMerchantMessageComponent } from 'ish-shared/components/basket/basket-merchant-message/basket-merchant-message.component';
import { BasketOrderReferenceComponent } from 'ish-shared/components/basket/basket-order-reference/basket-order-reference.component';
import { BasketRecurrenceSummaryComponent } from 'ish-shared/components/basket/basket-recurrence-summary/basket-recurrence-summary.component';
import { BasketValidationResultsComponent } from 'ish-shared/components/basket/basket-validation-results/basket-validation-results.component';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { CheckoutShippingComponent } from './checkout-shipping/checkout-shipping.component';

@Component({
  selector: 'ish-checkout-shipping-page',
  templateUrl: './checkout-shipping-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    TranslateModule,
    AsyncPipe,
    ServerSettingPipe,
    ErrorMessageComponent,
    BasketErrorMessageComponent,
    BasketValidationResultsComponent,
    CheckoutShippingComponent,
    BasketDesiredDeliveryDateComponent,
    BasketOrderReferenceComponent,
    BasketMerchantMessageComponent,
    BasketAddressSummaryComponent,
    BasketRecurrenceSummaryComponent,
    BasketItemsSummaryComponent,
    BasketCostSummaryComponent,
    ServerHtmlDirective,
    LoadingComponent,
  ],
})
export class CheckoutShippingPageComponent implements OnInit {
  loading$: Observable<boolean>;
  basketError$: Observable<HttpError>;
  basket$: Observable<BasketView>;
  shippingMethods$: Observable<ShippingMethod[]>;
  isBusinessCustomer$: Observable<boolean>;
  isDesiredDeliveryDate$: Observable<boolean>;

  private destroyRef = inject(DestroyRef);

  nextDisabled = false;

  constructor(
    private checkoutFacade: CheckoutFacade,
    private accountFacade: AccountFacade,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.basket$ = this.checkoutFacade.basket$;
    this.loading$ = this.checkoutFacade.basketLoading$;
    this.basketError$ = this.checkoutFacade.basketError$;
    this.shippingMethods$ = this.checkoutFacade.eligibleShippingMethods$().pipe(shareReplay(1));
    this.isDesiredDeliveryDate$ = this.checkoutFacade.isDesiredDeliveryDateEnabled$;
    this.isBusinessCustomer$ = this.accountFacade.isBusinessCustomer$;
  }

  /**
   * Validates the basket and jumps to the next checkout step (Payment)
   */
  goToNextStep() {
    combineLatest([this.shippingMethods$, this.basket$])
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe(([shippingMethods, basket]) => {
        this.nextDisabled = !basket || !shippingMethods?.length || !basket.commonShippingMethod;
        this.cd.markForCheck();
        if (!this.nextDisabled) {
          this.checkoutFacade.continue(CheckoutStepType.Payment);
        }
      });
  }
}
