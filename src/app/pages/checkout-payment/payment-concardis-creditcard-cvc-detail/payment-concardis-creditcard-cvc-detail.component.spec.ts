import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { PaymentConcardisCreditcardCvcDetailComponent } from './payment-concardis-creditcard-cvc-detail.component';

describe('Payment Concardis Creditcard Cvc Detail Component', () => {
  let component: PaymentConcardisCreditcardCvcDetailComponent;
  let fixture: ComponentFixture<PaymentConcardisCreditcardCvcDetailComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentConcardisCreditcardCvcDetailComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentConcardisCreditcardCvcDetailComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
