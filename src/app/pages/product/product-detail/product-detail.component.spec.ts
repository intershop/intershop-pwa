import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { PaymentPaypalComponent } from 'ish-shared/components/payment/payment-paypal/payment-paypal.component';
import { ProductAddToBasketComponent } from 'ish-shared/components/product/product-add-to-basket/product-add-to-basket.component';
import { ProductIdComponent } from 'ish-shared/components/product/product-id/product-id.component';
import { ProductInventoryComponent } from 'ish-shared/components/product/product-inventory/product-inventory.component';
import { ProductNameComponent } from 'ish-shared/components/product/product-name/product-name.component';
import { ProductPriceComponent } from 'ish-shared/components/product/product-price/product-price.component';
import { ProductPromotionComponent } from 'ish-shared/components/product/product-promotion/product-promotion.component';
import { ProductQuantityLabelComponent } from 'ish-shared/components/product/product-quantity-label/product-quantity-label.component';
import { ProductQuantityComponent } from 'ish-shared/components/product/product-quantity/product-quantity.component';
import { ProductShipmentComponent } from 'ish-shared/components/product/product-shipment/product-shipment.component';
import { ProductWarrantyComponent } from 'ish-shared/components/product/product-warranty/product-warranty.component';

import { ProductAddToOrderTemplateComponent } from '../../../extensions/order-templates/shared/product-add-to-order-template/product-add-to-order-template.component';
import { ProductNotificationEditComponent } from '../../../extensions/product-notifications/shared/product-notification-edit/product-notification-edit.component';
import { ProductAddToQuoteComponent } from '../../../extensions/quoting/shared/product-add-to-quote/product-add-to-quote.component';
import { ProductRatingComponent } from '../../../extensions/rating/shared/product-rating/product-rating.component';
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
        MockComponent(ProductAddToBasketComponent),
        MockComponent(ProductAddToOrderTemplateComponent),
        MockComponent(ProductAddToQuoteComponent),
        MockComponent(ProductBrandComponent),
        MockComponent(ProductDetailActionsComponent),
        MockComponent(ProductDetailVariationsComponent),
        MockComponent(ProductNotificationEditComponent),
        MockComponent(ProductRatingComponent),
        MockComponent(ProductIdComponent),
        MockComponent(ProductImagesComponent),
        MockComponent(ProductInventoryComponent),
        MockComponent(ProductNameComponent),
        MockComponent(ProductPriceComponent),
        MockComponent(ProductPromotionComponent),
        MockComponent(ProductQuantityComponent),
        MockComponent(ProductQuantityLabelComponent),
        MockComponent(ProductShipmentComponent),
        MockComponent(ProductWarrantyComponent),
        MockPipe(ServerSettingPipe, () => true),
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
      [
        "ish-product-detail-actions",
        "ish-product-images",
        "ish-product-rating",
        "ish-product-name",
        "ish-product-brand",
        "ish-product-id",
        "ish-product-promotion",
        "ish-product-price",
        "ish-payment-paypal",
        "ish-product-inventory",
        "ish-product-shipment",
        "ish-product-detail-variations",
        "ish-product-quantity-label",
        "ish-product-quantity",
        "ish-product-add-to-basket",
        "ish-product-add-to-order-template",
        "ish-product-add-to-quote",
        "ish-product-notification-edit",
        "ish-product-warranty",
      ]
    `);
  });
});
