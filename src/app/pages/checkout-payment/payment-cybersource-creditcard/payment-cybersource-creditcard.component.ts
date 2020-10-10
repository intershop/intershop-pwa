import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import b64u from 'b64u';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { ScriptLoaderService } from 'ish-core/utils/script-loader/script-loader.service';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

// allows access to concardis js functionality
// tslint:disable-next-line:no-any
declare var Flex: any;

@Component({
  selector: 'ish-payment-cybersource-creditcard',
  templateUrl: './payment-cybersource-creditcard.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PaymentCybersourceCreditcardComponent implements OnChanges, OnDestroy, OnInit {
  cyberSourceCreditCardForm: FormGroup;

  constructor(protected scriptLoader: ScriptLoaderService, protected cd: ChangeDetectorRef) {}
  /**
   * concardis payment method, needed to get configuration parameters
   */
  @Input() paymentMethod: PaymentMethod;

  /**
   * should be set to true by the parent, if component is visible
   */
  @Input() activated = false;

  @Output() cancel = new EventEmitter<void>();
  @Output() submit = new EventEmitter<{ parameters: Attribute[]; saveAllowed: boolean }>();

  // tslint:disable-next-line: private-destroy-field
  protected destroy$ = new Subject();

  /**
   * flag to make sure that the init script is executed only once
   */
  scriptLoaded = false;

  // tslint:disable-next-line: no-any
  microform: any;

  expirationMonthVal: string;
  expirationYearVal: string;

  /**
   * error messages from host
   */
  errorMessage = {
    general: { message: '' },
    number: { message: '' },
    securityCode: { message: '' },
  };

  /**
   * load concardis script if component is shown
   */
  ngOnChanges() {
    if (this.paymentMethod) {
      this.loadScript();
    }
  }

  // tslint:disable-next-line: rxjs-prefer-angular-takeuntil
  ngOnDestroy() {
    this.destroy$.next();
  }

  /**
   * gets a parameter value from payment method
   * sets the general error message (key) if the parameter is not available
   */
  protected getParamValue(name: string, errorMessage: string): string {
    const parameter = this.paymentMethod.hostedPaymentPageParameters.find(param => param.name === name);
    if (!parameter || !parameter.value) {
      this.errorMessage.general.message = errorMessage;
      return;
    }
    return parameter.value;
  }

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

  // tslint:disable-next-line:no-empty
  loadScript() {
    // load script only once if component becomes visible
    if (this.activated) {
      const flexkeyId = this.getParamValue('flexkeyId', 'checkout.credit_card.flexkeyId.error.notFound');

      this.scriptLoaded = true;
      this.scriptLoader
        .load('https://flex.cybersource.com/cybersource/assets/microform/0.11/flex-microform.min.js')
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          // the capture context that was requested server-side for this transaction
          const captureContext = flexkeyId;

          // custom styles that will be applied to each field we create using Microform
          const myStyles = {
            input: {
              'font-size': '14px',
              'font-family': 'helvetica, tahoma, calibri, sans-serif',
              color: '#555',
            },
            ':focus': { color: 'blue' },
            ':disabled': { cursor: 'not-allowed' },
            valid: { color: '#3c763d' },
            invalid: { color: '#a94442' },
          };

          // setup
          const flex = new Flex(captureContext);
          this.microform = flex.microform({ styles: myStyles });
          const cardnumber = this.microform.createField('number', { placeholder: 'Enter card number' });
          const securityCode = this.microform.createField('securityCode', { placeholder: '•••' });

          cardnumber.load('#number-container');
          securityCode.load('#securityCode-container');
        });
    }
  }

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
      const payloadjson: {
        data: { number: string; type: string; expirationMonth: string; expirationYear: string };
        iss: string;
        exp: string;
        iat: string;
        jti: string;
      } = JSON.parse(b64u.decode(tokenSplit[1]));

      this.submit.emit({
        parameters: [
          { name: 'token', value: token },
          { name: 'tokenExpiryTime', value: payloadjson.exp },
          { name: 'cardType', value: payloadjson.data.type },
          { name: 'maskedCardNumber', value: payloadjson.data.number },
          { name: 'expirationDate', value: `${this.expirationMonthVal}/${this.expirationYearVal}` },
        ],
        saveAllowed: false,
      });
    }
    this.cd.detectChanges();
  }
  resetErrors() {
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
    } else {
      this.expirationMonthVal = this.cyberSourceCreditCardForm.controls.expirationMonth.value;
      this.expirationYearVal = this.cyberSourceCreditCardForm.controls.expirationYear.value;

      const options = {
        expirationMonth: this.expirationMonthVal,
        expirationYear: this.expirationYearVal,
      };

      this.microform.createToken(options, (error, token) => this.submitCallback(error, token));
    }
  }

  /**
   * cancel new payment instrument, hides and resets the parameter form
   */
  cancelNewPaymentInstrument() {
    this.cyberSourceCreditCardForm.reset();
    this.cancel.emit();
  }
}
