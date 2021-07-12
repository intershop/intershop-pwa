import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaCheckoutPaymentComponent } from './spa-checkout-payment.component';

describe('Spa Checkout Payment Component', () => {
  let component: SpaCheckoutPaymentComponent;
  let fixture: ComponentFixture<SpaCheckoutPaymentComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpaCheckoutPaymentComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaCheckoutPaymentComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
