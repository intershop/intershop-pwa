import { ComponentFixture, DeferBlockBehavior, TestBed } from '@angular/core/testing';
import { MockComponent, MockPipe } from 'ng-mocks';
import { EMPTY, of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { createProductView } from 'ish-core/models/product-view/product-view.model';
import { Product, ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { FeatureTogglePipe } from 'ish-core/pipes/feature-toggle.pipe';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { BreadcrumbComponent } from 'ish-shared/components/common/breadcrumb/breadcrumb.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { RecentlyViewedComponent } from '../../extensions/recently/shared/recently-viewed/recently-viewed.component';

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
      imports: [ProductPageComponent],
      deferBlockBehavior: DeferBlockBehavior.Playthrough,
    })
      .overrideComponent(ProductPageComponent, {
        set: { providers: [{ provide: ProductContextFacade, useFactory: () => instance(context) }] },
      })
      .overrideComponent(ProductPageComponent, {
        remove: {
          imports: [
            BreadcrumbComponent,
            FeatureTogglePipe,
            LoadingComponent,
            ProductBundlePartsComponent,
            ProductDetailComponent,
            ProductDetailInfoComponent,
            ProductLinksComponent,
            ProductMasterVariationsComponent,
            RecentlyViewedComponent,
            RetailSetPartsComponent,
          ],
        },
        add: {
          imports: [
            MockComponent(BreadcrumbComponent),
            MockPipe(FeatureTogglePipe, () => true),
            MockComponent(LoadingComponent),
            MockComponent(ProductBundlePartsComponent),
            MockComponent(ProductDetailComponent),
            MockComponent(ProductDetailInfoComponent),
            MockComponent(ProductLinksComponent),
            MockComponent(ProductMasterVariationsComponent),
            MockComponent(RecentlyViewedComponent),
            MockComponent(RetailSetPartsComponent),
          ],
        },
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

  it('should display product page components when product is available', async () => {
    const product = { sku: 'dummy', completenessLevel: ProductCompletenessLevel.Detail } as Product;
    const category = { uniqueId: 'A', categoryPath: ['A'] } as CategoryView;
    when(context.select('product')).thenReturn(of(createProductView(product, category)));

    fixture.detectChanges();
    await fixture.whenRenderingDone();
    fixture.detectChanges();

    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      [
        "ish-breadcrumb",
        "ish-product-detail",
        "ish-product-bundle-parts",
        "ish-retail-set-parts",
        "ish-product-detail-info",
        "ish-product-master-variations",
        "ish-product-links",
        "ish-recently-viewed",
      ]
    `);
  });
});
