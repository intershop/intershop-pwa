import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { ContentViewcontextComponent } from 'ish-shared/cms/components/content-viewcontext/content-viewcontext.component';
import { ProductAddToBasketComponent } from 'ish-shared/components/product/product-add-to-basket/product-add-to-basket.component';
import { ProductIdComponent } from 'ish-shared/components/product/product-id/product-id.component';
import { ProductInventoryComponent } from 'ish-shared/components/product/product-inventory/product-inventory.component';
import { ProductNameComponent } from 'ish-shared/components/product/product-name/product-name.component';
import { ProductPriceComponent } from 'ish-shared/components/product/product-price/product-price.component';
import { ProductPromotionComponent } from 'ish-shared/components/product/product-promotion/product-promotion.component';
import { ProductQuantityLabelComponent } from 'ish-shared/components/product/product-quantity-label/product-quantity-label.component';
import { ProductQuantityComponent } from 'ish-shared/components/product/product-quantity/product-quantity.component';
import { ProductShipmentComponent } from 'ish-shared/components/product/product-shipment/product-shipment.component';

import { LazyProductAddToOrderTemplateComponent } from '../../../extensions/order-templates/exports/lazy-product-add-to-order-template/lazy-product-add-to-order-template.component';
import { LazyProductAddToQuoteComponent } from '../../../extensions/quoting/exports/lazy-product-add-to-quote/lazy-product-add-to-quote.component';
import { LazyProductRatingComponent } from '../../../extensions/rating/exports/lazy-product-rating/lazy-product-rating.component';
import { LazyTactonConfigureProductComponent } from '../../../extensions/tacton/exports/lazy-tacton-configure-product/lazy-tacton-configure-product.component';
import { ProductBrandComponent } from '../product-brand/product-brand.component';
import { ProductDetailActionsComponent } from '../product-detail-actions/product-detail-actions.component';
import { ProductDetailVariationsComponent } from '../product-detail-variations/product-detail-variations.component';
import { ProductImagesComponent } from '../product-images/product-images.component';

import { ProductDetailComponent } from './product-detail.component';

describe('Product Detail Component', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const context = mock(ProductContextFacade);
    when(context.select('product')).thenReturn(of({ sku: 'SKU' }));

    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(ContentViewcontextComponent),
        MockComponent(LazyProductAddToOrderTemplateComponent),
        MockComponent(LazyProductAddToQuoteComponent),
        MockComponent(LazyProductRatingComponent),
        MockComponent(LazyTactonConfigureProductComponent),
        MockComponent(ProductAddToBasketComponent),
        MockComponent(ProductBrandComponent),
        MockComponent(ProductDetailActionsComponent),
        MockComponent(ProductDetailVariationsComponent),
        MockComponent(ProductIdComponent),
        MockComponent(ProductImagesComponent),
        MockComponent(ProductInventoryComponent),
        MockComponent(ProductNameComponent),
        MockComponent(ProductPriceComponent),
        MockComponent(ProductPromotionComponent),
        MockComponent(ProductQuantityComponent),
        MockComponent(ProductQuantityLabelComponent),
        MockComponent(ProductShipmentComponent),
        ProductDetailComponent,
      ],
      providers: [{ provide: ProductContextFacade, useFactory: () => instance(context) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render standard elements', () => {
    fixture.detectChanges();
    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      Array [
        "ish-product-detail-actions",
        "ish-product-images",
        "ish-lazy-product-rating",
        "ish-product-name",
        "ish-product-brand",
        "ish-product-id",
        "ish-product-promotion",
        "ish-product-price",
        "ish-product-inventory",
        "ish-product-shipment",
        "ish-product-detail-variations",
        "ish-lazy-tacton-configure-product",
        "ish-product-quantity-label",
        "ish-product-quantity",
        "ish-product-add-to-basket",
        "ish-lazy-product-add-to-order-template",
        "ish-lazy-product-add-to-quote",
        "ish-content-viewcontext",
      ]
    `);
  });
});
