import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { ProductBundle } from 'ish-core/models/product/product-bundle.model';
import { ProductItemContainerComponent } from '../../../../shared/product/containers/product-item/product-item.container';

import { ProductBundlePartsComponent } from './product-bundle-parts.component';

describe('Product Bundle Parts Component', () => {
  let component: ProductBundlePartsComponent;
  let fixture: ComponentFixture<ProductBundlePartsComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponent(ProductItemContainerComponent), ProductBundlePartsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBundlePartsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.product = {
      bundledProducts: [{ sku: '1', quantity: 3 }, { sku: '2', quantity: 1 }],
    } as ProductBundle;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchInlineSnapshot(`
      <div class="col-xs-12 bundled-product-list">
        <h3 translate="">product.productBundle.products.heading</h3>
        <div class="product-list row">
          <div class="col-lg-12 product-list-item list-view">
            <ish-product-item-container
              displaytype="row"
              ng-reflect-product-sku="1"
              ng-reflect-quantity="3"
              ng-reflect-display-type="row"
            ></ish-product-item-container>
          </div>
          <div class="col-lg-12 product-list-item list-view">
            <ish-product-item-container
              displaytype="row"
              ng-reflect-product-sku="2"
              ng-reflect-quantity="1"
              ng-reflect-display-type="row"
            ></ish-product-item-container>
          </div>
        </div>
      </div>
    `);
  });
});
