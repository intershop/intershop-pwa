import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';
import { spy, verify } from 'ts-mockito';

import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { SetEndlessScrollingPageSize, SetPagingInfo } from 'ish-core/store/shopping/viewconf';
import { findAllIshElements } from 'ish-core/utils/dev/html-query-utils';
import { ProductListPagingComponent } from '../../components/product-list-paging/product-list-paging.component';
import { ProductListToolbarComponent } from '../../components/product-list-toolbar/product-list-toolbar.component';
import { ProductListComponent } from '../../components/product-list/product-list.component';

import { ProductListContainerComponent } from './product-list.container';

describe('Product List Container', () => {
  let component: ProductListContainerComponent;
  let fixture: ComponentFixture<ProductListContainerComponent>;
  let element: HTMLElement;
  let store$: Store<{}>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          shopping: combineReducers(shoppingReducers),
        }),
      ],
      declarations: [
        MockComponent(ProductListComponent),
        MockComponent(ProductListPagingComponent),
        MockComponent(ProductListToolbarComponent),
        ProductListContainerComponent,
      ],
    }).compileComponents();

    store$ = TestBed.get(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display components without paging on the page', () => {
    fixture.detectChanges();

    expect(findAllIshElements(element)).toIncludeAllMembers(['ish-product-list', 'ish-product-list-toolbar']);
  });

  it('should display components with paging on the page if available', () => {
    store$.dispatch(new SetEndlessScrollingPageSize({ itemsPerPage: 1 }));
    store$.dispatch(new SetPagingInfo({ totalItems: 3, currentPage: 2, newProducts: new Array(2) }));

    fixture.detectChanges();

    expect(findAllIshElements(element)).toIncludeAllMembers([
      'ish-product-list',
      'ish-product-list-toolbar',
      'ish-product-list-paging',
    ]);
  });

  describe('loading more products', () => {
    beforeEach(() => {
      store$.dispatch(new SetEndlessScrollingPageSize({ itemsPerPage: 1 }));
    });

    it('should emit an event when loading more products is possible', () => {
      store$.dispatch(new SetPagingInfo({ totalItems: 2, currentPage: 0, newProducts: [] }));

      const emitter = spy(component.loadMore);

      component.loadMoreProducts();

      verify(emitter.emit()).once();
    });

    it('should not emit an event when loading more products is impossible', () => {
      store$.dispatch(new SetPagingInfo({ totalItems: 2, currentPage: 1, newProducts: [] }));

      const emitter = spy(component.loadMore);

      component.loadMoreProducts();

      verify(emitter.emit()).never();
    });
  });
});
