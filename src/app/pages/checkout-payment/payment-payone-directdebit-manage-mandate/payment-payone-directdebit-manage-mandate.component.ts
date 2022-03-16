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
import { Subject, takeUntil } from 'rxjs';

import { Basket } from 'ish-core/models/basket/basket.model';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { ScriptLoaderService } from 'ish-core/utils/script-loader/script-loader.service';

@Component({
  selector: 'ish-payment-payone-directdebit-manage-mandate',
  templateUrl: './payment-payone-directdebit-manage-mandate.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PaymentPayoneDirectdebitManageMandateComponent implements OnChanges, OnDestroy, OnInit {
  @Input() paymentInstrument: PaymentInstrument;
  @Input() paymentMethod: PaymentMethod;
  @Input() basket: Basket;

  payoneManageMandateForm: FormGroup;
  mandateText = '';
  mandateId = '';
  mandateError = false;

  constructor(
    private apiService: ApiService,
    protected scriptLoader: ScriptLoaderService,
    protected cd: ChangeDetectorRef
  ) {}

  // eslint-disable-next-line ish-custom-rules/private-destroy-field
  protected destroy$ = new Subject<void>();

  /**
   * initialize parameter form on init
   */
  ngOnInit() {
    this.payoneManageMandateForm = new FormGroup({});
    this.payoneManageMandateForm.addControl(
      'acceptMandate',
      new FormControl('', [Validators.required, Validators.pattern('true')])
    );
  }

  /**
   * load payone script if component is shown
   */
  ngOnChanges() {
    if (this.paymentMethod) {
      this.mandateError = false;
      this.manageMandate();
    }
  }

  ngOnDestroy() {
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
      const paymentId = this.basket.payment.id;
      const basketId = this.basket.id;
      if (ibanValue) {
        const mandateURL = `http://localhost:81/INTERSHOP/rest/WFS/inSPIRED-inTRONICS-Site/-/payone/mandate/manage?paymentId=${paymentId}&basketId=${basketId}`;

        this.apiService
          .get<JSON>(mandateURL)
          .pipe(takeUntil(this.destroy$))
          .subscribe((response: any) => this.mandateResponseCallback(response));
      }
    }
  }

  mandateResponseCallback(response: { mandateId: string; mandateStatus: string; mandateText: string }) {
    console.log(response);
    this.mandateId = response.mandateId;
    if (response.mandateStatus === 'pending') {
      // TODO: set checkbox label as mandateText and show checkbox to accept mandate
      this.mandateText = response.mandateText;
      // this.cd.detectChanges();
      console.log(this.mandateId + decodeURI(this.mandateText));
    }
  }
}
