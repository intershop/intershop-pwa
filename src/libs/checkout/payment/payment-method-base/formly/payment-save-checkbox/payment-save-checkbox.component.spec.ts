import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';

import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { PaymentSaveCheckboxComponent } from './payment-save-checkbox.component';

describe('Payment Save Checkbox Component', () => {
  let component: PaymentSaveCheckboxComponent;
  let fixture: ComponentFixture<PaymentSaveCheckboxComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentSaveCheckboxComponent],
      imports: [FormlyTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentSaveCheckboxComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.form = new FormGroup({});
    component.paymentMethod = BasketMockData.getPaymentMethod();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should throw an error if input parameter form is not set properly', () => {
    component.form = undefined;
    expect(() => fixture.detectChanges()).toThrow();
  });

  it('should not show a saveForLater checkbox if payment method does not allow it', () => {
    component.paymentMethod.saveAllowed = false;
    fixture.detectChanges();

    expect(element.innerHTML).not.toContain('saveForLater');
  });

  it('should show a saveForLater checkbox if payment method allows it', () => {
    component.paymentMethod.saveAllowed = true;

    fixture.detectChanges();

    expect(element.innerHTML).toContain('saveForLater');
  });
});
