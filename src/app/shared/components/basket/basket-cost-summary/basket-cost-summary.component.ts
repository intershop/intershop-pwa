import { AsyncPipe, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { IconModule } from 'ish-core/icon.module';
import { BasketTotal } from 'ish-core/models/basket-total/basket-total.model';
import { PriceItemHelper } from 'ish-core/models/price-item/price-item.helper';
import { PriceHelper } from 'ish-core/models/price/price.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { PaypalPageType } from 'ish-core/utils/paypal-config/paypal-config.service';
import { BasketPromotionComponent } from 'ish-shared/components/basket/basket-promotion/basket-promotion.component';
import { PaymentPaypalMessagesComponent } from 'ish-shared/components/checkout/payment-paypal-messages/payment-paypal-messages.component';

/**
 * The Cost Summary Component displays a detailed summary of basket or order costs, respectively.
 *
 * @example
 * <ish-basket-cost-summary [totals]="basket.totals" />
 */
@Component({
  selector: 'ish-basket-cost-summary',
  templateUrl: './basket-cost-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    TranslateModule,
    PricePipe,
    BasketPromotionComponent,
    NgTemplateOutlet,
    AsyncPipe,
    ServerSettingPipe,
    IconModule,
    NgbPopover,
    PaymentPaypalMessagesComponent,
  ],
})
export class BasketCostSummaryComponent implements OnInit {
  @Input({ required: true }) totals: BasketTotal;

  taxTranslation$: Observable<string>;
  invert = PriceHelper.invert;

  constructor(
    private accountFacade: AccountFacade,
    private router: Router
  ) {}

  ngOnInit() {
    this.taxTranslation$ = this.accountFacade.userPriceDisplayType$.pipe(
      map(type => (type === 'net' ? 'checkout.tax.text' : 'checkout.tax.TaxesLabel.TotalOrderVat'))
    );
  }

  get hasPaymentCostsTotal(): boolean {
    const paymentCosts = PriceItemHelper.selectType(this.totals?.paymentCostsTotal, 'gross');
    return !!paymentCosts && !!paymentCosts.value;
  }

  getPaypalPageType(): PaypalPageType {
    return this.router.url.includes('/basket') ? 'cart' : 'checkout';
  }
}
