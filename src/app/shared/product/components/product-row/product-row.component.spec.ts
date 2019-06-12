import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { PipesModule } from 'ish-core/pipes.module';
import { LazyProductAddToQuoteComponent } from '../../../../extensions/quoting/exports/product/components/lazy-product-add-to-quote/lazy-product-add-to-quote.component';
import { ProductImageComponent } from '../../../../shell/header/components/product-image/product-image.component';
import { ProductPromotionContainerComponent } from '../../containers/product-promotion/product-promotion.container';
import { ProductAddToBasketComponent } from '../product-add-to-basket/product-add-to-basket.component';
import { ProductAddToCompareComponent } from '../product-add-to-compare/product-add-to-compare.component';
import { ProductInventoryComponent } from '../product-inventory/product-inventory.component';
import { ProductLabelComponent } from '../product-label/product-label.component';
import { ProductPriceComponent } from '../product-price/product-price.component';
import { ProductQuantityComponent } from '../product-quantity/product-quantity.component';
import { ProductVariationSelectComponent } from '../product-variation-select/product-variation-select.component';

import { ProductRowComponent } from './product-row.component';

describe('Product Row Component', () => {
  let component: ProductRowComponent;
  let fixture: ComponentFixture<ProductRowComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FeatureToggleModule, PipesModule, ReactiveFormsModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        MockComponent(LazyProductAddToQuoteComponent),
        MockComponent(ProductAddToBasketComponent),
        MockComponent(ProductAddToCompareComponent),
        MockComponent(ProductImageComponent),
        MockComponent(ProductInventoryComponent),
        MockComponent(ProductLabelComponent),
        MockComponent(ProductPriceComponent),
        MockComponent(ProductPromotionContainerComponent),
        MockComponent(ProductQuantityComponent),
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
});
