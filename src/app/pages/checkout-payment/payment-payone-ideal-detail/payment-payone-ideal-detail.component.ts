import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';

@Component({
  selector: 'ish-payment-payone-ideal-detail',
  templateUrl: './payment-payone-ideal-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentPayoneIdealDetailComponent implements OnInit {
  constructor(protected cd: ChangeDetectorRef) {}

  @Input() paymentMethod: PaymentMethod;
  @Input() paymentInstrument: PaymentInstrument;

  bankGroupName: string;

  ngOnInit() {
    this.bankGroupName = this.getBankGroupName();
  }

  /**
   * function to get localized bankGroup name
   */
  protected getBankGroupName(): string {
    if (this.paymentInstrument && this.paymentInstrument.parameters) {
      // fetching bankGroup code from payment instrument
      const bankGroupCodeAttr = this.paymentInstrument.parameters.find(attribute => attribute.name === 'bankGroupCode');
      let bankGroupCodeValue;
      if (bankGroupCodeAttr) {
        bankGroupCodeValue = bankGroupCodeAttr.value ? bankGroupCodeAttr.value.toString() : undefined;
      }
      // fetching corresponding bankGroup name from bankGroup map
      if (bankGroupCodeValue) {
        for (const bankGroupMap of this.paymentMethod.hostedPaymentPageParameters) {
          if (bankGroupMap.name === bankGroupCodeValue) {
            return bankGroupMap.value;
          }
        }
      }
    }
  }
}
