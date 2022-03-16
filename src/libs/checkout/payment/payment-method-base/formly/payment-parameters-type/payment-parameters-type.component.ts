import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PaymentMethodFacade } from '@intershop-pwa/checkout/payment/payment-method-base/payment-method-facade/payment-method.facade';
import { FieldType } from '@ngx-formly/core';
import { Observable, map } from 'rxjs';

// eslint-disable-next-line ish-custom-rules/require-formly-code-documentation
@Component({
  selector: 'ish-payment-parameters-type',
  templateUrl: './payment-parameters-type.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentParametersTypeComponent extends FieldType implements OnInit {
  isFormOpened$: Observable<boolean>;

  defaultOptions = {
    defaultValue: {},
  };

  formGroup = new FormGroup({});

  constructor(private paymentMethodFacade: PaymentMethodFacade) {
    super();
  }

  ngOnInit(): void {
    this.isFormOpened$ = this.paymentMethodFacade.openedParameterForm$.pipe(
      map(opened => opened === this.to.paymentMethodId)
    );
  }

  openForm() {
    console.log(this.to.paymentMethodId);
    this.paymentMethodFacade.openParameterForm(this.to.paymentMethodId);
  }

  submitParameterForm() {}

  // TODO: must check that form is disabled when #1 form is invalid and #2 form is submitted
  get submitDisabled() {
    return false;
  }
}
