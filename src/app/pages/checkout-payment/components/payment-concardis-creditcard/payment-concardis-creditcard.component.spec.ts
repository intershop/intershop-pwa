import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { anything, spy, verify } from 'ts-mockito';

import { IconModule } from 'ish-core/icon.module';
import { FormsSharedModule } from 'ish-shared/forms/forms.module';

import { PaymentConcardisCreditcardComponent } from './payment-concardis-creditcard.component';

describe('Payment Concardis Creditcard Component', () => {
  let component: PaymentConcardisCreditcardComponent;
  let fixture: ComponentFixture<PaymentConcardisCreditcardComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentConcardisCreditcardComponent],
      imports: [FormsSharedModule, IconModule, NgbPopoverModule, ReactiveFormsModule, TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentConcardisCreditcardComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
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
