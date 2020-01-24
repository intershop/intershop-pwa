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
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { ScriptLoaderService } from 'ish-core/utils/script-loader/script-loader.service';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

// allows access to concardis js functionality
// tslint:disable-next-line:no-any
declare var PayEngine: any;

/**
 * The Payment Concardis Creditcard Component renders a form on which the user can enter his concardis credit card data. Some entry fields are provided by an external host and embedded as iframes. Therefore an external javascript is loaded. See also {@link CheckoutPaymentPageComponent}
 *
 * @example
 * <ish-payment-concardis-creditcard
 [paymentMethod]="paymentMethod"
 [activated]="i === openFormIndex"
 (submit)="createNewPaymentInstrument($event)"
 (cancel)="cancelNewPaymentInstrument()"
></ish-payment-concardis-creditcard>
 */
@Component({
  selector: 'ish-payment-concardis-creditcard',
  templateUrl: './payment-concardis-creditcard.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
// tslint:disable-next-line:ccp-no-intelligence-in-components
export class PaymentConcardisCreditcardComponent implements OnInit, OnChanges, OnDestroy {
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

  scriptLoaded = false; // flag to make sure that the init script is executed only once
  formSubmitted = false; // flag for displaying error messages after form submit

  parameterForm: FormGroup; // form for parameters which doesnt come form payment host

  iframesReference: {
    // iframesReference, id needed by the payment host
    creditCardIframeName: string;
    verificationIframeName: string;
  };

  // error messages from host
  errorMessage = {
    general: { message: '' },
    cardNumber: { messageKey: '', message: '', code: 0 },
    cvc: { messageKey: '', message: '', code: 0 },
    expiryMonth: { messageKey: '', message: '', code: 0 },
  };

  private destroy$ = new Subject();

  constructor(private scriptLoader: ScriptLoaderService, private cd: ChangeDetectorRef) {}

  /**
   * initialize parameter form on init
   */
  ngOnInit() {
    this.parameterForm = new FormGroup({
      expirationMonth: new FormControl('', [Validators.required, Validators.pattern('[0-9]{2}')]),
      expirationYear: new FormControl('', [Validators.required, Validators.pattern('[0-9]{2}')]),
      saveForLater: new FormControl(true),
    });
  }

  /* ---------------------------------------- load concardis script if component is visible ------------------------------------------- */

  /**
   * load concardis script if component is shown
   */
  ngOnChanges() {
    if (this.paymentMethod) {
      this.loadScript();
    }
  }

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

      const url =
        this.getParamValue('ConcardisPaymentService.Environment', '') === 'LIVE'
          ? 'https://pp.payengine.de/bridge/1.0/payengine.min.js'
          : 'https://pptest.payengine.de/bridge/1.0/payengine.min.js';

      this.scriptLoaded = true;
      this.scriptLoader
        .load(url)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          () => {
            PayEngine.setPublishableKey(merchantId);
            // render iframe input fields for card number and cvc
            PayEngine.iframesInit(
              'a_credit_card_number_container',
              'a_verification_container',
              { cardNumberStyle: cardNumberStyleId, verificationStyle: cvcStyleId },
              (err, val) => this.initCallback(err, val)
            );
          },
          error => {
            this.scriptLoaded = false;
            this.errorMessage.general.message = error;
            this.cd.detectChanges();
          }
        );
    }
  }

  /**
   * gets a parameter value from payment method
   * sets the general error message (key) if the parameter is not available
   */
  private getParamValue(name: string, errorMessage: string): string {
    const parameter = this.paymentMethod.hostedPaymentPageParameters.find(param => param.name === name);
    if (!parameter || !parameter.value) {
      this.errorMessage.general.message = errorMessage;
      return;
    }
    return parameter.value;
  }

  /* ---------------------------------------- concardis callback functions  ------------------------------------------- */

  /**
   * call back function to initialize iframes for cardNumber and cvc
   */
  initCallback(error: { error: string }, result) {
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
  submitCallback(
    error: { message: { properties: { key: string; code: number; message: string; messageKey: string }[] } | string },
    result: {
      paymentInstrumentId: string;
      attributes: { brand: string; cardNumber: string; expiryMonth: string; expiryYear: string };
    }
  ) {
    if (this.parameterForm.invalid) {
      this.formSubmitted = true;
      markAsDirtyRecursive(this.parameterForm);
    }

    this.resetErrors();
    if (error) {
      // map error messages
      if (typeof error.message !== 'string' && error.message.properties) {
        this.errorMessage.cardNumber =
          error.message.properties && error.message.properties.find(prop => prop.key === 'cardNumber');
        if (this.errorMessage.cardNumber && this.errorMessage.cardNumber.code) {
          this.errorMessage.cardNumber.messageKey = this.getErrorMessage(
            this.errorMessage.cardNumber.code,
            'number',
            this.errorMessage.cardNumber.message
          );
        }

        this.errorMessage.cvc =
          error.message.properties && error.message.properties.find(prop => prop.key === 'verification');
        if (this.errorMessage.cvc && this.errorMessage.cvc.code) {
          this.errorMessage.cvc.messageKey = this.getErrorMessage(
            this.errorMessage.cvc.code,
            'cvc',
            this.errorMessage.cvc.message
          );
        }

        if (!this.parameterForm.invalid) {
          this.errorMessage.expiryMonth =
            error.message.properties && error.message.properties.find(prop => prop.key === 'expiryMonth');
          if (this.errorMessage.expiryMonth && this.errorMessage.expiryMonth.code) {
            this.errorMessage.expiryMonth.messageKey = this.getErrorMessage(
              this.errorMessage.expiryMonth.code,
              'expiryMonth',
              this.errorMessage.expiryMonth.message
            );
          }
        }
      } else if (typeof error.message === 'string') {
        this.errorMessage.general.message = error.message;
      }
    } else if (!this.parameterForm.invalid) {
      this.submit.emit({
        parameters: [
          { name: 'paymentInstrumentId', value: result.paymentInstrumentId },
          { name: 'maskedCardNumber', value: result.attributes.cardNumber },
          { name: 'cardType', value: result.attributes.brand },
          { name: 'expirationDate', value: `${result.attributes.expiryMonth}/${result.attributes.expiryYear}` },
        ],
        saveAllowed: this.paymentMethod.saveAllowed && this.parameterForm.get('saveForLater').value,
      });
    }
    this.cd.detectChanges();
  }

  /* ---------------------------------------- error message handling  ------------------------------------------- */

  /**
   * reset errorMessages
   */
  resetErrors() {
    this.errorMessage.general.message = undefined;
    if (this.errorMessage.cardNumber) {
      this.errorMessage.cardNumber.message = undefined;
      this.errorMessage.cardNumber.messageKey = undefined;
      this.errorMessage.cardNumber.code = undefined;
    }
    if (this.errorMessage.cvc) {
      this.errorMessage.cvc.message = undefined;
      this.errorMessage.cvc.messageKey = undefined;
      this.errorMessage.cvc.code = undefined;
    }
    if (this.errorMessage.expiryMonth) {
      this.errorMessage.expiryMonth.message = undefined;
      this.errorMessage.expiryMonth.messageKey = undefined;
      this.errorMessage.expiryMonth.code = undefined;
    }
  }

  /**
   * determine errorMessages on the basis of the error code
   */
  getErrorMessage(code: number, fieldType: string, defaultMessage: string): string {
    let messageKey: string;

    switch (code) {
      case 4121: {
        messageKey = `checkout.credit_card.${fieldType}.error.default`;
        break;
      }
      case 4122: {
        messageKey = `checkout.credit_card.${fieldType}.error.default`;
        break;
      }
      case 4123: {
        messageKey = `checkout.credit_card.${fieldType}.error.notNumber`;
        break;
      }
      case 4126: {
        messageKey = `checkout.credit_card.${fieldType}.error.length`;
        break;
      }
      case 4127: {
        messageKey = `checkout.credit_card.${fieldType}.error.invalid`;
        break;
      }
      case 4128: {
        messageKey = `checkout.credit_card.${fieldType}.error.length`;
        break;
      }

      case 4129: {
        messageKey = `checkout.credit_card.${fieldType}.error.invalid`;
        break;
      }
      default: {
        messageKey = defaultMessage;
        break;
      }
    }

    return messageKey;
  }

  /* ---------------------------------------- cancel and submit form  ------------------------------------------- */

  /**
   * cancel new payment instrument, hides and resets the parameter form
   */
  cancelNewPaymentInstrument() {
    this.parameterForm.reset();
    this.parameterForm.get('saveForLater').setValue(true);
    this.resetErrors();
    this.cancel.emit();
  }

  /**
   * submit concardis payment form
   */
  submitNewPaymentInstrument() {
    const paymentData = {
      expiryMonth: this.parameterForm.controls.expirationMonth.value,
      expiryYear: this.parameterForm.controls.expirationYear.value,
    };
    // tslint:disable-next-line:no-null-keyword
    PayEngine.iframesCreatePaymentInstrument(this.iframesReference, paymentData, null, (err, val) =>
      this.submitCallback(err, val)
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
