import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { SpaCheckoutShippingPaymentPageComponent } from './spa-checkout-shipping-payment-page.component';

describe('Checkout Shipping Payment Page Component', () => {
  let component: SpaCheckoutShippingPaymentPageComponent;
  let fixture: ComponentFixture<SpaCheckoutShippingPaymentPageComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SpaCheckoutShippingPaymentPageComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaCheckoutShippingPaymentPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
