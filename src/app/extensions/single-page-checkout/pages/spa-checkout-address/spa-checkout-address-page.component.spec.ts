import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaCheckoutAddressPageComponent } from './spa-checkout-address-page.component';

describe('Spa Checkout Address Component', () => {
  let component: SpaCheckoutAddressPageComponent;
  let fixture: ComponentFixture<SpaCheckoutAddressPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpaCheckoutAddressPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaCheckoutAddressPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
