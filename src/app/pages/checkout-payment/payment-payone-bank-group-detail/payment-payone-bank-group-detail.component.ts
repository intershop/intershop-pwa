import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';

@Component({
  selector: 'ish-payment-payone-bank-group-detail',
  templateUrl: './payment-payone-bank-group-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentPayoneBankGroupDetailComponent implements OnInit {
  /**
   * payone payment method, needed to get configuration parameters
   */
  @Input() paymentMethod: PaymentMethod;
  /**
   * payone payment instrument, needed for currently selected instrument.
   */
  @Input() paymentInstrument: PaymentInstrument;

  bankGroupName: string;

  ngOnInit() {
    this.bankGroupName = this.getBankGroupName();
  }

  /**
   * function to get localized bankGroup name
   */
  private getBankGroupName(): string {
    // fetching bankGroup code from payment instrument
    const bankGroupCodeValue = AttributeHelper.getAttributeValueByAttributeName<string>(
      this.paymentInstrument?.parameters,
      'bankGroupCode'
    );

    // fetching corresponding bankGroup name from bankGroup map
    const bankGroupMap = bankGroupCodeValue
      ? this.paymentMethod.hostedPaymentPageParameters.find(param => param.name === bankGroupCodeValue)
      : undefined;
    return bankGroupMap?.value;
  }
}
