import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';

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

  private renderer = inject(Renderer2);

  constructor(
    protected scriptLoader: ScriptLoaderService,
    protected cd: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document
  ) {}

  /**
   * payone payment method, needed to get configuration parameters
   */
  @Input({ required: true }) paymentMethod: PaymentMethod;

  /**
   * should be set to true by the parent, if component is visible
   */
  @Input() activated = false;

  @Output() cancelPayment = new EventEmitter<void>();
  @Output() submitPayment = new EventEmitter<{ parameters: Attribute<string>[]; saveAllowed: boolean }>();

  private destroyRef = inject(DestroyRef);

  /**
   * flag to make sure that the init script is executed only once
   */
  private scriptLoaded = false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private iframes: any;

  /**
   *  field for generic error message
   * */
  generalErrorMessage: string;

  ngOnInit() {
    // keep reference for payone cc component
    // eslint-disable-next-line @typescript-eslint/no-this-alias
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
  }

  private getParamValue(name: string, errorMessage: string): string {
    const parameter = this.paymentMethod.hostedPaymentPageParameters.find(param => param.name === name);
    if (!parameter?.value) {
      this.generalErrorMessage = errorMessage;
      return;
    }
    return parameter.value;
  }

  private loadScript() {
    // load script only once if component becomes visible
    if (this.activated && !this.scriptLoaded) {
      const request = JSON.parse(this.getParamValue('request', 'checkout.credit_card.config.error.notFound'));
      const config = JSON.parse(this.getParamValue('config', 'checkout.credit_card.config.error.notFound'));

      this.scriptLoaded = true;
      this.scriptLoader
        .load('https://secure.pay1.de/client-api/js/v1/payone_hosted_min.js')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          // resolve Payone localization object from language (default: en -> Payone.ClientApi.Language.en)
          let langCode = this.getParamValue('languageCode', '');

          // fallback to old parameter (have value like 'Payone.ClientApi.Language.en') and extract language code from it
          if (!langCode) {
            const lang = this.getParamValue('language', '');
            const langParts = lang.split('.');
            langCode = langParts.length > 1 ? langParts[langParts.length - 1] : 'en';
          }

          config.language = Payone.ClientApi.Language[langCode] || Payone.ClientApi.Language.en;

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

    this.renderer.setProperty(this.document.getElementById('error'), 'innerHTML', '');

    if (this.iframes.isComplete()) {
      // Perform "CreditCardCheck" to create and get a PseudoCardPan; then call your function "payCallback"
      this.iframes.creditCardCheck('payoneCreditCardCallback');
    } else {
      // set general error message for incomplete form
      this.generalErrorMessage = 'checkout.payment.form.incomplete';
    }
  }

  // visible-for-testing
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
