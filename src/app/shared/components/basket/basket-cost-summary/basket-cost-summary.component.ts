import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketTotal } from 'ish-core/models/basket-total/basket-total.model';
import { PriceItemHelper } from 'ish-core/models/price-item/price-item.helper';
import { PriceHelper } from 'ish-core/models/price/price.model';
import { PaypalPageTypes } from 'ish-core/utils/sdk/paypal/paypal-config/paypal-config.service';

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

  paypalPageType$: Observable<PaypalPageTypes>;

  constructor(private accountFacade: AccountFacade, private checkoutFacade: CheckoutFacade) {}

  ngOnInit() {
    this.taxTranslation$ = this.accountFacade.userPriceDisplayType$.pipe(
      map(type => (type === 'net' ? 'checkout.tax.text' : 'checkout.tax.TaxesLabel.TotalOrderVat'))
    );
    this.paypalPageType$ = this.checkoutFacade.checkoutStep$.pipe(
      map(step => (step === 3 ? PaypalPageTypes.CheckoutPayment : PaypalPageTypes.Cart))
    );
  }

  get hasPaymentCostsTotal(): boolean {
    const paymentCosts = PriceItemHelper.selectType(this.totals?.paymentCostsTotal, 'gross');
    return !!paymentCosts && !!paymentCosts.value;
  }
}
