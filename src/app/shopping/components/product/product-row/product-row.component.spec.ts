import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { Product } from 'ish-core/models/product/product.model';
import { MockComponent } from '../../../../utils/dev/mock.component';

import { ProductRowComponent } from './product-row.component';

describe('Product Row Component', () => {
  let component: ProductRowComponent;
  let fixture: ComponentFixture<ProductRowComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FeatureToggleModule.testingFeatures({ compare: true, quoting: true }),
        RouterTestingModule,
        TranslateModule.forRoot(),
      ],
      declarations: [
        MockComponent({
          selector: 'ish-product-add-to-basket',
          template: 'Product Add To Basket Component',
          inputs: ['product'],
        }),
        MockComponent({
          selector: 'ish-product-add-to-quote',
          template: 'Product Add To Quote Component',
        }),
        MockComponent({
          selector: 'ish-product-inventory',
          template: 'Product Inventory Component',
          inputs: ['product'],
        }),
        MockComponent({
          selector: 'ish-product-price',
          template: 'Product Price Component',
          inputs: ['product', 'showInformationalPrice'],
        }),
        MockComponent({ selector: 'ish-product-image', template: 'Product Image Component', inputs: ['product'] }),
        ProductRowComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductRowComponent);
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
