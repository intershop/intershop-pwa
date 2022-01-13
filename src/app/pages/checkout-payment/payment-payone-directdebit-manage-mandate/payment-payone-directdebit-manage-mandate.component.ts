import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { ScriptLoaderService } from 'ish-core/utils/script-loader/script-loader.service';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

// allows access to Payone js functionality
// tslint:disable-next-line:no-any
declare var PayoneRequest: any;

@Component({
  selector: 'ish-payment-payone-directdebit-manage-mandate',
  templateUrl: './payment-payone-directdebit-manage-mandate.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PaymentPayoneDirectdebitManageMandateComponent implements OnChanges, OnDestroy, OnInit {
  @Input() paymentInstrument: PaymentInstrument;
  @Input() paymentMethod: PaymentMethod;

  payoneManageMandateForm: FormGroup;
  mandateText = '';
  mandateId = '';
  mandateError = false;
  constructor(protected scriptLoader: ScriptLoaderService, protected cd: ChangeDetectorRef) {}

  private destroy$ = new Subject();
  /**
   * flag to make sure that the init script is executed only once
   */
  scriptLoaded = false;

  /**
   * initialize parameter form on init
   */
  ngOnInit() {
    this.payoneManageMandateForm = new FormGroup({});
    this.payoneManageMandateForm.addControl(
      'acceptMandate',
      new FormControl('', [Validators.required, Validators.pattern('true')])
    );

    const thisComp = this;
    // register helper function to call the callback function of this component
    // tslint:disable-next-line:no-string-literal only-arrow-functions no-any
    (window as any)['processMandateResponse'] = function (response: any) {
      thisComp.mandateResponseCallback(response);
    };
  }

  /**
   * load payone script if component is shown
   */
  ngOnChanges() {
    if (this.paymentMethod) {
      this.mandateError = false;

      // tslint:disable-next-line: no-commented-out-code
      // this.loadScript();
      this.manageMandate();
    }
  }

  ngOnDestroy() {
    // unregister helper function again
    // tslint:disable-next-line:no-string-literal no-any
    (window as any)['processMandateResponse'] = undefined;

    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * gets a parameter value from payment method
   * sets the general error message (key) if the parameter is not available
   */
  protected getParamValue(name: string, errorMessage: string): string {
    const parameter = this.paymentMethod.hostedPaymentPageParameters?.find(param => param.name === name);
    if (!parameter || !parameter.value) {
      this.payoneManageMandateForm.controls.error.setValue(errorMessage);
      return;
    }
    return parameter.value;
  }

  manageMandate() {
    // calling Payone client API for manage mandate
    if (this.paymentInstrument.parameters?.find(attribute => attribute.name === 'IBAN')) {
      const ibanAttr = this.paymentInstrument.parameters.find(attribute => attribute.name === 'IBAN');

      const ibanValue = ibanAttr.value ? ibanAttr.value.toString() : undefined;
      if (ibanValue) {
        const data = JSON.parse(this.getParamValue('request', ''));
        data.iban = ibanValue;
        const options = {
          return_type: 'object',
          callback_function_name: 'processMandateResponse',
        };

        this.scriptLoader
          .load('https://secure.pay1.de/client-api/js/ajax.js')
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            const request = new PayoneRequest(data, options);
            request.checkAndStore();
          });
      }
    }
  }

  // tslint:disable-next-line: no-any
  mandateResponseCallback(response: any) {
    // tslint:disable-next-line: no-console
    console.log(response);

    if (response.get('status') === 'APPROVED') {
      this.mandateId = response.get('mandate_identification');
      if (response.get('mandate_status') === 'pending') {
        // TODO: set checkbox label as mandateText and show checkbox to accept mandate
        this.mandateText = response.get('mandate_text');
        // tslint:disable-next-line: no-commented-out-code
        // this.cd.detectChanges();
        // tslint:disable-next-line: no-console
        console.log(this.mandateId + decodeURI(this.mandateText));
      }
    } else {
      this.mandateId = undefined;
      this.mandateError = true;
      markAsDirtyRecursive(this.payoneManageMandateForm);
    }
    this.cd.markForCheck();
  }
}
