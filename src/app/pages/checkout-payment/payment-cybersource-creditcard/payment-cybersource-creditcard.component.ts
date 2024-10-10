import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { range } from 'lodash-es';

import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { SelectOption } from 'ish-core/models/select-option/select-option.model';
import { ScriptLoaderService } from 'ish-core/utils/script-loader/script-loader.service';
import { focusFirstInvalidField, markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

/* eslint-disable @typescript-eslint/no-explicit-any -- allows access to cybersource js functionality */
declare let Flex: any;

@Component({
  selector: 'ish-payment-cybersource-creditcard',
  templateUrl: './payment-cybersource-creditcard.component.html',
  styleUrls: ['./payment-cybersource-creditcard.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PaymentCybersourceCreditcardComponent implements OnChanges, OnInit {
  cyberSourceCreditCardForm: FormGroup;

  constructor(protected scriptLoader: ScriptLoaderService, protected cd: ChangeDetectorRef) {
    this.monthOptions = range(1, 13)
      .map(n => n.toString().padStart(2, '0'))
      .map(n => ({ label: n, value: n }));

    const currentYear = new Date().getFullYear();
    this.yearOptions = range(currentYear, currentYear + 7).map(n => ({
      label: n.toString(),
      value: n.toString(),
    }));
  }

  monthOptions: SelectOption[];
  yearOptions: SelectOption[];

  /**
   * cybersource payment method, needed to get configuration parameters
   */
  @Input({ required: true }) paymentMethod: PaymentMethod;

  /**
   * should be set to true by the parent, if component is visible
   */
  @Input() activated = false;

  @Output() cancelPayment = new EventEmitter<void>();
  @Output() submitPayment = new EventEmitter<{ parameters: Attribute<string>[]; saveAllowed: boolean }>();

  private destroyRef = inject(DestroyRef);

  private microform: any;

  // visible-for-testing
  expirationMonthVal: string;
  // visible-for-testing
  expirationYearVal: string;

  /**
   * error messages from host
   */
  errorMessage = {
    general: { message: '' },
    number: { message: '' },
    securityCode: { message: '' },
  };

  ngOnInit() {
    this.cyberSourceCreditCardForm = new FormGroup({});
    this.cyberSourceCreditCardForm.addControl(
      'expirationMonth',
      new FormControl('', [Validators.required, Validators.pattern('[0-9]{2}')])
    );
    this.cyberSourceCreditCardForm.addControl(
      'expirationYear',
      new FormControl('', [Validators.required, Validators.pattern('[0-9]{4}')])
    );
  }

  /**
   * load concardis script if component is shown
   */
  ngOnChanges() {
    if (this.paymentMethod) {
      this.loadScript();
    }
  }

  /**
   * gets a parameter value from payment method
   * sets the general error message (key) if the parameter is not available
   */
  private getParamValue(name: string, errorMessage: string): string {
    const parameter = this.paymentMethod.hostedPaymentPageParameters.find(param => param.name === name);
    if (!parameter?.value) {
      this.errorMessage.general.message = errorMessage;
      return;
    }
    return parameter.value;
  }

  private loadScript() {
    // spell-checker: words flexkey
    // load script only once if component becomes visible
    if (this.activated) {
      const flexkeyId = this.getParamValue('flexkeyId', 'checkout.credit_card.flexkeyId.error.notFound');

      this.scriptLoader
        .load('https://flex.cybersource.com/cybersource/assets/microform/0.11/flex-microform.min.js')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          // the capture context that was requested server-side for this transaction
          const captureContext = flexkeyId;

          // setup
          const flex = new Flex(captureContext);
          this.microform = flex.microform();
          const cardNumber = this.microform.createField('number');
          const securityCode = this.microform.createField('securityCode');

          cardNumber.load('#number-container');
          securityCode.load('#securityCode-container');
        });
    }
  }

  // visible-for-testing
  submitCallback(error: { details: { location: string; message: string }[] }, token: string) {
    this.resetErrors();

    if (error) {
      // handling error
      for (const detail of error.details) {
        switch (detail.location) {
          case 'number': {
            this.errorMessage.number.message = 'checkout.credit_card.number.error.invalid';
            break;
          }
          case 'securityCode': {
            this.errorMessage.securityCode.message = 'checkout.credit_card.cvc.error.invalid';
            break;
          }
          case 'expirationMonth': {
            this.cyberSourceCreditCardForm.controls.expirationMonth.setErrors({
              customError: 'checkout.credit_card.expiryMonth.error.invalid',
            });
            break;
          }
          case 'expirationYear': {
            this.cyberSourceCreditCardForm.controls.expirationYear.setErrors({
              customError: 'checkout.credit_card.expiryMonth.error.invalid',
            });
            break;
          }
        }
      }
    } else if (!this.cyberSourceCreditCardForm.invalid) {
      const tokenSplit = token.split('.');
      const payloadJson: {
        data: { number: string; type: string; expirationMonth: string; expirationYear: string };
        iss: string;
        exp: string;
        iat: string;
        jti: string;
      } = JSON.parse(window.atob(tokenSplit[1]));

      this.submitPayment.emit({
        parameters: [
          { name: 'token', value: token },
          { name: 'tokenExpiryTime', value: payloadJson.exp },
          { name: 'cardType', value: payloadJson.data.type },
          { name: 'maskedCardNumber', value: payloadJson.data.number },
          { name: 'expirationDate', value: `${this.expirationMonthVal}/${this.expirationYearVal}` },
        ],
        saveAllowed: this.paymentMethod.saveAllowed && this.cyberSourceCreditCardForm.get('saveForLater').value,
      });
    }
    this.cd.detectChanges();
  }

  private resetErrors() {
    this.errorMessage.general.message = undefined;
    this.errorMessage.number.message = undefined;
    this.errorMessage.securityCode.message = undefined;
  }

  /**
   * submit cybersource payment form
   */
  submitNewPaymentInstrument() {
    if (this.cyberSourceCreditCardForm.invalid) {
      markAsDirtyRecursive(this.cyberSourceCreditCardForm);
      focusFirstInvalidField(this.cyberSourceCreditCardForm);
    } else {
      this.expirationMonthVal = this.cyberSourceCreditCardForm.controls.expirationMonth.value;
      this.expirationYearVal = this.cyberSourceCreditCardForm.controls.expirationYear.value;

      const options = {
        expirationMonth: this.expirationMonthVal,
        expirationYear: this.expirationYearVal,
      };

      this.microform.createToken(options, (error: any, token: any) => this.submitCallback(error, token));
    }
  }

  /**
   * cancel new payment instrument, hides and resets the parameter form
   */
  cancelNewPaymentInstrument() {
    this.resetErrors();
    this.cyberSourceCreditCardForm.reset();
    if (this.cyberSourceCreditCardForm.get('saveForLater')) {
      this.cyberSourceCreditCardForm.get('saveForLater').setValue(true);
    }
    this.cancelPayment.emit();
  }
}
