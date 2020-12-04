import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaPaymentConcardisCreditcardComponent } from './spa-payment-concardis-creditcard.component';

describe('Spa Checkout Concardis Creditcard Component', () => {
  let component: SpaPaymentConcardisCreditcardComponent;
  let fixture: ComponentFixture<SpaPaymentConcardisCreditcardComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpaPaymentConcardisCreditcardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaPaymentConcardisCreditcardComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
