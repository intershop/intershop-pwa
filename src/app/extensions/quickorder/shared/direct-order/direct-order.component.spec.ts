import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductQuantityComponent } from 'ish-shared/components/product/product-quantity/product-quantity.component';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { DirectOrderComponent } from './direct-order.component';

describe('Direct Order Component', () => {
  let component: DirectOrderComponent;
  let fixture: ComponentFixture<DirectOrderComponent>;
  let element: HTMLElement;
  const context = mock(ProductContextFacade);
  const checkoutFacade = mock(CheckoutFacade);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormlyTestingModule, TranslateModule.forRoot()],
      declarations: [DirectOrderComponent, MockComponent(ProductQuantityComponent)],
      providers: [
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        { provide: ShoppingFacade, useFactory: () => instance(mock(ShoppingFacade)) },
        { provide: ProductContextFacade, useFactory: () => instance(context) },
      ],
    }).compileComponents();

    when(checkoutFacade.basketMaxItemQuantity$).thenReturn(of(100));
    when(context.select('quantity')).thenReturn(of());
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectOrderComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display form with direct order configuration', () => {
    fixture.detectChanges();
    expect(element.querySelectorAll('formly-field')).toMatchInlineSnapshot(`
NodeList [
  <formly-field hide-deprecation=""
  ><ng-component
    >TextInputFieldComponent: sku ish-text-input-field { "fieldClass": "col-12", "placeholder":
    "shopping_cart.direct_order.item_placeholder", "attributes": { "autocomplete": "on" }, "label":
    "", "focus": false, "disabled": false}</ng-component
  ></formly-field
>,
]
`);
  });
});
