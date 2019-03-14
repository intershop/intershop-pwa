import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { cold } from 'jest-marbles';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { VariationSelection } from 'ish-core/models/product-variation/variation-selection.model';
import { VariationProductMasterView, VariationProductView } from 'ish-core/models/product-view/product-view.model';
import { Product, ProductType } from 'ish-core/models/product/product.model';
import { VariationLink } from 'ish-core/models/variation-link/variation-link.model';
import { ApplyConfiguration } from 'ish-core/store/configuration';
import { coreReducers } from 'ish-core/store/core-store.module';
import {
  LoadProduct,
  LoadProductSuccess,
  LoadProductVariationsSuccess,
  SelectProduct,
} from 'ish-core/store/shopping/products';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { findAllIshElements } from 'ish-core/utils/dev/html-query-utils';
import { MockComponent } from 'ish-core/utils/dev/mock.component';

import { ProductPageContainerComponent } from './product-page.container';

describe('Product Page Container', () => {
  let component: ProductPageContainerComponent;
  let fixture: ComponentFixture<ProductPageContainerComponent>;
  let element: HTMLElement;
  let store$: Store<{}>;
  let location: Location;

  beforeEach(async(() => {
    @Component({ template: 'dummy', changeDetection: ChangeDetectionStrategy.OnPush })
    // tslint:disable-next-line:prefer-mocks-instead-of-stubs-in-tests
    class DummyComponent {}

    TestBed.configureTestingModule({
      imports: [
        FeatureToggleModule,
        NgbModalModule,
        RouterTestingModule.withRoutes([{ path: 'product/:sku', component: DummyComponent }]),
        StoreModule.forRoot({
          ...coreReducers,
          shopping: combineReducers(shoppingReducers),
        }),
      ],
      declarations: [
        DummyComponent,
        MockComponent({
          selector: 'ish-breadcrumb',
          template: 'Breadcrumb Component',
          inputs: ['category', 'categoryPath', 'product'],
        }),
        MockComponent({
          selector: 'ish-product-add-to-quote-dialog',
          template: 'Product Add To Quote Dialog',
          inputs: ['quote', 'quoteLoading'],
        }),
        MockComponent({
          selector: 'ish-product-detail',
          template: 'Category Page Component',
          inputs: ['product', 'currentUrl', 'variationOptions'],
        }),
        MockComponent({ selector: 'ish-loading', template: 'Loading Component' }),
        MockComponent({ selector: 'ish-recently-viewed-container', template: 'Recently Viewed Container' }),
        ProductPageContainerComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    location = TestBed.get(Location);
    store$ = TestBed.get(Store);
    store$.dispatch(new ApplyConfiguration({ features: ['recently'] }));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not display anything when neither product nor loading is set (only the recently viewed container)', () => {
    fixture.detectChanges();

    expect(findAllIshElements(element)).toEqual(['ish-recently-viewed-container']);
  });

  it('should display loading when product is loading', () => {
    store$.dispatch(new LoadProduct({ sku: 'dummy' }));

    fixture.detectChanges();

    expect(component.productLoading$).toBeObservable(cold('a', { a: true }));
    expect(findAllIshElements(element)).toEqual(['ish-loading', 'ish-recently-viewed-container']);
  });

  it('should display product-detail when product is available', () => {
    const product = { sku: 'dummy' } as Product;
    store$.dispatch(new LoadProductSuccess({ product }));
    store$.dispatch(new SelectProduct({ sku: product.sku }));

    fixture.detectChanges();

    expect(findAllIshElements(element)).toEqual([
      'ish-breadcrumb',
      'ish-product-detail',
      'ish-recently-viewed-container',
    ]);
  });

  it('should redirect to product page when variation is selected', fakeAsync(() => {
    const product = {
      sku: '222',
      productMasterSKU: 'M111',
      variableVariationAttributes: [
        { name: 'Attr 1', type: 'VariationAttribute', value: 'B', variationAttributeId: 'a1' },
        { name: 'Attr 2', type: 'VariationAttribute', value: 'D', variationAttributeId: 'a2' },
      ],
      productMaster: {
        sku: 'M111',
        variationAttributeValues: [
          { name: 'Attr 1', type: 'VariationAttribute', value: 'A', variationAttributeId: 'a1' },
          { name: 'Attr 1', type: 'VariationAttribute', value: 'B', variationAttributeId: 'a1' },
          { name: 'Attr 2', type: 'VariationAttribute', value: 'C', variationAttributeId: 'a2' },
          { name: 'Attr 2', type: 'VariationAttribute', value: 'D', variationAttributeId: 'a2' },
        ],
      },
      variations: [
        {
          type: 'VariationLink',
          uri: 'ishtest/-/222',
          variableVariationAttributeValues: [
            { name: 'Attr 1', type: 'VariationAttribute', value: 'B', variationAttributeId: 'a1' },
            { name: 'Attr 2', type: 'VariationAttribute', value: 'D', variationAttributeId: 'a2' },
          ],
        },
        {
          type: 'VariationLink',
          attributes: [{ name: 'defaultVariation', type: 'Boolean', value: true }],
          uri: 'ishtest/-/333',
          variableVariationAttributeValues: [
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

    component.variationSelected({ selection, product });
    tick(500);

    expect(location.path()).toEqual('/product/333');
  }));

  it('should redirect to default variation for master product', fakeAsync(() => {
    const product = {
      sku: 'M111',
      type: ProductType.VariationProductMaster,
    } as VariationProductMasterView;

    const variations = [
      { uri: 'ishtest/-/111' },
      {
        attributes: [{ name: 'defaultVariation', type: 'Boolean', value: true }],
        uri: 'ishtest/-/222',
      },
    ] as VariationLink[];

    store$.dispatch(new LoadProductSuccess({ product }));
    store$.dispatch(new LoadProductVariationsSuccess({ sku: product.sku, variations }));
    store$.dispatch(new SelectProduct({ sku: product.sku }));

    fixture.detectChanges();
    tick(500);

    expect(location.path()).toEqual('/product/222');
  }));
});
