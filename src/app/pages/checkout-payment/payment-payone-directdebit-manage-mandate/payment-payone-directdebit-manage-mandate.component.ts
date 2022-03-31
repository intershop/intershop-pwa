import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
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
export class PaymentPayoneDirectdebitManageMandateComponent implements OnDestroy, OnInit {
  @Input() paymentInstrument: PaymentInstrument;
  @Input() paymentMethod: PaymentMethod;
  @Input() basket: Basket;

  payoneManageMandateForm: FormGroup;
  mandateText = '';
  isMandateStatusPending = true;
  paymentId = '';
  basketId = '';

  constructor(
    private apiService: ApiService,
    protected scriptLoader: ScriptLoaderService,
    protected cd: ChangeDetectorRef,
    private checkoutFacade: CheckoutFacade
  ) {}

  // eslint-disable-next-line ish-custom-rules/private-destroy-field
  protected destroy$ = new Subject<void>();

  /**
   * initialize parameter form on init
   */
  ngOnInit() {
    this.paymentId = this.basket.payment.id;
    this.basketId = this.basket.id;
    this.payoneManageMandateForm = new FormGroup({});

    this.payoneManageMandateForm.addControl(
      `AcceptSEPAMandate_${this.paymentId}`,
      new FormControl('', [Validators.required, Validators.pattern('true')])
    );

    // calling method to check mandate status.
    this.manageMandate();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * gets a parameter value from payment method.
   * sets the general error message (key) if the parameter is not available.
   */
  protected getParamValue(name: string, errorMessage: string): string {
    const parameter = this.paymentMethod.hostedPaymentPageParameters?.find(param => param.name === name);
    if (!parameter || !parameter.value) {
      this.payoneManageMandateForm.controls.error.setValue(errorMessage);
      return;
    }
    return parameter.value;
  }

  /**
   * This method is to call ICM Payone REST endpoint to manage mandate.
   */
  manageMandate() {
    // TODO: create url dynamically and replace localhost hard coded. Passing paymentId and BasketId parameters.
    const mandateURL = `http://localhost:81/INTERSHOP/rest/WFS/inSPIRED-inTRONICS-Site/-/payone/mandate/manage?paymentId=${this.paymentId}&basketId=${this.basketId}`;

    // TODO: make facade to call api service.
    this.apiService
      .get<{ mandateId: string; mandateStatus: string; mandateText: string }>(mandateURL)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: { mandateId: string; mandateStatus: string; mandateText: string }) =>
        this.mandateResponseCallback(response)
      );
  }

  /**
   * This method is to process response from manage mandate rest api.
   */
  mandateResponseCallback(response: { mandateId: string; mandateStatus: string; mandateText: string }) {
    // setting mandate text when mandate status is pending.
    if (response.mandateStatus === 'pending') {
      this.isMandateStatusPending = true;
      this.mandateText = response.mandateText;
      this.cd.detectChanges();
    }
    // showing download link when mandate state is active.
    if (response.mandateStatus === 'active') {
      this.isMandateStatusPending = false;
      this.cd.detectChanges();
    }
  }

  /**
   * This method is to call ICM Payone REST endpoint for download mandate.
   * This is called on click of download link.
   */
  downloadMandate() {
    // TODO: create url dynamically and replace localhost hard coded. Passing paymentId and BasketId parameters.
    const mandateURL = `http://localhost:81/INTERSHOP/rest/WFS/inSPIRED-inTRONICS-Site/-/payone/mandate/download?paymentId=${this.paymentId}&basketId=${this.basketId}`;

    // TODO: make facade to call api service. Also find way to handle pdf format response.
    this.apiService
      .get<'arraybuffer'>(mandateURL)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: 'arraybuffer') => {
        var file = new Blob([data], { type: 'application/pdf' });
        var fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      });
  }

  /**
   * this method is to set basket custom attribute on click of accept mandate checkbox.
   */
  onCheckChange(event: any) {
    // this is true when checkbox is checked.
    if (event.target.checked) {
      // TODO: checked state of checkbox is lost after page gets refreshed due this call.
      // set basket custom attribute on check of accept mandate checkbox.
      this.checkoutFacade.setBasketCustomAttribute({
        name: `AcceptSEPAMandate_${this.paymentId}`,
        value: 'on',
      });
    } else {
      // delete basket custom attribute on uncheck of accept mandate checkbox.
      this.checkoutFacade.deleteBasketCustomAttribute(`AcceptSEPAMandate_${this.paymentId}`);
    }
  }
}
