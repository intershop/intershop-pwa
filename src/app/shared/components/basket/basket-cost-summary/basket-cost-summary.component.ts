import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { BasketTotal } from 'ish-core/models/basket-total/basket-total.model';
import { PriceItemHelper } from 'ish-core/models/price-item/price-item.helper';
import { PriceHelper } from 'ish-core/models/price/price.model';

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
  @Input() totals: BasketTotal;

  taxTranslation$: Observable<string>;
  invert = PriceHelper.invert;

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.taxTranslation$ = this.accountFacade.userPriceDisplayType$.pipe(
      map(type => (type === 'net' ? 'checkout.tax.text' : 'checkout.tax.TaxesLabel.TotalOrderVat'))
    );
  }

  get hasPaymentCostsTotal(): boolean {
    const paymentCosts = PriceItemHelper.selectType(this.totals && this.totals.paymentCostsTotal, 'gross');
    return !!paymentCosts && !!paymentCosts.value;
  }
}
