import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';

import { PaymentConcardisComponent } from './payment-concardis.component';

describe('Payment Concardis Component', () => {
  let component: PaymentConcardisComponent;
  let fixture: ComponentFixture<PaymentConcardisComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentConcardisComponent],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentConcardisComponent);
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
});
