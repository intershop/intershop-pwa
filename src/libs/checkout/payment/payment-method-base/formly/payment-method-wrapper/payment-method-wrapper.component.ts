import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PaymentMethod } from '@intershop-pwa/checkout/payment/payment-method-base/models/payment-method.model';
import { FieldWrapper } from '@ngx-formly/core';

// eslint-disable-next-line ish-custom-rules/require-formly-code-documentation
@Component({
  selector: 'ish-payment-method-wrapper',
  templateUrl: './payment-method-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentMethodWrapperComponent extends FieldWrapper {
  get paymentMethod(): PaymentMethod {
    console.log(this.to.paymentMethod);
    return this.to.paymentMethod;
  }
}
