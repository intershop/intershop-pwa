import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaCheckoutReceiptComponent } from './spa-checkout-receipt.component';

describe('Spa Checkout Receipt Component', () => {
  let component: SpaCheckoutReceiptComponent;
  let fixture: ComponentFixture<SpaCheckoutReceiptComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpaCheckoutReceiptComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaCheckoutReceiptComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
