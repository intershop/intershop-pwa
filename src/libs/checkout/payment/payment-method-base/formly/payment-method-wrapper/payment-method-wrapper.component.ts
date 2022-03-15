import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PaymentMethod } from '@intershop-pwa/checkout/payment/payment-method-base/models/payment-method.model';
import { PaymentMethodFacade } from '@intershop-pwa/checkout/payment/payment-method-base/payment-method-facade/payment-method.facade';
import { FieldWrapper } from '@ngx-formly/core';
import { Observable, tap } from 'rxjs';

// eslint-disable-next-line ish-custom-rules/require-formly-code-documentation
@Component({
  selector: 'ish-payment-method-wrapper',
  templateUrl: './payment-method-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentMethodWrapperComponent extends FieldWrapper implements OnInit {
  paymentMethod$: Observable<PaymentMethod>;

  constructor(private paymentMethodFacade: PaymentMethodFacade) {
    super();
  }

  ngOnInit(): void {
    this.paymentMethod$ = this.paymentMethodFacade
      .getPaymentMethodById$(this.to.paymentMethodId)
      .pipe(tap(x => console.log('in wrapper', x)));
  }
}
