import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentPayoneDirectdebitManageMandateComponent } from './payment-payone-directdebit-manage-mandate.component';

describe('Payment Payone Directdebit Manage Mandate Component', () => {
  let component: PaymentPayoneDirectdebitManageMandateComponent;
  let fixture: ComponentFixture<PaymentPayoneDirectdebitManageMandateComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentPayoneDirectdebitManageMandateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentPayoneDirectdebitManageMandateComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
