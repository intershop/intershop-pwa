import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';
import { of } from 'rxjs';

import { BasketValidationResultType } from 'ish-core/models/basket-validation/basket-validation.model';
import { checkoutReducers } from 'ish-core/store/checkout/checkout-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { BasketValidationResultsComponent } from './basket-validation-results.component';

describe('Basket Validation Results Component', () => {
  let component: BasketValidationResultsComponent;
  let fixture: ComponentFixture<BasketValidationResultsComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BasketValidationResultsComponent],
      imports: ngrxTesting({
        checkout: combineReducers(checkoutReducers),
      }),
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketValidationResultsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not display a message if there are no validation messages', () => {
    component.validationResults$ = of(undefined);
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=validation-message]')).toBeFalsy();
  });

  it('should display a validation messages if there is a validation message', () => {
    const validationMessage = { errors: [{ message: 'validation message' }] } as BasketValidationResultType;

    component.validationResults$ = of(validationMessage);
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=validation-message]').innerHTML).toContain('validation message');
  });

  it('should display a shipping restriction messages if there is a shipping restriction message', () => {
    const validationMessage = {
      errors: [{ message: 'validation message', parameters: { shippingRestriction: 'shipping restriction message' } }],
    } as BasketValidationResultType;

    component.validationResults$ = of(validationMessage);
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=validation-message]').innerHTML).toContain(
      'shipping restriction message'
    );
  });
});
