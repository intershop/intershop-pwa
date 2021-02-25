import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { ScriptLoaderService } from 'ish-core/utils/script-loader/script-loader.service';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { PaymentConcardisComponent } from '../payment-concardis/payment-concardis.component';

// tslint:disable:no-any - allows access to concardis js functionality
declare var PayEngine: any;

@Component({
  selector: 'ish-payment-concardis-creditcard-cvc-detail',
  templateUrl: './payment-concardis-creditcard-cvc-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line: rxjs-prefer-angular-takeuntil
export class PaymentConcardisCreditcardCvcDetailComponent extends PaymentConcardisComponent implements OnInit {
  @Input() paymentInstrument: PaymentInstrument;

  validityTimeInMinutes: string;
  cvcDetailForm: FormGroup;

  constructor(
    protected scriptLoader: ScriptLoaderService,
    protected cd: ChangeDetectorRef,
    private checkoutFacade: CheckoutFacade
  ) {
    super(scriptLoader, cd);
    this.cvcDetailForm = new FormGroup({
      cvcDetail: new FormControl(undefined, [Validators.required]),
    });
  }

  /**
   * load concardis script if component is visible
   */
  loadScript() {
    // load script only once if component becomes visible
    if (!this.scriptLoaded) {
      const merchantId = this.getParamValue(
        'ConcardisPaymentService.MerchantID',
        'checkout.credit_card.merchantId.error.notFound'
      );
      // if config params are missing - don't load script
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
    this.validityTimeInMinutes = this.getParamValue(
      'intershop.payment.Concardis_CreditCard.cvcmaxage',
      'checkout.credit_card.validityTime.error.notFound'
    );
  }

  isCvcExpired() {
    let isExpired = true;
    // if cvc last updated timestamp is less than maximum validity in minutes then return false
    if (this.paymentInstrument.parameters) {
      const cvcLastUpdatedAttr =
        this.paymentInstrument.parameters &&
        this.paymentInstrument.parameters.find(attribute => attribute.name === 'cvcLastUpdated');

      if (cvcLastUpdatedAttr) {
        const cvcLastUpdatedValue = cvcLastUpdatedAttr.value ? cvcLastUpdatedAttr.value.toString() : undefined;
        if (cvcLastUpdatedValue) {
          const cvcDate = new Date(cvcLastUpdatedValue);
          const diffAsMinutes = (Date.now() - cvcDate.getTime()) / (1000 * 60);
          if (diffAsMinutes <= parseInt(this.validityTimeInMinutes, 10)) {
            isExpired = false;
          }
        }
      }
    }
    return isExpired;
  }

  /**
   * call back function to submit data
   */
  submitCallback(error: any) {
    if (error) {
      // map error messages
      if (typeof error.message !== 'string' && error.message.properties) {
        this.errorMessage.cvc =
          error.message.properties && error.message.properties.find((prop: any) => prop.key === 'verification');
        if (this.errorMessage.cvc && this.errorMessage.cvc.code) {
          this.errorMessage.cvc.messageKey = this.getErrorMessage(
            this.errorMessage.cvc.code,
            'credit_card',
            'cvc',
            this.errorMessage.cvc.message
          );
          this.cvcDetailForm.get('cvcDetail').setErrors({
            customError: this.errorMessage.cvc.messageKey,
          });
        }
      }
    } else {
      // update cvcLastUpdated to current timestamp
      const param =
        this.paymentInstrument.parameters &&
        this.paymentInstrument.parameters.map(attr => ({ name: attr.name, value: attr.value }));
      if (param.find(attribute => attribute.name === 'cvcLastUpdated')) {
        param.find(attribute => attribute.name === 'cvcLastUpdated').value = new Date().toISOString();
      } else {
        param.push({ name: 'cvcLastUpdated', value: new Date().toISOString() });
      }
      // TODO: Replacing encoded paymentInstrumentId with Token for put request
      param.find(attribute => attribute.name === 'paymentInstrumentId').value = this.paymentInstrument.parameters.find(
        attribute => attribute.name === 'token'
      ).value;
      const pi: PaymentInstrument = {
        id: this.paymentInstrument.id,
        urn: this.paymentInstrument.urn,
        accountIdentifier: this.paymentInstrument.accountIdentifier,
        parameters: param,
        paymentMethod: this.paymentInstrument.paymentMethod,
      };

      this.checkoutFacade.updateConcardisCvcLastUpdated(pi);
    }
  }

  renewCVCDetails() {
    if (this.paymentInstrument.parameters?.find(attribute => attribute.name === 'token')) {
      const tokenAttr = this.paymentInstrument.parameters.find(attribute => attribute.name === 'token');

      const tokenValue = tokenAttr.value ? tokenAttr.value.toString() : undefined;
      if (tokenValue) {
        const cvcValue = this.cvcDetailForm.get('cvcDetail').value;
        if (cvcValue) {
          PayEngine.verifyPaymentInstrument(tokenValue, cvcValue, (err: unknown) => this.submitCallback(err));
        } else {
          this.cvcDetailForm.get('cvcDetail').setErrors({ required: true });
          markAsDirtyRecursive(this.cvcDetailForm);
        }
      }
    }
  }
}
