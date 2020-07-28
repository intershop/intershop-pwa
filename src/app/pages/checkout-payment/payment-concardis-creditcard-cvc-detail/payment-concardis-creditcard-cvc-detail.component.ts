import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { ScriptLoaderService } from 'ish-core/utils/script-loader/script-loader.service';

import { PaymentConcardisComponent } from '../payment-concardis/payment-concardis.component';

// allows access to concardis js functionality
// tslint:disable-next-line:no-any
declare var PayEngine: any;

@Component({
  selector: 'ish-payment-concardis-creditcard-cvc-detail',
  templateUrl: './payment-concardis-creditcard-cvc-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentConcardisCreditcardCvcDetailComponent extends PaymentConcardisComponent implements OnInit {
  @Input() paymentInstrument: PaymentInstrument;
  validityTimeInMinutes: string;

  constructor(protected scriptLoader: ScriptLoaderService, protected cd: ChangeDetectorRef) {
    super(scriptLoader, cd);
  }

  ngOnInit() {
    super.formInit();
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
      this.validityTimeInMinutes = this.getParamValue(
        'intershop.payment.Concardis_CreditCard.cvcmaxage',
        'checkout.credit_card.validityTime.error.notFound'
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
  }

  isCvcExpired() {
    // if cvc last updated timestamp is less than 25 minutes then return false
    if (this.paymentInstrument.parameters) {
      const cvcLastUpdatedAttr =
        this.paymentInstrument.parameters &&
        this.paymentInstrument.parameters.find(attribute => attribute.name === 'cvcLastUpdated');

      if (cvcLastUpdatedAttr) {
        const cvcLastUpdatedValue = cvcLastUpdatedAttr.value ? cvcLastUpdatedAttr.value.toString() : undefined;
        if (cvcLastUpdatedValue) {
          const cvcDate = new Date(cvcLastUpdatedValue);
          const currentDate = new Date();
          const diffAsMinutes = (currentDate.getTime() - cvcDate.getTime()) / (1000 * 60);
          if (diffAsMinutes <= parseInt(this.validityTimeInMinutes)) {
            return false;
          }
        }
      }
    }
    return true;
  }

  /**
   * call back function to submit data
   */
  submitCallback(error) {
    if (error) {
      console.log(error);
      // map error messages
      if (typeof error.message !== 'string' && error.message.properties) {
        this.errorMessage.cvc =
          error.message.properties && error.message.properties.find(prop => prop.key === 'verification');
        if (this.errorMessage.cvc && this.errorMessage.cvc.code) {
          this.errorMessage.cvc.messageKey = this.getErrorMessage(
            this.errorMessage.cvc.code,
            'credit_card',
            'cvc',
            this.errorMessage.cvc.message
          );
        }
      }
    } else {
      // update cvcLastUpdated to current timestamp
    }
  }

  renewCVCDetails() {
    if (this.paymentInstrument.parameters) {
      const tokenAttr =
        this.paymentInstrument.parameters &&
        this.paymentInstrument.parameters.find(attribute => attribute.name === 'token');

      if (tokenAttr) {
        const tokenValue = tokenAttr.value ? tokenAttr.value.toString() : undefined;
        if (tokenValue) {
          const cvcValue = (document.getElementById('cvcDetails_' + this.paymentInstrument.id) as HTMLInputElement)
            .value;
          PayEngine.verifyPaymentInstrument(tokenValue, cvcValue, err => this.submitCallback(err));
        }
      }
    }
  }
}
