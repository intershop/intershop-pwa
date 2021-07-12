import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaPaymentConcardisDirectdebitComponent } from './spa-payment-concardis-directdebit.component';

describe('Spa Checkout Concardis Directdebit Component', () => {
  let component: SpaPaymentConcardisDirectdebitComponent;
  let fixture: ComponentFixture<SpaPaymentConcardisDirectdebitComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpaPaymentConcardisDirectdebitComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaPaymentConcardisDirectdebitComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
