import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { of } from 'rxjs';
import { deepEqual, instance, mock, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductListingView } from 'ish-core/models/product-listing/product-listing.model';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { ProductListPagingComponent } from 'ish-shared/components/product/product-list-paging/product-list-paging.component';
import { ProductListToolbarComponent } from 'ish-shared/components/product/product-list-toolbar/product-list-toolbar.component';
import { ProductListComponent } from 'ish-shared/components/product/product-list/product-list.component';

import { ProductListingComponent } from './product-listing.component';

describe('Product Listing Component', () => {
  const TEST_ID = { type: 'test', value: 'dummy' };
  let component: ProductListingComponent;
  let fixture: ComponentFixture<ProductListingComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const shoppingFacade = mock(ShoppingFacade);
    when(shoppingFacade.productListingViewType$).thenReturn(of('grid'));
    when(shoppingFacade.productListingView$(deepEqual(TEST_ID))).thenReturn(
      of({
        allPagesAvailable: () => false,
        empty: () => false,
        itemCount: 30,
        products: () => ['A', 'B', 'C'],
        productsOfPage: _ => ['A', 'B', 'C'],
        pageIndices: _ => [{ value: 1, display: '1' }],
      } as ProductListingView)
    );

    await TestBed.configureTestingModule({
      imports: [InfiniteScrollModule, RouterTestingModule],
      declarations: [
        MockComponent(LoadingComponent),
        MockComponent(ProductListComponent),
        MockComponent(ProductListPagingComponent),
        MockComponent(ProductListToolbarComponent),
        ProductListingComponent,
      ],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListingComponent);
    component = fixture.componentInstance;
    component.id = TEST_ID;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => component.ngOnChanges({})).not.toThrow();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display components without paging on the page', () => {
    component.ngOnChanges({ id: new SimpleChange(undefined, TEST_ID, true) });
    fixture.detectChanges();

    expect(findAllCustomElements(element)).toIncludeAllMembers(['ish-product-list', 'ish-product-list-toolbar']);
  });

  describe('display modes', () => {
    beforeEach(() => {
      component.ngOnChanges({ id: new SimpleChange(undefined, TEST_ID, true) });
    });

    it('should display components with paging on the page if available and mode is endless-scrolling', () => {
      component.mode = 'endless-scrolling';
      fixture.detectChanges();

      expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
        Array [
          "ish-product-list-toolbar",
          "ish-product-list",
          "ish-product-list-paging",
        ]
      `);
    });

    it('should display components with paging on the page if available and mode is paging', () => {
      component.mode = 'paging';
      fixture.detectChanges();

      expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
        Array [
          "ish-product-list-toolbar",
          "ish-product-list",
          "ish-product-list-toolbar",
        ]
      `);
    });
  });
});
