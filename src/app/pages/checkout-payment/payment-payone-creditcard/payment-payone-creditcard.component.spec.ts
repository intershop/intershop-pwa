import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { anything, spy, verify } from 'ts-mockito';

import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';

import { PaymentSaveCheckboxComponent } from '../formly/payment-save-checkbox/payment-save-checkbox.component';

import { PaymentPayoneCreditcardComponent } from './payment-payone-creditcard.component';

describe('Payment Payone Creditcard Component', () => {
  let component: PaymentPayoneCreditcardComponent;
  let fixture: ComponentFixture<PaymentPayoneCreditcardComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockComponent(PaymentSaveCheckboxComponent), PaymentPayoneCreditcardComponent],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentPayoneCreditcardComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.paymentMethod = {
      id: 'Payone_CreditCard',
      saveAllowed: false,
    } as PaymentMethod;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should emit cancel event when cancelNewPaymentInstrument is triggered', () => {
    fixture.detectChanges();

    const emitter = spy(component.cancelPayment);

    component.cancelNewPaymentInstrument();
    verify(emitter.emit()).once();
  });

  it('should emit submit event if submit call back returns with no error and parameter form is valid', () => {
    fixture.detectChanges();
    const emitter = spy(component.submitPayment);

    const response = {
      pseudocardpan: 'token',
      truncatedcardpan: '41111XXXX111',
      status: 'VALID',
    };

    component.submitCallback(response);

    verify(emitter.emit(anything())).once();
  });

  it('should not emit submit event if submit call back returns with error and parameter form is valid', () => {
    fixture.detectChanges();
    const emitter = spy(component.submitPayment);

    const response = {
      pseudocardpan: 'token',
      truncatedcardpan: '41111XXXX111',
      status: 'INVALID',
    };

    component.submitCallback(response);

    verify(emitter.emit(anything())).never();
  });

  it('should return true when security code check required is enabled', () => {
    component.paymentMethod.hostedPaymentPageParameters = [{ name: 'isSecurityCheckCodeRequired', value: 'true' }];
    expect(component.isSecurityCodeCheckRequired()).toBeTruthy();
  });

  it('should return false when security code check required is disabled', () => {
    component.paymentMethod.hostedPaymentPageParameters = [{ name: 'isSecurityCheckCodeRequired', value: 'false' }];
    expect(component.isSecurityCodeCheckRequired()).toBeFalsy();
  });
});
