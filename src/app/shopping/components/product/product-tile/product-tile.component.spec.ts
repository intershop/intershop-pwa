import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { IconModule } from '../../../../core/icon.module';
import { Product } from '../../../../models/product/product.model';
import { FeatureToggleModule } from '../../../../shared/feature-toggle.module';
import { MockComponent } from '../../../../utils/dev/mock.component';

import { ProductTileComponent } from './product-tile.component';

describe('Product Tile Component', () => {
  let component: ProductTileComponent;
  let fixture: ComponentFixture<ProductTileComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot(),
        FeatureToggleModule.testingFeatures({ compare: true, quoting: true }),
        IconModule,
      ],
      declarations: [
        ProductTileComponent,
        MockComponent({ selector: 'ish-product-image', template: 'Product Image Component', inputs: ['product'] }),
        MockComponent({
          selector: 'ish-product-price',
          template: 'Product Price Component',
          inputs: ['product', 'showInformationalPrice'],
        }),
        MockComponent({
          selector: 'ish-product-add-to-basket',
          template: 'Product Add To Basket',
          inputs: ['product'],
        }),
        MockComponent({
          selector: 'ish-product-add-to-quote',
          template: 'Product Add To Quote',
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTileComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.product = { sku: 'sku' } as Product;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
