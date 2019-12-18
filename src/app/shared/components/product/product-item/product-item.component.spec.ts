import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, capture, instance, mock, spy, verify, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { VariationProductView } from 'ish-core/models/product-view/product-view.model';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { ProductRowComponent } from 'ish-shared/components/product/product-row/product-row.component';
import { ProductTileComponent } from 'ish-shared/components/product/product-tile/product-tile.component';

import { ProductItemComponent } from './product-item.component';

describe('Product Item Component', () => {
  let component: ProductItemComponent;
  let fixture: ComponentFixture<ProductItemComponent>;
  let element: HTMLElement;
  let shoppingFacade: ShoppingFacade;

  beforeEach(async(() => {
    shoppingFacade = mock(ShoppingFacade);
    TestBed.configureTestingModule({
      declarations: [
        MockComponent(LoadingComponent),
        MockComponent(ProductRowComponent),
        MockComponent(ProductTileComponent),
        ProductItemComponent,
      ],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductItemComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.productSku = 'sku';
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('with variation product', () => {
    beforeEach(() => {
      const variation = {
        sku: 'sku',
        type: 'VariationProduct',
        variations: () => [
          {
            sku: 'skuV2',
            variableVariationAttributes: [{ variationAttributeId: 'HDD', value: '256' }],
          },
        ],
      } as VariationProductView;
      when(shoppingFacade.product$(anything(), anything())).thenReturn(of(variation));
    });

    it('should trigger add product to cart with right sku', () => {
      expect(() => fixture.detectChanges()).not.toThrow();

      component.addToBasket(3);

      verify(shoppingFacade.addProductToBasket(anything(), anything())).once();
      expect(capture(shoppingFacade.addProductToBasket).last()).toMatchInlineSnapshot(`
        Array [
          "sku",
          3,
        ]
      `);
    });

    describe('when changing variation', () => {
      it('should trigger product sku change when sku is changing', () => {
        expect(() => fixture.detectChanges()).not.toThrow();

        const emitter = spy(component.productSkuChange);

        component.replaceVariation({ HDD: '256' });

        verify(emitter.emit(anything())).once();
        const [sku] = capture(emitter.emit).last();
        expect(sku).toMatchInlineSnapshot(`"skuV2"`);
      });

      it('should trigger add product to cart with right sku', () => {
        expect(() => fixture.detectChanges()).not.toThrow();

        component.replaceVariation({ HDD: '256' });
        component.addToBasket(4);

        verify(shoppingFacade.addProductToBasket(anything(), anything())).once();
        expect(capture(shoppingFacade.addProductToBasket).last()).toMatchInlineSnapshot(`
          Array [
            "skuV2",
            4,
          ]
        `);
      });
    });
  });
});
