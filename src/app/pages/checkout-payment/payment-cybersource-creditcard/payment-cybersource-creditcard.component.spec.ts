import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { InputComponent } from 'ish-shared/forms/components/input/input.component';

import { PaymentCybersourceCreditcardComponent } from './payment-cybersource-creditcard.component';

describe('Payment Cybersource Creditcard Component', () => {
  let component: PaymentCybersourceCreditcardComponent;
  let fixture: ComponentFixture<PaymentCybersourceCreditcardComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockComponent(InputComponent), PaymentCybersourceCreditcardComponent],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentCybersourceCreditcardComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
