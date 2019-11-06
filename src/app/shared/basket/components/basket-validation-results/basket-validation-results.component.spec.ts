import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketValidationResultType } from 'ish-core/models/basket-validation/basket-validation.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { ProductRoutePipe } from 'ish-core/pipes/product-route.pipe';
import { checkoutReducers } from 'ish-core/store/checkout/checkout-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { ProductInventoryComponent } from 'ish-shared/product/components/product-inventory/product-inventory.component';
import { ProductImageComponent } from 'ish-shell/header/components/product-image/product-image.component';

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
      declarations: [
        BasketValidationResultsComponent,
        MockComponent(ProductImageComponent),
        MockComponent(ProductInventoryComponent),
        MockPipe(PricePipe),
        MockPipe(ProductRoutePipe),
      ],
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot(),
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

  it('should not display a removed item message if there are infos without product', () => {
    const validationMessage = { infos: [{ message: 'info message' }] } as BasketValidationResultType;

    when(checkoutFacadeMock.basketValidationResults$).thenReturn(of(validationMessage));
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id=validation-removed-message]')).toBeFalsy();
  });

  it('should display a removed item message if there is a removed item', () => {
    const validationMessage = {
      infos: [{ message: 'info message', parameters: { product: { sku: '43242' } } }],
    } as BasketValidationResultType;

    when(checkoutFacadeMock.basketValidationResults$).thenReturn(of(validationMessage));
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id=validation-removed-message]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id=validation-removed-items-message]').innerHTML).toContain(
      'info message'
    );
  });
});
