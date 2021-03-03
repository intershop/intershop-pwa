import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { ProductAddToBasketComponent } from 'ish-shared/components/product/product-add-to-basket/product-add-to-basket.component';
import { ProductIdComponent } from 'ish-shared/components/product/product-id/product-id.component';
import { ProductInventoryComponent } from 'ish-shared/components/product/product-inventory/product-inventory.component';
import { ProductNameComponent } from 'ish-shared/components/product/product-name/product-name.component';
import { ProductPriceComponent } from 'ish-shared/components/product/product-price/product-price.component';
import { ProductPromotionComponent } from 'ish-shared/components/product/product-promotion/product-promotion.component';
import { ProductQuantityLabelComponent } from 'ish-shared/components/product/product-quantity-label/product-quantity-label.component';
import { ProductQuantityComponent } from 'ish-shared/components/product/product-quantity/product-quantity.component';
import { ProductRatingComponent } from 'ish-shared/components/product/product-rating/product-rating.component';
import { ProductShipmentComponent } from 'ish-shared/components/product/product-shipment/product-shipment.component';

import { LazyProductAddToOrderTemplateComponent } from '../../../extensions/order-templates/exports/lazy-product-add-to-order-template/lazy-product-add-to-order-template.component';
import { LazyProductAddToQuoteComponent } from '../../../extensions/quoting/exports/lazy-product-add-to-quote/lazy-product-add-to-quote.component';
import { LazyTactonConfigureProductComponent } from '../../../extensions/tacton/exports/lazy-tacton-configure-product/lazy-tacton-configure-product.component';
import { ProductBrandComponent } from '../product-brand/product-brand.component';
import { ProductDetailActionsComponent } from '../product-detail-actions/product-detail-actions.component';
import { ProductDetailInfoAccordionComponent } from '../product-detail-info-accordion/product-detail-info-accordion.component';
import { ProductDetailVariationsComponent } from '../product-detail-variations/product-detail-variations.component';
import { ProductImagesComponent } from '../product-images/product-images.component';

import { ProductDetailComponent } from './product-detail.component';

describe('Product Detail Component', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(LazyProductAddToOrderTemplateComponent),
        MockComponent(LazyProductAddToQuoteComponent),
        MockComponent(LazyTactonConfigureProductComponent),
        MockComponent(ProductAddToBasketComponent),
        MockComponent(ProductBrandComponent),
        MockComponent(ProductDetailActionsComponent),
        MockComponent(ProductDetailInfoAccordionComponent),
        MockComponent(ProductDetailVariationsComponent),
        MockComponent(ProductIdComponent),
        MockComponent(ProductImagesComponent),
        MockComponent(ProductInventoryComponent),
        MockComponent(ProductNameComponent),
        MockComponent(ProductPriceComponent),
        MockComponent(ProductPromotionComponent),
        MockComponent(ProductQuantityComponent),
        MockComponent(ProductQuantityLabelComponent),
        MockComponent(ProductRatingComponent),
        MockComponent(ProductShipmentComponent),
        ProductDetailComponent,
      ],
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
});
