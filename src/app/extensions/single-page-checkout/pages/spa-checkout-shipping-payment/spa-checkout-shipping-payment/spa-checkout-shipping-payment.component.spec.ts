import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { CheckoutShippingPaymentComponent } from './checkout-shipping-payment.component';

describe('Checkout Shipping Payment Component', () => {
  let component: CheckoutShippingPaymentComponent;
  let fixture: ComponentFixture<CheckoutShippingPaymentComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckoutShippingPaymentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutShippingPaymentComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
