import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { anyString, instance, mock, verify, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketValidationResultType } from 'ish-core/models/basket-validation/basket-validation.model';
import { BasketValidationItemsComponent } from 'ish-shared/components/basket/basket-validation-items/basket-validation-items.component';
import { BasketValidationProductsComponent } from 'ish-shared/components/basket/basket-validation-products/basket-validation-products.component';

import { BasketValidationResultsComponent } from './basket-validation-results.component';

describe('Basket Validation Results Component', () => {
  let component: BasketValidationResultsComponent;
  let fixture: ComponentFixture<BasketValidationResultsComponent>;
  let element: HTMLElement;
  let checkoutFacadeMock: CheckoutFacade;

  beforeEach(async () => {
    checkoutFacadeMock = mock(CheckoutFacade);
    when(checkoutFacadeMock.basketValidationResults$).thenReturn(of(undefined));

    await TestBed.configureTestingModule({
      declarations: [
        BasketValidationResultsComponent,
        MockComponent(BasketValidationItemsComponent),
        MockComponent(BasketValidationProductsComponent),
      ],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: CheckoutFacade, useFactory: () => instance(checkoutFacadeMock) }],
    }).compileComponents();
  });

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

  it('should not display an error nor an info message if there are no validation messages', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=validation-error-message]')).toBeFalsy();
    expect(element.querySelector('[data-testing-id=validation-info-message]')).toBeFalsy();
  });

  it('should display a validation error message if there is a validation error message', () => {
    const validationMessage = {
      errors: [{ message: 'validation message', code: 'xyz' }],
    } as BasketValidationResultType;

    when(checkoutFacadeMock.basketValidationResults$).thenReturn(of(validationMessage));
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id=validation-error-message]').innerHTML).toContain(
      'validation message'
    );
  });

  it('should display a shipping restriction message if there is a shipping restriction message', () => {
    const validationMessage = {
      errors: [{ message: 'validation message', parameters: { shippingRestriction: 'shipping restriction message' } }],
    } as BasketValidationResultType;

    when(checkoutFacadeMock.basketValidationResults$).thenReturn(of(validationMessage));
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id=validation-error-message]').innerHTML).toContain(
      'shipping restriction message'
    );
  });

  it('should display a validation info message if there is a validation info message', () => {
    const validationMessage = {
      infos: [{ message: 'info message', code: 'abc' }],
    } as BasketValidationResultType;

    when(checkoutFacadeMock.basketValidationResults$).thenReturn(of(validationMessage));
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id=validation-info-message]').innerHTML).toContain('info message');
  });

  it('should not display a removed item message if there are infos without product', () => {
    const validationMessage = { infos: [{ message: 'info message' }] } as BasketValidationResultType;

    when(checkoutFacadeMock.basketValidationResults$).thenReturn(of(validationMessage));
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id=validation-removed-message]')).toBeFalsy();
  });

  it('should display a removed item message if there is a removed item', () => {
    const validationMessage = {
      infos: [{ message: 'info message', parameters: { productSku: '43242' }, lineItem: {} }],
    } as BasketValidationResultType;

    when(checkoutFacadeMock.basketValidationResults$).thenReturn(of(validationMessage));
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id=validation-removed-message]')).toBeTruthy();
    expect(element.querySelector('ish-basket-validation-products')).toBeTruthy();
  });

  it('should display an undeliverable items message if there are undeliverable items', () => {
    const validationMessage = {
      errors: [
        {
          message: 'undeliverable items message',
          code: 'basket.validation.line_item_shipping_restrictions.error',
          lineItem: {},
        },
      ],
    } as BasketValidationResultType;

    when(checkoutFacadeMock.basketValidationResults$).thenReturn(of(validationMessage));
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id=undeliverable-items-message]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id=validation-message]')).toBeFalsy();
  });

  it('should delete an item if called', () => {
    when(checkoutFacadeMock.deleteBasketItem(anyString())).thenReturn(undefined);

    component.deleteItem('4713');

    verify(checkoutFacadeMock.deleteBasketItem('4713')).once();
  });
});
