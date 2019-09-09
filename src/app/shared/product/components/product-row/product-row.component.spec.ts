import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { PipesModule } from 'ish-core/pipes.module';
import { configurationReducer } from 'ish-core/store/configuration/configuration.reducer';
import { findAllIshElements } from 'ish-core/utils/dev/html-query-utils';

import { LazyProductAddToQuoteComponent } from '../../../../extensions/quoting/exports/product/components/lazy-product-add-to-quote/lazy-product-add-to-quote.component';
import { ProductImageComponent } from '../../../../shell/header/components/product-image/product-image.component';
import { DEFAULT_CONFIGURATION } from '../../containers/product-item/product-item.container';
import { ProductPromotionContainerComponent } from '../../containers/product-promotion/product-promotion.container';
import { ProductAddToBasketComponent } from '../product-add-to-basket/product-add-to-basket.component';
import { ProductAddToCompareComponent } from '../product-add-to-compare/product-add-to-compare.component';
import { ProductIdComponent } from '../product-id/product-id.component';
import { ProductInventoryComponent } from '../product-inventory/product-inventory.component';
import { ProductLabelComponent } from '../product-label/product-label.component';
import { ProductPriceComponent } from '../product-price/product-price.component';
import { ProductQuantityComponent } from '../product-quantity/product-quantity.component';
import { ProductRatingComponent } from '../product-rating/product-rating.component';
import { ProductShipmentComponent } from '../product-shipment/product-shipment.component';
import { ProductVariationSelectComponent } from '../product-variation-select/product-variation-select.component';

import { ProductRowComponent } from './product-row.component';

describe('Product Row Component', () => {
  let component: ProductRowComponent;
  let fixture: ComponentFixture<ProductRowComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FeatureToggleModule,
        PipesModule,
        ReactiveFormsModule,
        RouterTestingModule,
        StoreModule.forRoot({ configuration: configurationReducer }),
        TranslateModule.forRoot(),
      ],
      declarations: [
        MockComponent(LazyProductAddToQuoteComponent),
        MockComponent(ProductAddToBasketComponent),
        MockComponent(ProductAddToCompareComponent),
        MockComponent(ProductIdComponent),
        MockComponent(ProductImageComponent),
        MockComponent(ProductInventoryComponent),
        MockComponent(ProductLabelComponent),
        MockComponent(ProductPriceComponent),
        MockComponent(ProductPromotionContainerComponent),
        MockComponent(ProductQuantityComponent),
        MockComponent(ProductRatingComponent),
        MockComponent(ProductShipmentComponent),
        MockComponent(ProductVariationSelectComponent),
        ProductRowComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductRowComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.product = { sku: 'sku' } as ProductView;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render default elements when not specifically configured', () => {
    component.configuration = DEFAULT_CONFIGURATION;
    fixture.detectChanges();
    expect(findAllIshElements(element)).toMatchInlineSnapshot(`
      Array [
        "ish-lazy-product-add-to-quote",
        "ish-product-add-to-basket",
        "ish-product-add-to-compare",
        "ish-product-id",
        "ish-product-image",
        "ish-product-inventory",
        "ish-product-label",
        "ish-product-price",
        "ish-product-promotion-container",
        "ish-product-quantity",
      ]
    `);
  });

  it('should render almost no elements when configured with empty configuration', () => {
    component.configuration = {};
    fixture.detectChanges();
    expect(findAllIshElements(element)).toMatchInlineSnapshot(`
      Array [
        "ish-product-image",
        "ish-product-label",
      ]
    `);
  });
});
