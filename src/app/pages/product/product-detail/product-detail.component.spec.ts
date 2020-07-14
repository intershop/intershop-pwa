import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';

import { FeatureToggleDirective } from 'ish-core/directives/feature-toggle.directive';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { AccordionItemComponent } from 'ish-shared/components/common/accordion-item/accordion-item.component';
import { AccordionComponent } from 'ish-shared/components/common/accordion/accordion.component';
import { ProductAddToBasketComponent } from 'ish-shared/components/product/product-add-to-basket/product-add-to-basket.component';
import { ProductAttributesComponent } from 'ish-shared/components/product/product-attributes/product-attributes.component';
import { ProductIdComponent } from 'ish-shared/components/product/product-id/product-id.component';
import { ProductInventoryComponent } from 'ish-shared/components/product/product-inventory/product-inventory.component';
import { ProductPriceComponent } from 'ish-shared/components/product/product-price/product-price.component';
import { ProductPromotionComponent } from 'ish-shared/components/product/product-promotion/product-promotion.component';
import { ProductQuantityComponent } from 'ish-shared/components/product/product-quantity/product-quantity.component';
import { ProductRatingComponent } from 'ish-shared/components/product/product-rating/product-rating.component';
import { ProductShipmentComponent } from 'ish-shared/components/product/product-shipment/product-shipment.component';
import { ProductVariationSelectComponent } from 'ish-shared/components/product/product-variation-select/product-variation-select.component';

import { LazyProductAddToOrderTemplateComponent } from '../../../extensions/order-templates/exports/product/lazy-product-add-to-order-template/lazy-product-add-to-order-template.component';
import { LazyProductAddToQuoteComponent } from '../../../extensions/quoting/exports/product/lazy-product-add-to-quote/lazy-product-add-to-quote.component';
import { IsTactonProductDirective } from '../../../extensions/tacton/directives/is-tacton-product.directive';
import { LazyTactonConfigureProductComponent } from '../../../extensions/tacton/exports/product/lazy-tacton-configure-product/lazy-tacton-configure-product.component';
import { ProductDetailActionsComponent } from '../product-detail-actions/product-detail-actions.component';
import { ProductImagesComponent } from '../product-images/product-images.component';

import { ProductDetailComponent } from './product-detail.component';

describe('Product Detail Component', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;
  let product: ProductView;
  let element: HTMLElement;

  beforeEach(async(() => {
    product = { sku: 'sku' } as ProductView;
    product.name = 'Test Product';
    product.longDescription = 'long description';
    product.manufacturer = undefined;

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([{ path: 'search', component: ProductDetailComponent }]),
        TranslateModule.forRoot(),
      ],
      declarations: [
        MockComponent(AccordionComponent),
        MockComponent(AccordionItemComponent),
        MockComponent(LazyProductAddToOrderTemplateComponent),
        MockComponent(LazyProductAddToQuoteComponent),
        MockComponent(LazyTactonConfigureProductComponent),
        MockComponent(ProductAddToBasketComponent),
        MockComponent(ProductAttributesComponent),
        MockComponent(ProductDetailActionsComponent),
        MockComponent(ProductIdComponent),
        MockComponent(ProductImagesComponent),
        MockComponent(ProductInventoryComponent),
        MockComponent(ProductPriceComponent),
        MockComponent(ProductPromotionComponent),
        MockComponent(ProductQuantityComponent),
        MockComponent(ProductRatingComponent),
        MockComponent(ProductShipmentComponent),
        MockComponent(ProductVariationSelectComponent),
        MockDirective(FeatureToggleDirective),
        MockDirective(IsTactonProductDirective),
        ProductDetailComponent,
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ProductDetailComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        component.product = product;
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
