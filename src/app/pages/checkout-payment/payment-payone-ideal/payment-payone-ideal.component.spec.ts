import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { anything, spy, verify } from 'ts-mockito';

import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { FormControlFeedbackComponent } from 'ish-shared/forms/components/form-control-feedback/form-control-feedback.component';
import { ShowFormFeedbackDirective } from 'ish-shared/forms/directives/show-form-feedback.directive';

import { PaymentSaveCheckboxComponent } from '../formly/payment-save-checkbox/payment-save-checkbox.component';

import { PaymentPayoneIdealComponent } from './payment-payone-ideal.component';

describe('Payment Payone Ideal Component', () => {
  let component: PaymentPayoneIdealComponent;
  let fixture: ComponentFixture<PaymentPayoneIdealComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(FormControlFeedbackComponent),
        MockComponent(PaymentSaveCheckboxComponent),
        MockDirective(ShowFormFeedbackDirective),
        PaymentPayoneIdealComponent,
      ],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentPayoneIdealComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.paymentMethod = {
      id: 'Payone_IDeal',
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

    const emitter = spy(component.cancel);

    component.cancelNewPaymentInstrument();
    verify(emitter.emit()).once();
  });

  it('should emit submit event if parameter form is valid', () => {
    fixture.detectChanges();
    const emitter = spy(component.submit);

    component.payoneIDealForm.controls.bankGroup.setValue('bank_code');

    component.submitNewPaymentInstrument();

    verify(emitter.emit(anything())).once();
  });

  it('should not emit submit event if parameter form is not valid', () => {
    fixture.detectChanges();
    const emitter = spy(component.submit);

    component.payoneIDealForm.controls.bankGroup.setValue('');

    component.submitNewPaymentInstrument();

    verify(emitter.emit(anything())).never();
  });
});
