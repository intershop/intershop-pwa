import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentPayoneIdealDetailComponent } from './payment-payone-ideal-detail.component';

describe('Payment Payone Ideal Detail Component', () => {
  let component: PaymentPayoneIdealDetailComponent;
  let fixture: ComponentFixture<PaymentPayoneIdealDetailComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentPayoneIdealDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentPayoneIdealDetailComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
