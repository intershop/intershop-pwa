import {
  Component,
  Directive,
  EventEmitter,
  Input,
  Output,
  Pipe,
  PipeTransform,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';

import { ProductDetailComponent } from './product-detail.component';

function mockFeatureToggleDirectiveFactory() {
  @Directive({
    selector: '[ishFeature]',
    standalone: true,
  })
  class MockFeatureToggleDirective {
    constructor(
      private viewContainerRef: ViewContainerRef,
      private templateRef: TemplateRef<unknown>
    ) {}

    @Input()
    set ishFeature(value: unknown) {
      void value;
      this.viewContainerRef.clear();
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }

  return MockFeatureToggleDirective;
}

function mockServerSettingPipeFactory() {
  @Pipe({
    name: 'ishServerSetting',
    standalone: true,
  })
  class MockServerSettingPipe implements PipeTransform {
    transform() {
      return true;
    }
  }

  return MockServerSettingPipe;
}

function mockPaymentPaypalComponentFactory() {
  @Component({
    selector: 'ish-payment-paypal',
    template: '',
    standalone: true,
  })
  class MockPaymentPaypalComponent {
    @Input() pageType: string;
  }

  return MockPaymentPaypalComponent;
}

function mockProductAddToBasketComponentFactory() {
  @Component({
    selector: 'ish-product-add-to-basket',
    template: '',
    standalone: true,
  })
  class MockProductAddToBasketComponent {
    @Input() cssClass: string;
  }

  return MockProductAddToBasketComponent;
}

function mockProductIdComponentFactory() {
  @Component({
    selector: 'ish-product-id',
    template: '',
    standalone: true,
  })
  class MockProductIdComponent {}

  return MockProductIdComponent;
}

function mockProductInventoryComponentFactory() {
  @Component({
    selector: 'ish-product-inventory',
    template: '',
    standalone: true,
  })
  class MockProductInventoryComponent {
    @Input() displayType: string;
  }

  return MockProductInventoryComponent;
}

function mockProductNameComponentFactory() {
  @Component({
    selector: 'ish-product-name',
    template: '',
    standalone: true,
  })
  class MockProductNameComponent {
    @Input() link: boolean;
  }

  return MockProductNameComponent;
}

function mockProductPriceComponentFactory() {
  @Component({
    selector: 'ish-product-price',
    template: '',
    standalone: true,
  })
  class MockProductPriceComponent {
    @Input() showInformationalPrice: boolean;
    @Input() showPriceSavings: boolean;
  }

  return MockProductPriceComponent;
}

function mockProductPromotionComponentFactory() {
  @Component({
    selector: 'ish-product-promotion',
    template: '',
    standalone: true,
  })
  class MockProductPromotionComponent {}

  return MockProductPromotionComponent;
}

function mockProductQuantityLabelComponentFactory() {
  @Component({
    selector: 'ish-product-quantity-label',
    template: '',
    standalone: true,
  })
  class MockProductQuantityLabelComponent {
    @Input() for: string;
  }

  return MockProductQuantityLabelComponent;
}

function mockProductQuantityComponentFactory() {
  @Component({
    selector: 'ish-product-quantity',
    template: '',
    standalone: true,
  })
  class MockProductQuantityComponent {
    @Input() elementId: string;
  }

  return MockProductQuantityComponent;
}

function mockProductShipmentComponentFactory() {
  @Component({
    selector: 'ish-product-shipment',
    template: '',
    standalone: true,
  })
  class MockProductShipmentComponent {}

  return MockProductShipmentComponent;
}

function mockWarrantyComponentFactory() {
  @Component({
    selector: 'ish-product-warranty',
    template: '',
    standalone: true,
  })
  class MockProductWarrantyComponent {
    @Output() readonly submitWarranty = new EventEmitter<string>();
  }

  return MockProductWarrantyComponent;
}

function mockProductAddToOrderTemplateComponentFactory() {
  @Component({
    selector: 'ish-product-add-to-order-template',
    template: '',
    standalone: true,
  })
  class MockProductAddToOrderTemplateComponent {
    @Input() cssClass: string;
  }

  return MockProductAddToOrderTemplateComponent;
}

function mockProductNotificationEditComponentFactory() {
  @Component({
    selector: 'ish-product-notification-edit',
    template: '',
    standalone: true,
  })
  class MockProductNotificationEditComponent {
    @Input() cssClass: string;
    @Input() displayType: string;
  }

  return MockProductNotificationEditComponent;
}

function mockProductAddToQuoteComponentFactory() {
  @Component({
    selector: 'ish-product-add-to-quote',
    template: '',
    standalone: true,
  })
  class MockProductAddToQuoteComponent {
    @Input() cssClass: string;
  }

  return MockProductAddToQuoteComponent;
}

function mockProductRatingComponentFactory() {
  @Component({
    selector: 'ish-product-rating',
    template: '',
    standalone: true,
  })
  class MockProductRatingComponent {}

  return MockProductRatingComponent;
}

function mockProductBrandComponentFactory() {
  @Component({
    selector: 'ish-product-brand',
    template: '',
    standalone: true,
  })
  class MockProductBrandComponent {}

  return MockProductBrandComponent;
}

function mockProductDetailActionsComponentFactory() {
  @Component({
    selector: 'ish-product-detail-actions',
    template: '',
    standalone: true,
  })
  class MockProductDetailActionsComponent {}

  return MockProductDetailActionsComponent;
}

function mockProductDetailVariationsComponentFactory() {
  @Component({
    selector: 'ish-product-detail-variations',
    template: '',
    standalone: true,
  })
  class MockProductDetailVariationsComponent {}

  return MockProductDetailVariationsComponent;
}

function mockProductImagesComponentFactory() {
  @Component({
    selector: 'ish-product-images',
    template: '',
    standalone: true,
  })
  class MockProductImagesComponent {}

  return MockProductImagesComponent;
}

jest.mock('ish-core/directives/feature-toggle.directive', () => ({
  FeatureToggleDirective: mockFeatureToggleDirectiveFactory(),
}));

jest.mock('ish-core/pipes/server-setting.pipe', () => ({
  ServerSettingPipe: mockServerSettingPipeFactory(),
}));

jest.mock('ish-shared/components/payment/payment-paypal/payment-paypal.component', () => ({
  PaymentPaypalComponent: mockPaymentPaypalComponentFactory(),
}));

jest.mock('ish-shared/components/product/product-add-to-basket/product-add-to-basket.component', () => ({
  ProductAddToBasketComponent: mockProductAddToBasketComponentFactory(),
}));

jest.mock('ish-shared/components/product/product-id/product-id.component', () => ({
  ProductIdComponent: mockProductIdComponentFactory(),
}));

jest.mock('ish-shared/components/product/product-inventory/product-inventory.component', () => ({
  ProductInventoryComponent: mockProductInventoryComponentFactory(),
}));

jest.mock('ish-shared/components/product/product-name/product-name.component', () => ({
  ProductNameComponent: mockProductNameComponentFactory(),
}));

jest.mock('ish-shared/components/product/product-price/product-price.component', () => ({
  ProductPriceComponent: mockProductPriceComponentFactory(),
}));

jest.mock('ish-shared/components/product/product-promotion/product-promotion.component', () => ({
  ProductPromotionComponent: mockProductPromotionComponentFactory(),
}));

jest.mock('ish-shared/components/product/product-quantity-label/product-quantity-label.component', () => ({
  ProductQuantityLabelComponent: mockProductQuantityLabelComponentFactory(),
}));

jest.mock('ish-shared/components/product/product-quantity/product-quantity.component', () => ({
  ProductQuantityComponent: mockProductQuantityComponentFactory(),
}));

jest.mock('ish-shared/components/product/product-shipment/product-shipment.component', () => ({
  ProductShipmentComponent: mockProductShipmentComponentFactory(),
}));

jest.mock('ish-shared/components/product/product-warranty/product-warranty.component', () => ({
  ProductWarrantyComponent: mockWarrantyComponentFactory(),
}));

jest.mock(
  '../../../extensions/order-templates/shared/product-add-to-order-template/product-add-to-order-template.component',
  () => ({
    ProductAddToOrderTemplateComponent: mockProductAddToOrderTemplateComponentFactory(),
  })
);

jest.mock(
  '../../../extensions/product-notifications/shared/product-notification-edit/product-notification-edit.component',
  () => ({
    ProductNotificationEditComponent: mockProductNotificationEditComponentFactory(),
  })
);

jest.mock('../../../extensions/quoting/shared/product-add-to-quote/product-add-to-quote.component', () => ({
  ProductAddToQuoteComponent: mockProductAddToQuoteComponentFactory(),
}));

jest.mock('../../../extensions/rating/shared/product-rating/product-rating.component', () => ({
  ProductRatingComponent: mockProductRatingComponentFactory(),
}));

jest.mock('../product-brand/product-brand.component', () => ({
  ProductBrandComponent: mockProductBrandComponentFactory(),
}));

jest.mock('../product-detail-actions/product-detail-actions.component', () => ({
  ProductDetailActionsComponent: mockProductDetailActionsComponentFactory(),
}));

jest.mock('../product-detail-variations/product-detail-variations.component', () => ({
  ProductDetailVariationsComponent: mockProductDetailVariationsComponentFactory(),
}));

jest.mock('../product-images/product-images.component', () => ({
  ProductImagesComponent: mockProductImagesComponentFactory(),
}));

describe('Product Detail Component', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailComponent],
      providers: [
        {
          provide: ProductContextFacade,
          useValue: {
            select: jest.fn(() => of({ sku: 'SKU' })),
            setSelectedWarranty: jest.fn(),
          },
        },
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

  it('should render standard elements', () => {
    fixture.detectChanges();

    expect(findAllCustomElements(element)).toEqual([
      'ish-product-detail-actions',
      'ish-product-images',
      'ish-product-name',
      'ish-product-brand',
      'ish-product-id',
      'ish-product-promotion',
      'ish-product-price',
      'ish-payment-paypal',
      'ish-product-inventory',
      'ish-product-shipment',
      'ish-product-detail-variations',
      'ish-product-quantity-label',
      'ish-product-quantity',
      'ish-product-add-to-basket',
      'ish-product-warranty',
    ]);
  });
});
