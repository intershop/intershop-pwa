import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaCheckoutShippingPageComponent } from './spa-checkout-shipping-page.component';

describe('Spa Checkout Shipping Component', () => {
  let component: SpaCheckoutShippingPageComponent;
  let fixture: ComponentFixture<SpaCheckoutShippingPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpaCheckoutShippingPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaCheckoutShippingPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
