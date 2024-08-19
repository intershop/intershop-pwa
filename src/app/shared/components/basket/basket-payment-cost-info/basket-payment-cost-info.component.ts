import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { BasketView } from 'ish-core/models/basket/basket.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { PriceItemHelper } from 'ish-core/models/price-item/price-item.helper';

/**
 * Component for displaying payment costs and payment restriction information.
 */
@Component({
  selector: 'ish-basket-payment-cost-info',
  templateUrl: './basket-payment-cost-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketPaymentCostInfoComponent {
  @Input({ required: true }) paymentMethod: PaymentMethod;
  @Input({ required: true }) basket: BasketView;
  @Input({ required: true }) priceType: 'gross' | 'net';

  /**
   * Determine whether payment cost threshold has been reached
   * for usage in template
   */
  paymentCostThresholdReached(paymentMethod: PaymentMethod): boolean {
    const basketTotalPrice = PriceItemHelper.selectType(this.basket.totals.total, this.priceType);

    if (paymentMethod.paymentCostsThreshold && basketTotalPrice) {
      return (
        PriceItemHelper.selectType(paymentMethod.paymentCostsThreshold, this.priceType)?.value <= basketTotalPrice.value
      );
    }
    return false;
  }
}
