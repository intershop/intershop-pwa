import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { PipesModule } from 'ish-core/pipes.module';
import { configurationReducer } from 'ish-core/store/configuration/configuration.reducer';
import { LazyProductAddToQuoteComponent } from '../../../../extensions/quoting/exports/product/components/lazy-product-add-to-quote/lazy-product-add-to-quote.component';
import { ProductImageComponent } from '../../../../shell/header/components/product-image/product-image.component';
import { ProductPromotionContainerComponent } from '../../containers/product-promotion/product-promotion.container';
import { ProductAddToBasketComponent } from '../product-add-to-basket/product-add-to-basket.component';
import { ProductAddToCompareComponent } from '../product-add-to-compare/product-add-to-compare.component';
import { ProductLabelComponent } from '../product-label/product-label.component';
import { ProductPriceComponent } from '../product-price/product-price.component';
import { ProductVariationSelectComponent } from '../product-variation-select/product-variation-select.component';

import { ProductTileComponent } from './product-tile.component';

describe('Product Tile Component', () => {
  let component: ProductTileComponent;
  let fixture: ComponentFixture<ProductTileComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FeatureToggleModule,
        PipesModule,
        RouterTestingModule,
        StoreModule.forRoot({ configuration: configurationReducer }),
        TranslateModule.forRoot(),
      ],
      declarations: [
        MockComponent(LazyProductAddToQuoteComponent),
        MockComponent(ProductAddToBasketComponent),
        MockComponent(ProductAddToCompareComponent),
        MockComponent(ProductImageComponent),
        MockComponent(ProductLabelComponent),
        MockComponent(ProductPriceComponent),
        MockComponent(ProductPromotionContainerComponent),
        MockComponent(ProductVariationSelectComponent),
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
});
