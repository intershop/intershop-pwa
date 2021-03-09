import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { pairwise, startWith, takeUntil } from 'rxjs/operators';

import { ScriptLoaderService } from 'ish-core/utils/script-loader/script-loader.service';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { PaymentConcardisComponent } from '../payment-concardis/payment-concardis.component';

// tslint:disable:no-any - allows access to concardis js functionality
declare var PayEngine: any;

/**
 * The Payment Concardis Directdebit Component renders a form on which the user can enter his concardis direct debit data. Some entry fields are provided by an external host and embedded as iframes. Therefore an external javascript is loaded. See also {@link CheckoutPaymentPageComponent}
 *
 * @example
 * <ish-payment-concardis-directdebit
 [paymentMethod]="paymentMethod"
 [activated]="i === openFormIndex"
 (submit)="createNewPaymentInstrument($event)"
 (cancel)="cancelNewPaymentInstrument()"
></ish-payment-concardis-directdebit>
 */
@Component({
  selector: 'ish-payment-concardis-directdebit',
  templateUrl: './payment-concardis-directdebit.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
// tslint:disable-next-line: rxjs-prefer-angular-takeuntil
export class PaymentConcardisDirectdebitComponent extends PaymentConcardisComponent implements OnInit {
  constructor(protected scriptLoader: ScriptLoaderService, protected cd: ChangeDetectorRef) {
    super(scriptLoader, cd);
  }

  options: FormlyFormOptions;

  handleErrors(controlName: string, message: string) {
    if (this.parameterForm.controls[controlName]) {
      this.options.formState = {
        ...this.options.formState,
        errors: {
          ...this.options.formState.errors,
          [controlName]: message,
        },
        changedSinceErrors: {
          ...this.options.formState.changedSinceErrors,
          [controlName]: false,
        },
      };
      this.parameterForm.controls[controlName].updateValueAndValidity();
    }
  }

  ngOnInit() {
    super.formInit();
    this.fieldConfig = this.getFieldConfig();
    this.parameterForm.valueChanges
      .pipe(startWith({}), pairwise(), takeUntil(this.destroy$))
      .subscribe(([prevValues, currentValues]) =>
        Object.keys(currentValues).forEach(key => {
          if (
            currentValues[key] !== prevValues[key] &&
            this.options.formState.changedSinceErrors?.hasOwnProperty(key)
          ) {
            this.options.formState.changedSinceErrors[key] = true;
            this.parameterForm.get(key).updateValueAndValidity();
          }
        })
      );
  }

  /* ---------------------------------------- load concardis script if component is visible ------------------------------------------- */

  loadScript() {
    // load script only once if component becomes visible
    if (this.activated && !this.scriptLoaded) {
      const merchantId = this.getParamValue(
        'ConcardisPaymentService.MerchantID',
        'checkout.payment.merchantId.error.notFould'
      );

      // if merchant Id are missing - don't load script
      if (!merchantId) {
        return;
      }

      this.scriptLoaded = true;
      this.scriptLoader
        .load(this.getPayEngineURL())
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          () => {
            PayEngine.setPublishableKey(merchantId);
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
   * hide fields without labels and enrich mandate reference and mandate text with corresponding values from hosted payment page parameters
   */
  getFieldConfig(): FormlyFieldConfig[] {
    return this.paymentMethod.parameters.map(param => (param.hide ? this.modifyParam(param) : param));
  }

  private modifyParam(p: FormlyFieldConfig): FormlyFieldConfig {
    const param = p;

    if (param.key === 'mandateReference') {
      param.defaultValue = this.getParamValue('mandateId', '');
    }

    if (param.key === 'mandateText') {
      param.type = 'ish-checkbox-field';
      param.templateOptions.fieldClass = 'offset-md-4 col-md-6';
      param.templateOptions.labelClass = '';
      param.templateOptions.label = this.getParamValue('mandateText', '');
      param.defaultValue = false;
      param.hide = false;
      param.validators = [Validators.pattern('false')];
    }
    return param;
  }

  /**
   * call back function to submit data, get a response token from provider and send data in case of success
   */
  submitCallback(
    error: { message: { properties: { key: string; code: number; message: string; messageKey: string }[] } | string },
    result: {
      paymentInstrumentId: string;
      attributes: {
        accountHolder: string;
        iban: string;
        bic: string;
        mandateReference: string;
        mandate: {
          mandateReference: string;
          createdDateTime: string;
          mandateText: string;
          directDebitType: string;
        };
        createdAt: string;
      };
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
        this.errorMessage.iban = error.message.properties && error.message.properties.find(prop => prop.key === 'iban');
        if (this.errorMessage.iban && this.errorMessage.iban.code) {
          this.errorMessage.iban.messageKey = this.getErrorMessage(
            this.errorMessage.iban.code,
            'sepa',
            'iban',
            this.errorMessage.iban.message
          );
          this.handleErrors('IBAN', this.errorMessage.iban.messageKey);
        }

        this.errorMessage.bic = error.message.properties && error.message.properties.find(prop => prop.key === 'bic');
        if (this.errorMessage.bic && this.errorMessage.bic.code) {
          this.errorMessage.bic.messageKey = this.getErrorMessage(
            this.errorMessage.bic.code,
            'sepa',
            'bic',
            this.errorMessage.bic.message
          );
          this.handleErrors('BIC', this.errorMessage.bic.messageKey);
        }

        this.errorMessage.accountholder =
          error.message.properties && error.message.properties.find(prop => prop.key === 'accountholder');
        if (this.errorMessage.accountholder && this.errorMessage.accountholder.code) {
          this.errorMessage.accountholder.messageKey = this.getErrorMessage(
            this.errorMessage.accountholder.code,
            'sepa',
            'accountholder',
            this.errorMessage.accountholder.message
          );
          this.handleErrors('accountHolder', this.errorMessage.accountholder.messageKey);
        }
      } else if (typeof error.message === 'string') {
        this.errorMessage.general.message = error.message;
      }
    } else if (!this.parameterForm.invalid) {
      this.submit.emit({
        parameters: [
          { name: 'paymentInstrumentId', value: result.paymentInstrumentId },
          { name: 'accountHolder', value: result.attributes.accountHolder },
          { name: 'IBAN', value: result.attributes.iban },
          { name: 'BIC', value: result.attributes.bic },
          { name: 'mandateReference', value: result.attributes.mandate.mandateReference },
          { name: 'mandateText', value: result.attributes.mandate.mandateText },
          { name: 'mandateCreatedDateTime', value: result.attributes.mandate.createdDateTime },
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
    if (this.parameterForm.invalid) {
      this.formSubmitted = true;
      markAsDirtyRecursive(this.parameterForm);
      return;
    }
    const parameters = Object.entries(this.parameterForm.controls)
      .filter(([, control]) => control.enabled && control.value)
      .map(([key, control]) => ({ name: key, value: control.value }));

    let directDebitType = 'SINGLE';
    if (this.paymentMethod.saveAllowed && this.parameterForm.get('saveForLater').value) {
      directDebitType = 'FIRST';
    }

    let paymentData: {
      accountHolder: string;
      bic?: string;
      iban: string;
      mandate: { mandateId: string; mandateText: string; directDebitType: string };
    } = {
      accountHolder: parameters.find(p => p.name === 'accountHolder')?.value,
      iban: parameters.find(p => p.name === 'IBAN')?.value,
      mandate: {
        mandateId: parameters.find(p => p.name === 'mandateReference')?.value,
        mandateText: this.getParamValue('mandateText', ''),
        directDebitType,
      },
    };

    if (parameters.find(p => p.name === 'BIC')) {
      paymentData = { ...paymentData, bic: parameters.find(p => p.name === 'BIC').value };
    }
    // tslint:disable-next-line:no-null-keyword
    PayEngine.createPaymentInstrument('sepa', paymentData, null, (err: any, val: any) => this.submitCallback(err, val));
  }
}
