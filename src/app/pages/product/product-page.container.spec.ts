import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { combineReducers } from '@ngrx/store';
import { cold } from 'jest-marbles';
import { MockComponent } from 'ng-mocks';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { VariationSelection } from 'ish-core/models/product-variation/variation-selection.model';
import { VariationProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductRetailSet } from 'ish-core/models/product/product-retail-set.model';
import { VariationProductMaster } from 'ish-core/models/product/product-variation-master.model';
import { VariationProduct } from 'ish-core/models/product/product-variation.model';
import { Product, ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { ProductRoutePipe } from 'ish-core/pipes/product-route.pipe';
import { ApplyConfiguration } from 'ish-core/store/configuration';
import { coreReducers } from 'ish-core/store/core-store.module';
import { LoadProductSuccess, LoadProductVariationsSuccess, SelectProduct } from 'ish-core/store/shopping/products';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { findAllIshElements } from 'ish-core/utils/dev/html-query-utils';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { ProductAddToQuoteDialogComponent } from '../../extensions/quoting/shared/product/components/product-add-to-quote-dialog/product-add-to-quote-dialog.component';
import { BreadcrumbComponent } from '../../shared/common/components/breadcrumb/breadcrumb.component';
import { LoadingComponent } from '../../shared/common/components/loading/loading.component';
import { RecentlyViewedContainerComponent } from '../../shared/recently/containers/recently-viewed/recently-viewed.container';

import { ProductBundlePartsComponent } from './components/product-bundle-parts/product-bundle-parts.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { RetailSetPartsComponent } from './components/retail-set-parts/retail-set-parts.component';
import { ProductPageContainerComponent } from './product-page.container';

describe('Product Page Container', () => {
  let component: ProductPageContainerComponent;
  let fixture: ComponentFixture<ProductPageContainerComponent>;
  let element: HTMLElement;
  let store$: TestStore;
  let location: Location;

  beforeEach(async(() => {
    @Component({ template: 'dummy', changeDetection: ChangeDetectionStrategy.OnPush })
    // tslint:disable-next-line:prefer-mocks-instead-of-stubs-in-tests
    class DummyComponent {}

    TestBed.configureTestingModule({
      imports: [
        ...ngrxTesting({
          ...coreReducers,
          shopping: combineReducers(shoppingReducers),
        }),
        FeatureToggleModule,
        NgbModalModule,
        RouterTestingModule.withRoutes([{ path: 'product/:sku', component: DummyComponent }]),
      ],
      declarations: [
        DummyComponent,
        MockComponent(BreadcrumbComponent),
        MockComponent(LoadingComponent),
        MockComponent(ProductAddToQuoteDialogComponent),
        MockComponent(ProductBundlePartsComponent),
        MockComponent(ProductDetailComponent),
        MockComponent(RecentlyViewedContainerComponent),
        MockComponent(RetailSetPartsComponent),
        ProductPageContainerComponent,
      ],
      providers: [ProductRoutePipe],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    location = TestBed.get(Location);
    store$ = TestBed.get(TestStore);
    store$.dispatch(new ApplyConfiguration({ features: ['recently'] }));
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
    expect(findAllIshElements(element)).toEqual(['ish-loading', 'ish-recently-viewed-container']);
  });

  it('should display product-detail when product is available', () => {
    const product = { sku: 'dummy', completenessLevel: ProductCompletenessLevel.Detail } as Product;
    store$.dispatch(new LoadProductSuccess({ product }));
    store$.dispatch(new SelectProduct({ sku: product.sku }));

    fixture.detectChanges();

    expect(findAllIshElements(element)).toEqual([
      'ish-breadcrumb',
      'ish-product-detail',
      'ish-recently-viewed-container',
    ]);
  });

  it('should not display product-detail when product is not completely loaded', () => {
    const product = { sku: 'dummy' } as Product;
    store$.dispatch(new LoadProductSuccess({ product }));
    store$.dispatch(new SelectProduct({ sku: product.sku }));

    fixture.detectChanges();

    expect(findAllIshElements(element)).toEqual(['ish-loading', 'ish-recently-viewed-container']);
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
        },
      ],
    } as VariationProductView;

    const selection: VariationSelection = {
      a1: 'A',
      a2: 'D',
    };

    component.variationSelected(selection, product);
    tick(500);

    expect(location.path()).toEqual('/product/333');
  }));

  it('should redirect to default variation for master product', fakeAsync(() => {
    const product = {
      sku: 'M111',
      type: 'VariationProductMaster',
      completenessLevel: ProductCompletenessLevel.Detail,
    } as VariationProductMaster;

    const variation1 = { sku: '111' } as VariationProduct;
    const variation2 = {
      sku: '222',
      attributes: [{ name: 'defaultVariation', type: 'Boolean', value: true }],
      completenessLevel: ProductCompletenessLevel.Detail,
    } as VariationProduct;

    store$.dispatch(new LoadProductSuccess({ product }));
    store$.dispatch(new LoadProductSuccess({ product: variation1 }));
    store$.dispatch(new LoadProductSuccess({ product: variation2 }));

    store$.dispatch(new LoadProductVariationsSuccess({ sku: product.sku, variations: ['111', '222'] }));
    store$.dispatch(new SelectProduct({ sku: product.sku }));

    fixture.detectChanges();
    tick(500);

    expect(location.path()).toEqual('/product/222');
  }));

  it('should only dispatch retail set products when quantities are greater than 0', () => {
    const product = {
      sku: 'ABC',
      partSKUs: ['A', 'B', 'C'],
      type: 'RetailSet',
    } as ProductRetailSet;
    store$.dispatch(new LoadProductSuccess({ product }));
    store$.dispatch(new SelectProduct({ sku: product.sku }));

    component.retailSetParts$.next([{ sku: 'A', quantity: 1 }, { sku: 'B', quantity: 0 }, { sku: 'C', quantity: 1 }]);

    store$.reset();
    component.addToBasket();
    expect(store$.actionsArray([/.*/])).toMatchInlineSnapshot(`
      Array [
        AddProductToBasket {
          "payload": Object {
            "quantity": 1,
            "sku": "A",
          },
          "type": "[Basket] Add Product",
        },
        AddProductToBasket {
          "payload": Object {
            "quantity": 1,
            "sku": "C",
          },
          "type": "[Basket] Add Product",
        },
      ]
    `);
  });
});
