import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { EMPTY, of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { createProductView } from 'ish-core/models/product-view/product-view.model';
import { Product, ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { ContentViewcontextComponent } from 'ish-shared/cms/components/content-viewcontext/content-viewcontext.component';
import { BreadcrumbComponent } from 'ish-shared/components/common/breadcrumb/breadcrumb.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { LazyRecentlyViewedComponent } from '../../extensions/recently/exports/lazy-recently-viewed/lazy-recently-viewed.component';

import { ProductBundlePartsComponent } from './product-bundle-parts/product-bundle-parts.component';
import { ProductDetailInfoComponent } from './product-detail-info/product-detail-info.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductLinksComponent } from './product-links/product-links.component';
import { ProductMasterVariationsComponent } from './product-master-variations/product-master-variations.component';
import { ProductPageComponent } from './product-page.component';
import { RetailSetPartsComponent } from './retail-set-parts/retail-set-parts.component';

describe('Product Page Component', () => {
  let component: ProductPageComponent;
  let fixture: ComponentFixture<ProductPageComponent>;
  let element: HTMLElement;
  let context: ProductContextFacade;

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    when(context.select('product')).thenReturn(EMPTY);
    when(context.select('loading')).thenReturn(of(false));

    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(BreadcrumbComponent),
        MockComponent(ContentViewcontextComponent),
        MockComponent(LazyRecentlyViewedComponent),
        MockComponent(LoadingComponent),
        MockComponent(ProductBundlePartsComponent),
        MockComponent(ProductDetailComponent),
        MockComponent(ProductDetailInfoComponent),
        MockComponent(ProductLinksComponent),
        MockComponent(ProductMasterVariationsComponent),
        MockComponent(RetailSetPartsComponent),
        ProductPageComponent,
      ],
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
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display loading when product is loading', () => {
    when(context.select('loading')).thenReturn(of(true));

    fixture.detectChanges();

    expect(findAllCustomElements(element)).toContain('ish-loading');
  });

  it('should display product page components when product is available', () => {
    const product = { sku: 'dummy', completenessLevel: ProductCompletenessLevel.Detail } as Product;
    const category = { uniqueId: 'A', categoryPath: ['A'] } as CategoryView;
    when(context.select('product')).thenReturn(of(createProductView(product, category)));

    fixture.detectChanges();

    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      Array [
        "ish-content-viewcontext",
        "ish-breadcrumb",
        "ish-product-detail",
        "ish-content-viewcontext",
        "ish-product-bundle-parts",
        "ish-retail-set-parts",
        "ish-product-detail-info",
        "ish-product-master-variations",
        "ish-product-links",
        "ish-content-viewcontext",
        "ish-lazy-recently-viewed",
        "ish-content-viewcontext",
      ]
    `);
  });
});
