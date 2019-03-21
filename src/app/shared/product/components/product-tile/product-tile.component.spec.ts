import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { PipesModule } from 'ish-core/pipes.module';
import { configurationReducer } from 'ish-core/store/configuration/configuration.reducer';
import { MockComponent } from 'ish-core/utils/dev/mock.component';

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
        MockComponent({
          selector: 'ish-lazy-product-add-to-quote',
          template: 'Lazy Product Add To Quote',
          inputs: ['displayType', 'disabled', 'class', 'product', 'quantity'],
        }),
        MockComponent({
          selector: 'ish-product-add-to-basket',
          template: 'Product Add To Basket',
          inputs: ['product'],
        }),
        MockComponent({
          selector: 'ish-product-add-to-compare',
          template: 'Product Add To Compare',
          inputs: ['isInCompareList'],
        }),
        MockComponent({
          selector: 'ish-product-image',
          template: 'Product Image Component',
          inputs: ['product'],
        }),
        MockComponent({
          selector: 'ish-product-label',
          template: 'Product Label Component',
          inputs: ['product'],
        }),
        MockComponent({
          selector: 'ish-product-price',
          template: 'Product Price Component',
          inputs: ['product', 'showInformationalPrice'],
        }),
        MockComponent({
          selector: 'ish-product-variations',
          template: 'Product Variations Component',
          inputs: ['variationOptions'],
        }),
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
