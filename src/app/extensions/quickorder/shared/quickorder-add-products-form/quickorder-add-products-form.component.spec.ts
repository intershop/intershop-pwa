import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { anyNumber, anyString, instance, mock, verify, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { QuickorderAddProductsFormComponent } from './quickorder-add-products-form.component';

describe('Quickorder Add Products Form Component', () => {
  let component: QuickorderAddProductsFormComponent;
  let fixture: ComponentFixture<QuickorderAddProductsFormComponent>;
  let element: HTMLElement;
  const shoppingFacade = mock(ShoppingFacade);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuickorderAddProductsFormComponent],
      imports: [FormlyTestingModule, TranslateModule.forRoot()],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickorderAddProductsFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display form with add products configuration', () => {
    fixture.detectChanges();
    expect(element.querySelectorAll('formly-group formly-field')).toMatchInlineSnapshot(`
      NodeList [
        <formly-field
        ><ish-repeat-test-field
          >RepeatFieldComponent: addProducts repeat { "addText": "quickorder.page.add.row", "addMoreText":
          "quickorder.page.add.row.multiple", "numberMoreRows": 5, "label": "", "placeholder": "",
          "disabled": false}</ish-repeat-test-field
        ></formly-field
      >,
      ]
    `);
  });

  it('should add all filled product lines to basket and reset model', () => {
    when(shoppingFacade.addProductToBasket(anyString(), anyNumber())).thenReturn();
    const validProducts = [
      { sku: 'product1', quantity: 3 },
      { sku: 'product3', quantity: 4 },
    ];
    const invalidProducts = [
      { sku: 'product2', quantity: undefined },
      { sku: undefined, quantity: 5 },
      { sku: '', quantity: 7 },
    ];
    const initModel = {
      addProducts: [
        { sku: '', quantity: 1 },
        { sku: '', quantity: 1 },
        { sku: '', quantity: 1 },
        { sku: '', quantity: 1 },
        { sku: '', quantity: 1 },
      ],
    };

    fixture.detectChanges();
    component.model = {
      addProducts: [validProducts[0], invalidProducts[0], invalidProducts[1], validProducts[1], invalidProducts[2]],
    };
    component.onAddProducts();

    verify(shoppingFacade.addProductToBasket(validProducts[0].sku, validProducts[0].quantity)).once();
    verify(shoppingFacade.addProductToBasket(validProducts[1].sku, validProducts[1].quantity)).once();
    verify(shoppingFacade.addProductToBasket(invalidProducts[0].sku, invalidProducts[0].quantity)).never();
    verify(shoppingFacade.addProductToBasket(invalidProducts[1].sku, invalidProducts[1].quantity)).never();
    verify(shoppingFacade.addProductToBasket(invalidProducts[2].sku, invalidProducts[2].quantity)).never();
    when(shoppingFacade.addProductToBasket(anyString(), anyNumber())).thenReturn();
    expect(component.model).toEqual(initModel);
  });
});
