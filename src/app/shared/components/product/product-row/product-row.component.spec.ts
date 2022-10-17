import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { anyString, instance, mock, when } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { ProductAddToBasketComponent } from 'ish-shared/components/product/product-add-to-basket/product-add-to-basket.component';
import { ProductChooseVariationComponent } from 'ish-shared/components/product/product-choose-variation/product-choose-variation.component';
import { ProductIdComponent } from 'ish-shared/components/product/product-id/product-id.component';
import { ProductImageComponent } from 'ish-shared/components/product/product-image/product-image.component';
import { ProductInventoryComponent } from 'ish-shared/components/product/product-inventory/product-inventory.component';
import { ProductItemVariationsComponent } from 'ish-shared/components/product/product-item-variations/product-item-variations.component';
import { ProductLabelComponent } from 'ish-shared/components/product/product-label/product-label.component';
import { ProductNameComponent } from 'ish-shared/components/product/product-name/product-name.component';
import { ProductPriceComponent } from 'ish-shared/components/product/product-price/product-price.component';
import { ProductPromotionComponent } from 'ish-shared/components/product/product-promotion/product-promotion.component';
import { ProductQuantityComponent } from 'ish-shared/components/product/product-quantity/product-quantity.component';
import { ProductShipmentComponent } from 'ish-shared/components/product/product-shipment/product-shipment.component';

import { LazyProductAddToCompareComponent } from '../../../../extensions/compare/exports/lazy-product-add-to-compare/lazy-product-add-to-compare.component';
import { LazyProductAddToOrderTemplateComponent } from '../../../../extensions/order-templates/exports/lazy-product-add-to-order-template/lazy-product-add-to-order-template.component';
import { LazyProductAddToQuoteComponent } from '../../../../extensions/quoting/exports/lazy-product-add-to-quote/lazy-product-add-to-quote.component';
import { LazyProductRatingComponent } from '../../../../extensions/rating/exports/lazy-product-rating/lazy-product-rating.component';
import { LazyTactonConfigureProductComponent } from '../../../../extensions/tacton/exports/lazy-tacton-configure-product/lazy-tacton-configure-product.component';
import { LazyProductAddToWishlistComponent } from '../../../../extensions/wishlists/exports/lazy-product-add-to-wishlist/lazy-product-add-to-wishlist.component';

import { ProductRowComponent } from './product-row.component';

describe('Product Row Component', () => {
  let component: ProductRowComponent;
  let fixture: ComponentFixture<ProductRowComponent>;
  let element: HTMLElement;
  let context: ProductContextFacade;

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    when(context.select('product')).thenReturn(of({ sku: 'SKU' } as ProductView));
    when(context.select('displayProperties', anyString())).thenReturn(of(true));
    when(context.select('displayProperties', 'readOnly')).thenReturn(of(false));

    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(LazyProductAddToCompareComponent),
        MockComponent(LazyProductAddToOrderTemplateComponent),
        MockComponent(LazyProductAddToQuoteComponent),
        MockComponent(LazyProductAddToWishlistComponent),
        MockComponent(LazyProductRatingComponent),
        MockComponent(LazyTactonConfigureProductComponent),
        MockComponent(ProductAddToBasketComponent),
        MockComponent(ProductChooseVariationComponent),
        MockComponent(ProductIdComponent),
        MockComponent(ProductImageComponent),
        MockComponent(ProductInventoryComponent),
        MockComponent(ProductItemVariationsComponent),
        MockComponent(ProductLabelComponent),
        MockComponent(ProductNameComponent),
        MockComponent(ProductPriceComponent),
        MockComponent(ProductPromotionComponent),
        MockComponent(ProductQuantityComponent),
        MockComponent(ProductShipmentComponent),
        MockDirective(ServerHtmlDirective),
        ProductRowComponent,
      ],
      providers: [{ provide: ProductContextFacade, useFactory: () => instance(context) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductRowComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render default elements when not specifically configured', () => {
    fixture.detectChanges();
    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      Array [
        "ish-product-image",
        "ish-product-label",
        "ish-product-name",
        "ish-lazy-product-rating",
        "ish-product-id",
        "ish-product-promotion",
        "ish-lazy-product-add-to-quote",
        "ish-lazy-product-add-to-compare",
        "ish-lazy-product-add-to-wishlist",
        "ish-lazy-product-add-to-order-template",
        "ish-product-price",
        "ish-product-inventory",
        "ish-product-shipment",
        "ish-product-item-variations",
        "ish-lazy-tacton-configure-product",
        "ish-product-quantity",
        "ish-product-add-to-basket",
        "ish-product-choose-variation",
      ]
    `);
  });
});
