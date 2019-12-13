import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';

@Component({
  selector: 'ish-account-payment',
  templateUrl: './account-payment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountPaymentComponent {
  @Input() paymentMethods: PaymentMethod[];
  @Input() error: HttpError;
}
