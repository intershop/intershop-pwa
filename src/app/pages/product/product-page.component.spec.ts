import { Location } from '@angular/common';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { EMPTY, noop, of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { createCategoryView } from 'ish-core/models/category-view/category-view.model';
import { Category } from 'ish-core/models/category/category.model';
import {
  VariationProductView,
  createProductView,
  createVariationProductMasterView,
} from 'ish-core/models/product-view/product-view.model';
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
  let context: ProductContextFacade;

  const categories = categoryTree([{ uniqueId: 'A', categoryPath: ['A'] } as Category]);

  beforeEach(async () => {
    shoppingFacade = mock(ShoppingFacade);
    when(shoppingFacade.selectedCategory$).thenReturn(of(createCategoryView(categories, 'A')));

    context = mock(ProductContextFacade);
    when(context.select('product')).thenReturn(EMPTY);

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
    })
      .overrideComponent(ProductPageComponent, {
        set: { providers: [{ provide: ProductContextFacade, useFactory: () => instance(context) }] },
      })
      .compileComponents();
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
    when(context.select('loading')).thenReturn(of(true));

    fixture.detectChanges();

    expect(findAllCustomElements(element)).toEqual(['ish-loading', 'ish-recently-viewed']);
  });

  it('should display product page components when product is available', () => {
    const product = { sku: 'dummy', completenessLevel: ProductCompletenessLevel.Detail } as Product;
    when(context.select('product')).thenReturn(of(createProductView(product, categories)));

    fixture.detectChanges();

    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      Array [
        "ish-breadcrumb",
        "ish-product-detail",
        "ish-product-master-variations",
        "ish-product-bundle-parts",
        "ish-retail-set-parts",
        "ish-product-links",
        "ish-recently-viewed",
      ]
    `);
  });

  it('should redirect to product page when product changes', fakeAsync(() => {
    fixture.detectChanges();
    component.redirectToVariation({
      sku: '333',
      defaultCategory: noop,
    } as VariationProductView);

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
      when(context.select('product')).thenReturn(
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
});
