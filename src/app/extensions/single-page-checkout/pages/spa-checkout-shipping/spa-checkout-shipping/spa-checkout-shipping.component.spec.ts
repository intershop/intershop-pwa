import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaCheckoutShippingComponent } from './spa-checkout-shipping.component';

describe('Spa Checkout Shipping Component', () => {
  let component: SpaCheckoutShippingComponent;
  let fixture: ComponentFixture<SpaCheckoutShippingComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpaCheckoutShippingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaCheckoutShippingComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
