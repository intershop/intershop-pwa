import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { anything, spy, verify } from 'ts-mockito';

import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { CheckboxComponent } from 'ish-shared/forms/components/checkbox/checkbox.component';
import { FormControlFeedbackComponent } from 'ish-shared/forms/components/form-control-feedback/form-control-feedback.component';
import { ShowFormFeedbackDirective } from 'ish-shared/forms/directives/show-form-feedback.directive';

import { PaymentConcardisCreditcardComponent } from './payment-concardis-creditcard.component';

describe('Payment Concardis Creditcard Component', () => {
  let component: PaymentConcardisCreditcardComponent;
  let fixture: ComponentFixture<PaymentConcardisCreditcardComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(CheckboxComponent),
        MockComponent(FaIconComponent),
        MockComponent(FormControlFeedbackComponent),
        MockComponent(NgbPopover),
        MockDirective(ShowFormFeedbackDirective),
        PaymentConcardisCreditcardComponent,
      ],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentConcardisCreditcardComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.paymentMethod = {
      id: 'Concardis_CreditCard',
      saveAllowed: false,
    } as PaymentMethod;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should set iFramesReference if init callback returns with no error', () => {
    fixture.detectChanges();

    const iFramesReference = {
      creditCardIframeName: 'cc_frame',
      verificationIframeName: 'cvc_frame',
    };
    component.initCallback(undefined, iFramesReference);
    expect(component.iframesReference).toBe(iFramesReference);
  });

  it('should not show a saveForLater checkbox if payment method does not allow it', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=save-for-later-input]')).toBeFalsy();
  });

  it('should show a saveForLater checkbox if payment method allows it', () => {
    component.paymentMethod.saveAllowed = true;

    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=save-for-later-input]')).toBeTruthy();
  });

  it('should show a general error if init callback returns with an error', () => {
    fixture.detectChanges();

    const errorMessage = 'init failed';

    component.initCallback({ error: errorMessage }, undefined);
    expect(component.errorMessage.general.message).toBe(errorMessage);
  });

  it('should emit submit event if submit call back returns with no error and parameter form is valid', () => {
    fixture.detectChanges();

    const emitter = spy(component.submit);

    component.parameterForm.controls.expirationMonth.setValue('12');
    component.parameterForm.controls.expirationYear.setValue('20');
    component.submitCallback(undefined, {
      paymentInstrumentId: '4711',
      attributes: {
        brand: 'Visa',
        cardNumber: '*********123',
        expiryMonth: '12',
        expiryYear: '20',
      },
    });

    verify(emitter.emit(anything())).once();
  });

  it('should not emit submit event if submit call back returns with no error but parameter form is invalid', () => {
    fixture.detectChanges();

    const emitter = spy(component.submit);

    component.submitCallback(undefined, {
      paymentInstrumentId: '4711',
      attributes: {
        brand: 'Visa',
        cardNumber: '*********123',
        expiryMonth: '12',
        expiryYear: '20',
      },
    });

    verify(emitter.emit(anything())).never();
  });

  it('should show an error if submit call back returns with an error', () => {
    const errorMessage = 'field is required';

    fixture.detectChanges();
    component.submitCallback(
      { message: { properties: [{ key: 'cardNumber', code: 123, message: errorMessage, messageKey: '' }] } },
      undefined
    );

    expect(component.errorMessage.cardNumber.message).toEqual(errorMessage);
  });

  it('should emit cancel event when cancelNewPaymentInstrument is triggered', () => {
    fixture.detectChanges();

    const emitter = spy(component.cancel);

    component.cancelNewPaymentInstrument();
    verify(emitter.emit()).once();
  });
});
