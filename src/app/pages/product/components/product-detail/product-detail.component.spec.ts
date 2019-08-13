import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { configurationReducer } from 'ish-core/store/configuration/configuration.reducer';
import { LazyProductAddToQuoteComponent } from '../../../../extensions/quoting/exports/product/components/lazy-product-add-to-quote/lazy-product-add-to-quote.component';
import { AccordionItemComponent } from '../../../../shared/common/components/accordion-item/accordion-item.component';
import { AccordionComponent } from '../../../../shared/common/components/accordion/accordion.component';
import { ProductAddToBasketComponent } from '../../../../shared/product/components/product-add-to-basket/product-add-to-basket.component';
import { ProductAttributesComponent } from '../../../../shared/product/components/product-attributes/product-attributes.component';
import { ProductIdComponent } from '../../../../shared/product/components/product-id/product-id.component';
import { ProductInventoryComponent } from '../../../../shared/product/components/product-inventory/product-inventory.component';
import { ProductPriceComponent } from '../../../../shared/product/components/product-price/product-price.component';
import { ProductQuantityComponent } from '../../../../shared/product/components/product-quantity/product-quantity.component';
import { ProductRatingComponent } from '../../../../shared/product/components/product-rating/product-rating.component';
import { ProductShipmentComponent } from '../../../../shared/product/components/product-shipment/product-shipment.component';
import { ProductVariationSelectComponent } from '../../../../shared/product/components/product-variation-select/product-variation-select.component';
import { ProductPromotionContainerComponent } from '../../../../shared/product/containers/product-promotion/product-promotion.container';
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
        FeatureToggleModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([{ path: 'search', component: ProductDetailComponent }]),
        StoreModule.forRoot({ configuration: configurationReducer }),
        TranslateModule.forRoot(),
      ],
      declarations: [
        MockComponent(AccordionComponent),
        MockComponent(AccordionItemComponent),
        MockComponent(LazyProductAddToQuoteComponent),
        MockComponent(ProductAddToBasketComponent),
        MockComponent(ProductAttributesComponent),
        MockComponent(ProductDetailActionsComponent),
        MockComponent(ProductIdComponent),
        MockComponent(ProductImagesComponent),
        MockComponent(ProductInventoryComponent),
        MockComponent(ProductPriceComponent),
        MockComponent(ProductPromotionContainerComponent),
        MockComponent(ProductQuantityComponent),
        MockComponent(ProductRatingComponent),
        MockComponent(ProductShipmentComponent),
        MockComponent(ProductVariationSelectComponent),
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
