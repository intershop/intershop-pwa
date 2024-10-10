import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, Validators } from '@angular/forms';
import { range } from 'lodash-es';

import { SelectOption } from 'ish-core/models/select-option/select-option.model';
import { ScriptLoaderService } from 'ish-core/utils/script-loader/script-loader.service';
import { focusFirstInvalidField, markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { ConcardisErrorMessageType, PaymentConcardisComponent } from '../payment-concardis/payment-concardis.component';

/* eslint-disable @typescript-eslint/no-explicit-any -- allows access to concardis js functionality */
declare let PayEngine: any;

/**
 * The Payment Concardis Creditcard Component renders a form on which the user can enter his concardis credit card data. Some entry fields are provided by an external host and embedded as iframes. Therefore an external javascript is loaded. See also {@link CheckoutPaymentPageComponent}
 *
 * @example
 * <ish-payment-concardis-creditcard
 [paymentMethod]="paymentMethod"
 [activated]="i === openFormIndex"
 (submitPayment)="createNewPaymentInstrument($event)"
 (cancelPayment)="cancelNewPaymentInstrument()"
></ish-payment-concardis-creditcard>
 */
@Component({
  selector: 'ish-payment-concardis-creditcard',
  templateUrl: './payment-concardis-creditcard.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
// eslint-disable-next-line rxjs-angular/prefer-takeuntil
export class PaymentConcardisCreditcardComponent extends PaymentConcardisComponent implements OnInit {
  constructor(protected scriptLoader: ScriptLoaderService, protected cd: ChangeDetectorRef) {
    super(scriptLoader, cd);

    this.monthOptions = range(1, 13)
      .map(n => n.toString().padStart(2, '0'))
      .map(n => ({ label: n, value: n }));

    const currentYear = new Date().getFullYear();
    this.yearOptions = range(currentYear, currentYear + 7).map(n => ({
      label: n.toString(),
      value: n.toString().slice(2),
    }));
  }

  monthOptions: SelectOption[];
  yearOptions: SelectOption[];

  // visible-for-testing
  iframesReference: {
    // iframesReference, id needed by the payment host
    creditCardIframeName: string;
    verificationIframeName: string;
  };

  ngOnInit() {
    super.formInit();

    this.parameterForm.addControl(
      'expirationMonth',
      new FormControl('', [Validators.required, Validators.pattern('[0-9]{2}')])
    );
    this.parameterForm.addControl(
      'expirationYear',
      new FormControl('', [Validators.required, Validators.pattern('[0-9]{2}')])
    );
  }

  /**
   * load concardis script if component is visible
   */
  loadScript() {
    // load script only once if component becomes visible
    if (this.activated && !this.scriptLoaded) {
      const merchantId = this.getParamValue(
        'ConcardisPaymentService.MerchantID',
        'checkout.credit_card.merchantId.error.notFound'
      );
      const cardNumberStyleId = this.getParamValue(
        'ConcardisPaymentService.CreditCardStyleId',
        'checkout.credit_card.cardStyleId.error.notFound'
      );
      const cvcStyleId = this.getParamValue(
        'ConcardisPaymentService.CVCStyleId',
        'checkout.credit_card.CVCStyleId.error.notFound'
      );

      // if config params are missing - don't load script
      if (!merchantId || !cardNumberStyleId || !cvcStyleId) {
        return;
      }

      this.scriptLoaded = true;
      this.scriptLoader
        .load(this.getPayEngineURL())
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            PayEngine.setPublishableKey(merchantId);
            // render iframe input fields for card number and cvc
            PayEngine.iframesInit(
              'a_credit_card_number_container',
              'a_verification_container',
              { cardNumberStyle: cardNumberStyleId, verificationStyle: cvcStyleId },
              (err: any, val: any) => this.initCallback(err, val)
            );
          },
          error: error => {
            this.scriptLoaded = false;
            this.errorMessage.general.message = error;
            this.cd.detectChanges();
          },
        });
    }
  }

  /**
   * call back function to initialize iframes for cardNumber and cvc
   */
  // visible-for-testing
  initCallback(error: { error: string }, result: any) {
    if (error) {
      this.errorMessage.general.message = error.error;
      this.cd.detectChanges();
    } else {
      this.iframesReference = result;
    }
  }

  /**
   * call back function to submit data, get a response token from provider and send data in case of success
   */
  // visible-for-testing
  submitCallback(
    error: { message: ConcardisErrorMessageType },
    result: {
      paymentInstrumentId: string;
      attributes: { brand: string; cardNumber: string; expiryMonth: string; expiryYear: string };
    }
  ) {
    if (this.parameterForm.invalid) {
      this.formSubmitted = true;
      markAsDirtyRecursive(this.parameterForm);
      focusFirstInvalidField(this.parameterForm);
    }

    this.resetErrors();
    if (error) {
      this.mapErrorMessage(error.message);
    } else if (this.parameterForm.valid) {
      this.submitPayment.emit({
        parameters: [
          { name: 'paymentInstrumentId', value: result.paymentInstrumentId },
          { name: 'maskedCardNumber', value: result.attributes.cardNumber },
          { name: 'cardType', value: result.attributes.brand },
          { name: 'expirationDate', value: `${result.attributes.expiryMonth}/${result.attributes.expiryYear}` },
          { name: 'cvcLastUpdated', value: new Date().toISOString() },
          { name: 'token', value: result.paymentInstrumentId },
        ],
        saveAllowed: this.paymentMethod.saveAllowed && this.parameterForm.get('saveForLater').value,
      });
    }
    this.cd.detectChanges();
  }

  /**
   * submit concardis payment form
   */
  submitNewPaymentInstrument() {
    const paymentData = {
      expiryMonth: this.parameterForm.controls.expirationMonth.value,
      expiryYear: this.parameterForm.controls.expirationYear.value,
    };
    // eslint-disable-next-line unicorn/no-null
    PayEngine.iframesCreatePaymentInstrument(this.iframesReference, paymentData, null, (err: any, val: any) =>
      this.submitCallback(err, val)
    );
  }

  // map call back error message to component messages
  private mapErrorMessage(errorMessage: ConcardisErrorMessageType) {
    if (typeof errorMessage !== 'string' && errorMessage.properties) {
      this.errorMessage.cardNumber = errorMessage.properties?.find(prop => prop.key === 'cardNumber');
      if (this.errorMessage.cardNumber?.code) {
        this.errorMessage.cardNumber.messageKey = this.getErrorMessage(
          this.errorMessage.cardNumber.code,
          'credit_card',
          'number',
          this.errorMessage.cardNumber.message
        );
      }

      this.errorMessage.cvc = errorMessage.properties?.find(prop => prop.key === 'verification');
      if (this.errorMessage.cvc?.code) {
        this.errorMessage.cvc.messageKey = this.getErrorMessage(
          this.errorMessage.cvc.code,
          'credit_card',
          'cvc',
          this.errorMessage.cvc.message
        );
      }

      if (!this.parameterForm.invalid) {
        this.errorMessage.expiryMonth = errorMessage.properties?.find(prop => prop.key === 'expiryMonth');
        if (this.errorMessage.expiryMonth?.code) {
          this.errorMessage.expiryMonth.messageKey = this.getErrorMessage(
            this.errorMessage.expiryMonth.code,
            'credit_card',
            'expiryMonth',
            this.errorMessage.expiryMonth.message
          );
        }
      }
    } else if (typeof errorMessage === 'string') {
      this.errorMessage.general.message = errorMessage;
    }
  }
}
