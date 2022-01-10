import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentPayoneBankGroupDetailComponent } from './payment-payone-bank-group-detail.component';

describe('Payment Payone Bank Group Detail Component', () => {
  let component: PaymentPayoneBankGroupDetailComponent;
  let fixture: ComponentFixture<PaymentPayoneBankGroupDetailComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentPayoneBankGroupDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentPayoneBankGroupDetailComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
