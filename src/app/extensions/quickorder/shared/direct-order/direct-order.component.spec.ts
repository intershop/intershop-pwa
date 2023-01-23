import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { EMPTY, of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductQuantityComponent } from 'ish-shared/components/product/product-quantity/product-quantity.component';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { DirectOrderComponent } from './direct-order.component';

describe('Direct Order Component', () => {
  let component: DirectOrderComponent;
  let fixture: ComponentFixture<DirectOrderComponent>;
  let element: HTMLElement;
  let context: ProductContextFacade;
  let checkoutFacade: CheckoutFacade;

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    when(context.select('quantity')).thenReturn(EMPTY);
    when(context.select('product')).thenReturn(EMPTY);

    checkoutFacade = mock(CheckoutFacade);
    when(checkoutFacade.basketMaxItemQuantity$).thenReturn(of(100));

    await TestBed.configureTestingModule({
      imports: [FormlyTestingModule, TranslateModule.forRoot()],
      declarations: [DirectOrderComponent, MockComponent(ProductQuantityComponent)],
      providers: [{ provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) }],
    })
      .overrideComponent(DirectOrderComponent, {
        set: { providers: [{ provide: ProductContextFacade, useFactory: () => instance(context) }] },
      })
      .compileComponents();
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
    expect(element.querySelectorAll('formly-group formly-field')).toMatchInlineSnapshot(`
      NodeList [
        <formly-field
        ><ng-component
          >TextInputFieldComponent: sku ish-text-input-field { "fieldClass": "col-12", "placeholder":
          "shopping_cart.direct_order.item_placeholder", "attributes": { "autocomplete": "on" }, "label":
          "", "disabled": false}</ng-component
        ></formly-field
      >,
      ]
    `);
  });
});
