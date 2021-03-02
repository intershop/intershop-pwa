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
import { FormControl, FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { Subject } from 'rxjs';

import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { ScriptLoaderService } from 'ish-core/utils/script-loader/script-loader.service';

@Component({
  selector: 'ish-payment-concardis',
  template: ' ',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PaymentConcardisComponent implements OnInit, OnChanges, OnDestroy {
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
  @Output() submit = new EventEmitter<{ parameters: Attribute<string>[]; saveAllowed: boolean }>();

  /**
   * flag to make sure that the init script is executed only once
   */
  scriptLoaded = false;

  /**
   * flag for displaying error messages after form submit
   */
  formSubmitted = false;

  /**
   * form for parameters which don't come form payment host
   */
  fieldConfig: FormlyFieldConfig[];
  parameterForm: FormGroup;
  model = {};
  options: FormlyFormOptions = {};

  /**
   * error messages from host
   */
  errorMessage = {
    general: { message: '' },
    iban: { messageKey: '', message: '', code: 0 },
    bic: { messageKey: '', message: '', code: 0 },
    accountholder: { messageKey: '', message: '', code: 0 },
    cardNumber: { messageKey: '', message: '', code: 0 },
    cvc: { messageKey: '', message: '', code: 0 },
    expiryMonth: { messageKey: '', message: '', code: 0 },
  };

  // tslint:disable-next-line: private-destroy-field
  protected destroy$ = new Subject();

  getPayEngineURL() {
    return this.getParamValue('ConcardisPaymentService.Environment', '') === 'LIVE'
      ? 'https://pp.payengine.de/bridge/1.0/payengine.min.js'
      : 'https://pptest.payengine.de/bridge/1.0/payengine.min.js';
  }

  /**
   * initialize parameter form on init
   */
  ngOnInit() {
    this.formInit();
  }

  formInit() {
    this.parameterForm = new FormGroup({
      saveForLater: new FormControl(true),
    });
  }

  /**
   * load concardis script if component is shown
   */
  ngOnChanges() {
    if (this.paymentMethod) {
      this.loadScript();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  // tslint:disable-next-line:no-empty
  loadScript() {}

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

  /**
   * determine errorMessages on the basis of the error code
   */
  getErrorMessage(code: number, paymentMethod: string, fieldType: string, defaultMessage: string): string {
    let messageKey: string;

    switch (code) {
      case 4121: {
        messageKey = `checkout.${paymentMethod}.${fieldType}.error.default`;
        break;
      }
      case 4122: {
        messageKey = `checkout.${paymentMethod}.${fieldType}.error.default`;
        break;
      }
      case 4123: {
        messageKey = `checkout.${paymentMethod}.${fieldType}.error.notNumber`;
        break;
      }
      case 4124: {
        messageKey = `checkout.${paymentMethod}.${fieldType}.error.notAlphanumeric`;
        break;
      }
      case 4126: {
        messageKey = `checkout.${paymentMethod}.${fieldType}.error.length`;
        break;
      }
      case 4127: {
        messageKey = `checkout.${paymentMethod}.${fieldType}.error.invalid`;
        break;
      }
      case 4128: {
        messageKey = `checkout.${paymentMethod}.${fieldType}.error.length`;
        break;
      }
      case 4129: {
        messageKey = `checkout.${paymentMethod}.${fieldType}.error.invalid`;
        break;
      }
      case 41213: {
        messageKey = `checkout.${paymentMethod}.${fieldType}.error.countryNotSupported`;
        break;
      }
      case 41214: {
        messageKey = `checkout.${paymentMethod}.${fieldType}.error.length`;
        break;
      }
      case 41215: {
        messageKey = `checkout.${paymentMethod}.${fieldType}.error.invalid`;
        break;
      }
      case 41216: {
        messageKey = `checkout.${paymentMethod}.${fieldType}.error.length`;
        break;
      }
      case 41217: {
        messageKey = `checkout.${paymentMethod}.${fieldType}.error.countryNotSupported`;
        break;
      }
      default: {
        messageKey = defaultMessage;
        break;
      }
    }

    return messageKey;
  }

  /**
   * reset errorMessages
   */
  resetErrors() {
    this.errorMessage.general.message = undefined;
    if (this.errorMessage.accountholder) {
      this.errorMessage.accountholder.message = undefined;
      this.errorMessage.accountholder.messageKey = undefined;
      this.errorMessage.accountholder.code = undefined;
    }
    if (this.errorMessage.iban) {
      this.errorMessage.iban.message = undefined;
      this.errorMessage.iban.messageKey = undefined;
      this.errorMessage.iban.code = undefined;
    }
    if (this.errorMessage.bic) {
      this.errorMessage.bic.message = undefined;
      this.errorMessage.bic.messageKey = undefined;
      this.errorMessage.bic.code = undefined;
    }
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
   * cancel new payment instrument, hides and resets the parameter form
   */
  cancelNewPaymentInstrument() {
    this.parameterForm.reset();
    if (this.parameterForm.get('saveForLater')) {
      this.parameterForm.get('saveForLater').setValue(true);
    }
    this.resetErrors();
    this.cancel.emit();
  }
}
