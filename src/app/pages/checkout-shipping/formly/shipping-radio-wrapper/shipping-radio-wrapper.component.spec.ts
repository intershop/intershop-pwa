import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingRadioWrapperComponent } from './shipping-radio-wrapper.component';

describe('Shipping Radio Wrapper Component', () => {
  let component: ShippingRadioWrapperComponent;
  let fixture: ComponentFixture<ShippingRadioWrapperComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShippingRadioWrapperComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingRadioWrapperComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
