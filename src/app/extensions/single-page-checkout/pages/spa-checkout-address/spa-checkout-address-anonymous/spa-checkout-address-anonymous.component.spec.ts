import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaCheckoutAddressAnonymousComponent } from './spa-checkout-address-anonymous.component';

describe('Spa Checkout Address Anonymous Component', () => {
  let component: SpaCheckoutAddressAnonymousComponent;
  let fixture: ComponentFixture<SpaCheckoutAddressAnonymousComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpaCheckoutAddressAnonymousComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaCheckoutAddressAnonymousComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
