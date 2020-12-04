import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaPaymentConcardisCreditcardCvcDetailComponent } from './spa-payment-concardis-creditcard-cvc-detail.component';

describe('Spa Checkout Concardis Creditcard Cvc Detail Component', () => {
  let component: SpaPaymentConcardisCreditcardCvcDetailComponent;
  let fixture: ComponentFixture<SpaPaymentConcardisCreditcardCvcDetailComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpaPaymentConcardisCreditcardCvcDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaPaymentConcardisCreditcardCvcDetailComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
