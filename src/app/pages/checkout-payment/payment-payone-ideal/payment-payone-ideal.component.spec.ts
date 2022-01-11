import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyForm } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { spy, verify } from 'ts-mockito';

import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';

import { PaymentSaveCheckboxComponent } from '../formly/payment-save-checkbox/payment-save-checkbox.component';

import { PaymentPayoneIdealComponent } from './payment-payone-ideal.component';

describe('Payment Payone Ideal Component', () => {
  let component: PaymentPayoneIdealComponent;
  let fixture: ComponentFixture<PaymentPayoneIdealComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(FormlyForm),
        MockComponent(PaymentSaveCheckboxComponent),
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
});
