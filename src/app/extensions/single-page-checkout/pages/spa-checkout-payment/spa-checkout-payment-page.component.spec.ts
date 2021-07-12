import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaCheckoutPaymentPageComponent } from './spa-checkout-payment.component';

describe('Spa Checkout Payment Component', () => {
  let component: SpaCheckoutPaymentPageComponent;
  let fixture: ComponentFixture<SpaCheckoutPaymentPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpaCheckoutPaymentPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaCheckoutPaymentPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
