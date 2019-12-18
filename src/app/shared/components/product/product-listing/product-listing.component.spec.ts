import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, combineReducers } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { SetProductListingPageSize, SetProductListingPages } from 'ish-core/store/shopping/product-listing';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { findAllIshElements } from 'ish-core/utils/dev/html-query-utils';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
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
  let store$: Store<{}>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        InfiniteScrollModule,
        RouterTestingModule,
        ngrxTesting({
          reducers: {
            shopping: combineReducers(shoppingReducers),
          },
        }),
      ],
      declarations: [
        MockComponent(LoadingComponent),
        MockComponent(ProductListComponent),
        MockComponent(ProductListPagingComponent),
        MockComponent(ProductListToolbarComponent),
        ProductListingComponent,
      ],
    }).compileComponents();

    store$ = TestBed.get(Store);
  }));

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

    expect(findAllIshElements(element)).toIncludeAllMembers(['ish-product-list', 'ish-product-list-toolbar']);
  });

  describe('display modes', () => {
    beforeEach(() => {
      store$.dispatch(new SetProductListingPageSize({ itemsPerPage: 1 }));
      store$.dispatch(new SetProductListingPages({ id: TEST_ID, itemCount: 30, sortKeys: [] }));

      component.ngOnChanges({ id: new SimpleChange(undefined, TEST_ID, true) });
    });

    it('should display components with paging on the page if available and mode is endless-scrolling', () => {
      component.mode = 'endless-scrolling';
      fixture.detectChanges();

      expect(findAllIshElements(element)).toMatchInlineSnapshot(`
        Array [
          "ish-product-list",
          "ish-product-list-paging",
          "ish-product-list-toolbar",
        ]
      `);
    });

    it('should display components with paging on the page if available and mode is paging', () => {
      component.mode = 'paging';
      fixture.detectChanges();

      expect(findAllIshElements(element)).toMatchInlineSnapshot(`
        Array [
          "ish-product-list",
          "ish-product-list-toolbar",
          "ish-product-list-toolbar",
        ]
      `);
    });
  });
});
