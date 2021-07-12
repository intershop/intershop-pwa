import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaCheckoutReceiptPageComponent } from './spa-checkout-receipt-page.component';

describe('Spa Checkout Receipt Component', () => {
  let component: SpaCheckoutReceiptPageComponent;
  let fixture: ComponentFixture<SpaCheckoutReceiptPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpaCheckoutReceiptPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaCheckoutReceiptPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
