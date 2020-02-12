import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductRoutePipe } from 'ish-core/routing/product/product-route.pipe';
import { configurationReducer } from 'ish-core/store/configuration/configuration.reducer';
import { findAllIshElements } from 'ish-core/utils/dev/html-query-utils';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { ProductAddToBasketComponent } from 'ish-shared/components/product/product-add-to-basket/product-add-to-basket.component';
import { ProductAddToCompareComponent } from 'ish-shared/components/product/product-add-to-compare/product-add-to-compare.component';
import { DEFAULT_CONFIGURATION } from 'ish-shared/components/product/product-item/product-item.component';
import { ProductLabelComponent } from 'ish-shared/components/product/product-label/product-label.component';
import { ProductPriceComponent } from 'ish-shared/components/product/product-price/product-price.component';
import { ProductPromotionComponent } from 'ish-shared/components/product/product-promotion/product-promotion.component';
import { ProductRatingComponent } from 'ish-shared/components/product/product-rating/product-rating.component';
import { ProductVariationSelectComponent } from 'ish-shared/components/product/product-variation-select/product-variation-select.component';
import { ProductImageComponent } from 'ish-shell/header/product-image/product-image.component';

import { LazyProductAddToQuoteComponent } from '../../../../extensions/quoting/exports/product/lazy-product-add-to-quote/lazy-product-add-to-quote.component';

import { ProductTileComponent } from './product-tile.component';

describe('Product Tile Component', () => {
  let component: ProductTileComponent;
  let fixture: ComponentFixture<ProductTileComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FeatureToggleModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        ngrxTesting({ reducers: { configuration: configurationReducer } }),
      ],
      declarations: [
        MockComponent(LazyProductAddToQuoteComponent),
        MockComponent(ProductAddToBasketComponent),
        MockComponent(ProductAddToCompareComponent),
        MockComponent(ProductImageComponent),
        MockComponent(ProductLabelComponent),
        MockComponent(ProductPriceComponent),
        MockComponent(ProductPromotionComponent),
        MockComponent(ProductRatingComponent),
        MockComponent(ProductVariationSelectComponent),
        MockPipe(ProductRoutePipe),
        ProductTileComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTileComponent);
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
        "ish-product-image",
        "ish-product-label",
        "ish-product-price",
        "ish-product-promotion",
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
