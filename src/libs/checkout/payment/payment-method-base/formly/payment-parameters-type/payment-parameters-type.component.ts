import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PaymentInstrument } from '@intershop-pwa/checkout/payment/payment-method-base/models/payment-instrument.model';
import { PaymentMethodFacade } from '@intershop-pwa/checkout/payment/payment-method-base/payment-method-facade/payment-method.facade';
import { FieldType } from '@ngx-formly/core';
import { Observable, Subject, map, take, takeUntil } from 'rxjs';

import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

// eslint-disable-next-line ish-custom-rules/require-formly-code-documentation
@Component({
  selector: 'ish-payment-parameters-type',
  templateUrl: './payment-parameters-type.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentParametersTypeComponent extends FieldType implements OnInit, OnDestroy {
  isFormOpened$: Observable<boolean>;
  private destroy$ = new Subject<void>();

  formGroup = new FormGroup({});
  submitted = false;

  constructor(private paymentMethodFacade: PaymentMethodFacade) {
    super();
  }

  ngOnInit(): void {
    this.isFormOpened$ = this.paymentMethodFacade.openedParameterForm$.pipe(
      map(opened => opened === this.to.paymentMethodId)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openForm() {
    this.paymentMethodFacade.openParameterForm(this.to.paymentMethodId);
  }

  submitParameterForm() {
    this.submitted = true;

    if (this.formGroup.invalid) {
      markAsDirtyRecursive(this.formGroup);
      return;
    }

    const parameters = Object.entries(this.formGroup.controls)
      .filter(([key, control]) => control.enabled && control.value && key !== 'saveForLater')
      .map(([key, control]) => ({
        name: key,
        value: typeof control.value === 'string' ? control.value.trim() : control.value,
      }));

    const pi: PaymentInstrument = {
      id: undefined,
      paymentMethod: this.to.paymentMethodId,
      parameters,
    };

    this.paymentMethodFacade
      .getPaymentMethodById$(this.to.paymentMethodId)
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(pm => {
        const saveAllowed = pm.saveAllowed && this.formGroup.get('saveForLater').value;
        this.paymentMethodFacade.submitPaymentInstrument(pi, saveAllowed);
        this.paymentMethodFacade.closeParameterForm();
      });
  }

  cancelNewPaymentInstrument() {
    this.paymentMethodFacade.closeParameterForm();
  }

  // TODO: must check that form is disabled when #1 form is invalid and #2 form is submitted
  get submitDisabled() {
    return this.formGroup.invalid && this.submitted;
  }
}
