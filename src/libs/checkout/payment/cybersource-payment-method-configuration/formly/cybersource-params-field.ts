import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { PaymentInstrument } from '@intershop-pwa/checkout/payment/payment-method-base/models/payment-instrument.model';
import { PaymentMethod } from '@intershop-pwa/checkout/payment/payment-method-base/models/payment-method.model';
import { PaymentMethodFacade } from '@intershop-pwa/checkout/payment/payment-method-base/payment-method-facade/payment-method.facade';
import { FieldType } from '@ngx-formly/core';
import { Observable, Subject, map, take, takeUntil } from 'rxjs';

import { Attribute } from 'ish-core/models/attribute/attribute.model';

/**
 * blub
 */
@Component({
  templateUrl: './cybersource-params-field.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CybersourceParamsFieldComponent extends FieldType implements OnInit, OnDestroy {
  paymentMethod$: Observable<PaymentMethod>;
  activated$: Observable<boolean>;

  private destroy$ = new Subject<void>();
  constructor(private pmFacade: PaymentMethodFacade) {
    super();
  }

  ngOnInit(): void {
    this.paymentMethod$ = this.pmFacade.getPaymentMethodById$(this.to.paymentMethodId);
    this.activated$ = this.pmFacade.openedParameterForm$.pipe(map(id => id === this.to.paymentMethodId));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submitPaymentInstrument(event: { parameters: Attribute<string>[]; saveAllowed: boolean }) {
    const pi: PaymentInstrument = {
      id: undefined,
      paymentMethod: this.to.paymentMethodId,
      parameters: event.parameters,
    };

    this.pmFacade
      .getPaymentMethodById$(this.to.paymentMethodId)
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(pm => {
        const saveAllowed = pm.saveAllowed && event.saveAllowed;
        this.pmFacade.submitPaymentInstrument(pi, saveAllowed);
        this.pmFacade.closeParameterForm();
      });
  }

  cancelCreatePaymentInstrument() {
    this.pmFacade.closeParameterForm();
  }

  openParameterForm() {
    this.pmFacade.openParameterForm(this.to.paymentMethodId);
  }
}
