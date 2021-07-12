import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaCheckoutAddressComponent } from './spa-checkout-address.component';

describe('Spa Checkout Address Component', () => {
  let component: SpaCheckoutAddressComponent;
  let fixture: ComponentFixture<SpaCheckoutAddressComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpaCheckoutAddressComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaCheckoutAddressComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
