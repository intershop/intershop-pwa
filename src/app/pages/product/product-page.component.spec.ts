import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { combineReducers } from '@ngrx/store';
import { cold } from 'jest-marbles';
import { MockComponent } from 'ng-mocks';
import { noop } from 'rxjs';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { Category } from 'ish-core/models/category/category.model';
import { VariationSelection } from 'ish-core/models/product-variation/variation-selection.model';
import { VariationProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductRetailSet } from 'ish-core/models/product/product-retail-set.model';
import { VariationProductMaster } from 'ish-core/models/product/product-variation-master.model';
import { VariationProduct } from 'ish-core/models/product/product-variation.model';
import { Product, ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { ProductRoutePipe } from 'ish-core/routing/product/product-route.pipe';
import { ApplyConfiguration } from 'ish-core/store/configuration';
import { coreReducers } from 'ish-core/store/core-store.module';
import { LoadCategorySuccess, SelectCategory } from 'ish-core/store/shopping/categories';
import { LoadProductSuccess, LoadProductVariationsSuccess, SelectProduct } from 'ish-core/store/shopping/products';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { findAllIshElements } from 'ish-core/utils/dev/html-query-utils';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
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
  let store$: TestStore;
  let location: Location;
  let router: Router;

  beforeEach(async(() => {
    @Component({ template: 'dummy', changeDetection: ChangeDetectionStrategy.OnPush })
    class DummyComponent {}

    TestBed.configureTestingModule({
      imports: [
        FeatureToggleModule,
        RouterTestingModule.withRoutes([{ path: '**', component: DummyComponent }]),
        ngrxTesting({
          reducers: {
            ...coreReducers,
            shopping: combineReducers(shoppingReducers),
          },
        }),
      ],
      declarations: [
        DummyComponent,
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
      providers: [ProductRoutePipe],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    location = TestBed.get(Location);
    router = TestBed.get(Router);
    store$ = TestBed.get(TestStore);
    store$.dispatch(new ApplyConfiguration({ features: ['recently'] }));

    store$.dispatch(
      new LoadCategorySuccess({ categories: categoryTree([{ uniqueId: 'A', categoryPath: ['A'] } as Category]) })
    );
    store$.dispatch(new SelectCategory({ categoryId: 'A' }));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display loading when product is loading', () => {
    store$.dispatch(new LoadProductSuccess({ product: { sku: 'dummy', completenessLevel: 0 } as Product }));

    fixture.detectChanges();

    expect(component.productLoading$).toBeObservable(cold('a', { a: true }));
    expect(findAllIshElements(element)).toEqual(['ish-loading', 'ish-recently-viewed']);
  });

  it('should display product-detail when product is available', () => {
    const product = { sku: 'dummy', completenessLevel: ProductCompletenessLevel.Detail } as Product;
    store$.dispatch(new LoadProductSuccess({ product }));
    store$.dispatch(new SelectProduct({ sku: product.sku }));

    fixture.detectChanges();

    expect(findAllIshElements(element)).toEqual([
      'ish-breadcrumb',
      'ish-product-detail',
      'ish-product-links',
      'ish-recently-viewed',
    ]);
  });

  it('should not display product-detail when product is not completely loaded', () => {
    const product = { sku: 'dummy' } as Product;
    store$.dispatch(new LoadProductSuccess({ product }));
    store$.dispatch(new SelectProduct({ sku: product.sku }));

    fixture.detectChanges();

    expect(findAllIshElements(element)).toEqual(['ish-loading', 'ish-recently-viewed']);
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

    component.variationSelected(selection, product);
    tick(500);

    expect(location.path()).toMatchInlineSnapshot(`"/sku333-catA"`);
  }));

  describe('redirecting to default variation', () => {
    const product = {
      sku: 'M111',
      type: 'VariationProductMaster',
      completenessLevel: ProductCompletenessLevel.Detail,
    } as VariationProductMaster;

    beforeEach(() => {
      const variation1 = { sku: '111' } as VariationProduct;
      const variation2 = {
        sku: '222',
        attributes: [{ name: 'defaultVariation', type: 'Boolean', value: true }],
        completenessLevel: ProductCompletenessLevel.Detail,
      } as VariationProduct;

      store$.dispatch(new LoadProductSuccess({ product }));
      store$.dispatch(new LoadProductSuccess({ product: variation1 }));
      store$.dispatch(new LoadProductSuccess({ product: variation2 }));

      store$.dispatch(
        new LoadProductVariationsSuccess({ sku: product.sku, variations: ['111', '222'], defaultVariation: '222' })
      );
      store$.dispatch(new SelectProduct(product));
    });

    it('should redirect to default variation for master product', fakeAsync(() => {
      router.navigateByUrl(`/product/${product.sku}`);

      fixture.detectChanges();
      tick(500);

      expect(location.path()).toMatchInlineSnapshot(`"/sku222-catA"`);
    }));

    it('should not redirect to default variation for master product if advanced variation handling is activated', fakeAsync(() => {
      store$.dispatch(new ApplyConfiguration({ features: ['advancedVariationHandling'] }));
      router.navigateByUrl(`/product/${product.sku}`);

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
    store$.dispatch(new LoadProductSuccess({ product }));
    store$.dispatch(new SelectProduct({ sku: product.sku }));

    fixture.detectChanges();

    component.retailSetParts$.next([{ sku: 'A', quantity: 1 }, { sku: 'B', quantity: 0 }, { sku: 'C', quantity: 1 }]);

    store$.reset();
    component.addToBasket();
    expect(store$.actionsArray()).toMatchInlineSnapshot(`
      [Basket] Add Product:
        sku: "A"
        quantity: 1
      [Basket] Add Product:
        sku: "C"
        quantity: 1
    `);
  });
});
