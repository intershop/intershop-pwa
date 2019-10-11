import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketValidationResultType } from 'ish-core/models/basket-validation/basket-validation.model';
import { checkoutReducers } from 'ish-core/store/checkout/checkout-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { BasketValidationResultsComponent } from './basket-validation-results.component';

describe('Basket Validation Results Component', () => {
  let component: BasketValidationResultsComponent;
  let fixture: ComponentFixture<BasketValidationResultsComponent>;
  let element: HTMLElement;
  let checkoutFacadeMock: CheckoutFacade;

  beforeEach(async(() => {
    checkoutFacadeMock = mock(CheckoutFacade);
    when(checkoutFacadeMock.basketValidationResults$).thenReturn(of(undefined));

    TestBed.configureTestingModule({
      declarations: [BasketValidationResultsComponent],
      imports: [
        TranslateModule,
        ngrxTesting({
          reducers: {
            checkout: combineReducers(checkoutReducers),
          },
        }),
      ],
      providers: [{ provide: CheckoutFacade, useFactory: () => instance(checkoutFacadeMock) }],
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
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=validation-message]')).toBeFalsy();
  });

  it('should display a validation message if there is a validation message', () => {
    const validationMessage = { errors: [{ message: 'validation message' }] } as BasketValidationResultType;

    when(checkoutFacadeMock.basketValidationResults$).thenReturn(of(validationMessage));
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id=validation-message]').innerHTML).toContain('validation message');
  });

  it('should display a shipping restriction message if there is a shipping restriction message', () => {
    const validationMessage = {
      errors: [{ message: 'validation message', parameters: { shippingRestriction: 'shipping restriction message' } }],
    } as BasketValidationResultType;

    when(checkoutFacadeMock.basketValidationResults$).thenReturn(of(validationMessage));
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id=validation-message]').innerHTML).toContain(
      'shipping restriction message'
    );
  });
});
