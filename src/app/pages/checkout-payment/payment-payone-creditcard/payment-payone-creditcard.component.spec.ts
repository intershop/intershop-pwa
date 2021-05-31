import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { CheckboxComponent } from 'ish-shared/forms/components/checkbox/checkbox.component';

import { PaymentPayoneCreditcardComponent } from './payment-payone-creditcard.component';

describe('Payment Payone Creditcard Component', () => {
  let component: PaymentPayoneCreditcardComponent;
  let fixture: ComponentFixture<PaymentPayoneCreditcardComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockComponent(CheckboxComponent), PaymentPayoneCreditcardComponent],
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
});
