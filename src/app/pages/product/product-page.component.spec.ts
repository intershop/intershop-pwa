import { Location } from '@angular/common';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { EMPTY, noop, of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { createCategoryView } from 'ish-core/models/category-view/category-view.model';
import { Category } from 'ish-core/models/category/category.model';
import { VariationSelection } from 'ish-core/models/product-variation/variation-selection.model';
import {
  VariationProductView,
  createProductView,
  createVariationProductMasterView,
} from 'ish-core/models/product-view/product-view.model';
import { ProductRetailSet } from 'ish-core/models/product/product-retail-set.model';
import { VariationProductMaster } from 'ish-core/models/product/product-variation-master.model';
import { VariationProduct } from 'ish-core/models/product/product-variation.model';
import { Product, ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';
import { BreadcrumbComponent } from 'ish-shared/components/common/breadcrumb/breadcrumb.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { RecentlyViewedComponent } from 'ish-shared/components/recently/recently-viewed/recently-viewed.component';

import { ProductBundlePartsComponent } from './product-bundle-parts/product-bundle-parts.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductLinksComponent } from './product-links/product-links.component';
import { ProductMasterVariationsComponent } from './product-master-variations/product-master-variations.component';
import { ProductPageComponent } from './product-page.component';
import { RetailSetPartsComponent } from './retail-set-parts/retail-set-parts.component';

describe('Product Page Component', () => {
  let component: ProductPageComponent;
  let fixture: ComponentFixture<ProductPageComponent>;
  let element: HTMLElement;
  let location: Location;
  let shoppingFacade: ShoppingFacade;

  const categories = categoryTree([{ uniqueId: 'A', categoryPath: ['A'] } as Category]);

  beforeEach(async () => {
    shoppingFacade = mock(ShoppingFacade);
    when(shoppingFacade.selectedProduct$).thenReturn(EMPTY);
    when(shoppingFacade.selectedCategory$).thenReturn(of(createCategoryView(categories, 'A')));

    await TestBed.configureTestingModule({
      imports: [
        FeatureToggleModule.forTesting('recently'),
        RouterTestingModule.withRoutes([{ path: '**', component: ProductPageComponent }]),
      ],
      declarations: [
        MockComponent(BreadcrumbComponent),
        MockComponent(LoadingComponent),
        MockComponent(ProductBundlePartsComponent),
        MockComponent(ProductDetailComponent),
        MockComponent(ProductLinksComponent),
        MockComponent(ProductMasterVariationsComponent),
        MockComponent(RecentlyViewedComponent),
        MockComponent(RetailSetPartsComponent),
        ProductPageComponent,
      ],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    location = TestBed.inject(Location);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display loading when product is loading', () => {
    when(shoppingFacade.productDetailLoading$).thenReturn(of(true));

    fixture.detectChanges();

    expect(findAllCustomElements(element)).toEqual(['ish-loading', 'ish-recently-viewed']);
  });

  it('should display product-detail when product is available', () => {
    const product = { sku: 'dummy', completenessLevel: ProductCompletenessLevel.Detail } as Product;
    when(shoppingFacade.selectedProduct$).thenReturn(of(createProductView(product, categories)));

    fixture.detectChanges();

    expect(findAllCustomElements(element)).toEqual([
      'ish-breadcrumb',
      'ish-product-detail',
      'ish-product-links',
      'ish-recently-viewed',
    ]);
  });

  it('should redirect to product page when variation is selected', fakeAsync(() => {
    const product = {
      sku: '222',
      variableVariationAttributes: [
        { name: 'Attr 1', type: 'VariationAttribute', value: 'B', variationAttributeId: 'a1' },
        { name: 'Attr 2', type: 'VariationAttribute', value: 'D', variationAttributeId: 'a2' },
      ],
      variations: () => [
        {
          sku: '222',
          variableVariationAttributes: [
            { name: 'Attr 1', type: 'VariationAttribute', value: 'B', variationAttributeId: 'a1' },
            { name: 'Attr 2', type: 'VariationAttribute', value: 'D', variationAttributeId: 'a2' },
          ],
        },
        {
          sku: '333',
          attributes: [{ name: 'defaultVariation', type: 'Boolean', value: true }],
          variableVariationAttributes: [
            { name: 'Attr 1', type: 'VariationAttribute', value: 'A', variationAttributeId: 'a1' },
            { name: 'Attr 2', type: 'VariationAttribute', value: 'D', variationAttributeId: 'a2' },
          ],
          defaultCategory: noop,
        },
      ],
    } as VariationProductView;

    const selection: VariationSelection = {
      a1: 'A',
      a2: 'D',
    };

    fixture.detectChanges();

    component.variationSelected({ selection }, product);
    tick(500);

    expect(location.path()).toMatchInlineSnapshot(`"/sku333-catA"`);
  }));

  describe('redirecting to default variation', () => {
    const product = {
      sku: 'M111',
      type: 'VariationProductMaster',
      completenessLevel: ProductCompletenessLevel.Detail,
      defaultVariationSKU: '222',
    } as VariationProductMaster;
    const variation1 = { sku: '111' } as VariationProduct;
    const variation2 = {
      sku: '222',
      attributes: [{ name: 'defaultVariation', type: 'Boolean', value: true }],
      completenessLevel: ProductCompletenessLevel.Detail,
      defaultCategoryId: 'A',
    } as VariationProduct;

    beforeEach(() => {
      when(shoppingFacade.selectedProduct$).thenReturn(
        of(createVariationProductMasterView(product, { 111: variation1, 222: variation2 }, categories))
      );
      TestBed.inject(Router).navigateByUrl('/product/M111');
    });

    it('should redirect to default variation for master product', fakeAsync(() => {
      fixture.detectChanges();
      tick(500);

      expect(location.path()).toMatchInlineSnapshot(`"/sku222-catA"`);
    }));

    it('should not redirect to default variation for master product if advanced variation handling is activated', fakeAsync(() => {
      FeatureToggleModule.switchTestingFeatures('advancedVariationHandling');

      fixture.detectChanges();
      tick(500);

      expect(location.path()).toMatchInlineSnapshot(`"/product/M111"`);
    }));
  });

  it('should only dispatch retail set products when quantities are greater than 0', () => {
    const product = {
      sku: 'ABC',
      partSKUs: ['A', 'B', 'C'],
      type: 'RetailSet',
    } as ProductRetailSet;
    when(shoppingFacade.selectedProduct$).thenReturn(of(createProductView(product, categories)));

    fixture.detectChanges();

    component.retailSetParts$.next([
      { sku: 'A', quantity: 1 },
      { sku: 'B', quantity: 0 },
      { sku: 'C', quantity: 1 },
    ]);

    component.addToBasket();
    verify(shoppingFacade.addProductToBasket('A', 1)).once();
    verify(shoppingFacade.addProductToBasket('C', 1)).once();
    verify(shoppingFacade.addProductToBasket('B', anything())).never();
  });
});
