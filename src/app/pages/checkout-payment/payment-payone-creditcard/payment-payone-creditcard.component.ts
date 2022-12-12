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
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { ScriptLoaderService } from 'ish-core/utils/script-loader/script-loader.service';

// spell-checker: disable
// allows access to Payone js functionality
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let Payone: any;

@Component({
  selector: 'ish-payment-payone-creditcard',
  templateUrl: './payment-payone-creditcard.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PaymentPayoneCreditcardComponent implements OnChanges, OnDestroy, OnInit {
  payoneCreditCardForm = new FormGroup({});

  constructor(protected scriptLoader: ScriptLoaderService, protected cd: ChangeDetectorRef) {}

  /**
   * payone payment method, needed to get configuration parameters
   */
  @Input() paymentMethod: PaymentMethod;

  /**
   * should be set to true by the parent, if component is visible
   */
  @Input() activated = false;

  @Output() cancelPayment = new EventEmitter<void>();
  @Output() submitPayment = new EventEmitter<{ parameters: Attribute<string>[]; saveAllowed: boolean }>();

  private destroy$ = new Subject<void>();

  /**
   * flag to make sure that the init script is executed only once
   */
  scriptLoaded = false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  iframes: any;

  /**
   *  field for generic error message
   * */
  generalErrorMessage: string;

  ngOnInit() {
    // keep reference for payone cc component
    const thisComp = this;

    // register helper function to call the callback function of this component
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).payoneCreditCardCallback = function (response: {
      status: string;
      pseudocardpan: string;
      truncatedcardpan: string;
    }) {
      thisComp.submitCallback(response);
    };
  }

  /**
   * load payone script if component is shown
   */
  ngOnChanges() {
    if (this.paymentMethod) {
      this.loadScript();
    }
  }

  ngOnDestroy() {
    // unregister helper function again
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).payoneCreditCardCallback = undefined;

    this.destroy$.next();
    this.destroy$.complete();
  }

  protected getParamValue(name: string, errorMessage: string): string {
    const parameter = this.paymentMethod.hostedPaymentPageParameters.find(param => param.name === name);
    if (!parameter?.value) {
      this.generalErrorMessage = errorMessage;
      return;
    }
    return parameter.value;
  }

  loadScript() {
    // load script only once if component becomes visible
    if (this.activated && !this.scriptLoaded) {
      const request = JSON.parse(this.getParamValue('request', 'checkout.credit_card.config.error.notFound'));
      const config = JSON.parse(this.getParamValue('config', 'checkout.credit_card.config.error.notFound'));

      this.scriptLoaded = true;
      this.scriptLoader
        .load('https://secure.pay1.de/client-api/js/v1/payone_hosted_min.js')
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          // append localization language: Payone.ClientApi.Language.en, Language to display error-messages (default:Payone.ClientApi.Language.en)
          // eslint-disable-next-line no-eval
          config.language = eval(this.getParamValue('language', ''));

          // setup
          this.iframes = new Payone.ClientApi.HostedIFrames(config, request);
        });
    }
  }

  /**
   * cancel new payment instrument and hides the form
   */
  cancelNewPaymentInstrument() {
    this.cancelPayment.emit();
  }

  /**
   * submit payone payment form
   */
  submitNewPaymentInstrument() {
    // reset error message
    this.generalErrorMessage = undefined;
    document.getElementById('error').innerHTML = '';
    if (this.iframes.isComplete()) {
      // Perform "CreditCardCheck" to create and get a PseudoCardPan; then call your function "payCallback"
      this.iframes.creditCardCheck('payoneCreditCardCallback');
    } else {
      // set general error message for incomplete form
      this.generalErrorMessage = 'checkout.payment.form.incomplete';
    }
  }

  submitCallback(response: { status: string; pseudocardpan: string; truncatedcardpan: string }) {
    if (response.status === 'VALID' && !this.payoneCreditCardForm.invalid) {
      this.submitPayment.emit({
        parameters: [
          { name: 'pseudocardpan', value: response.pseudocardpan },
          { name: 'truncatedcardpan', value: response.truncatedcardpan },
        ],
        saveAllowed: this.paymentMethod.saveAllowed && this.payoneCreditCardForm.get('saveForLater').value,
      });
    }
    // else: error message is shown in the error div
    this.cd.detectChanges();
  }

  isSecurityCodeCheckRequired() {
    if (this.paymentMethod.hostedPaymentPageParameters) {
      const isSecurityCodeCheckRequired = this.paymentMethod.hostedPaymentPageParameters.find(
        param => param.name === 'isSecurityCheckCodeRequired'
      );
      if (isSecurityCodeCheckRequired && String(isSecurityCodeCheckRequired.value).toLowerCase() === 'true') {
        return true;
      }
    }
    return false;
  }
}
