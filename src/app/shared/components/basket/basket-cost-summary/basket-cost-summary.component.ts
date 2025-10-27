import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketTotal } from 'ish-core/models/basket-total/basket-total.model';
import { PriceItemHelper } from 'ish-core/models/price-item/price-item.helper';
import { PriceHelper } from 'ish-core/models/price/price.model';
import { PaypalPageType } from 'ish-core/utils/paypal-config/paypal-config.service';

/**
 * The Cost Summary Component displays a detailed summary of basket or order costs, respectively.
 *
 * @example
 * <ish-basket-cost-summary
 *   [totals]="basket.totals"
 * ></ish-basket-cost-summary>
 */
@Component({
  selector: 'ish-basket-cost-summary',
  templateUrl: './basket-cost-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketCostSummaryComponent implements OnInit {
  @Input({ required: true }) totals: BasketTotal;

  taxTranslation$: Observable<string>;
  invert = PriceHelper.invert;

  showPaypalMessages$: Observable<{ type: PaypalPageType; preference: string }> =
    this.checkoutFacade.checkoutStep$.pipe(
      map(step =>
        step === 3
          ? {
              type: 'checkout',
              preference: 'preferences.PayPalCheckoutPreferences.PayLaterMessagingPaymentEnabled',
            }
          : step === undefined
          ? { type: 'cart', preference: 'preferences.PayPalCheckoutPreferences.PayLaterMessagingCartEnabled' }
          : undefined
      )
    );

  constructor(private accountFacade: AccountFacade, private checkoutFacade: CheckoutFacade) {}

  ngOnInit() {
    this.taxTranslation$ = this.accountFacade.userPriceDisplayType$.pipe(
      map(type => (type === 'net' ? 'checkout.tax.text' : 'checkout.tax.TaxesLabel.TotalOrderVat'))
    );
  }

  get hasPaymentCostsTotal(): boolean {
    const paymentCosts = PriceItemHelper.selectType(this.totals?.paymentCostsTotal, 'gross');
    return !!paymentCosts && !!paymentCosts.value;
  }
}
