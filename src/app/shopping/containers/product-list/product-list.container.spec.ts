import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { spy, verify } from 'ts-mockito';

import { findAllIshElements } from '../../../utils/dev/html-query-utils';
import { MockComponent } from '../../../utils/dev/mock.component';
import { ShoppingState } from '../../store/shopping.state';
import { shoppingReducers } from '../../store/shopping.system';
import { SetEndlessScrollingPageSize, SetPagingInfo } from '../../store/viewconf';

import { ProductListContainerComponent } from './product-list.container';

describe('Product List Container', () => {
  let component: ProductListContainerComponent;
  let fixture: ComponentFixture<ProductListContainerComponent>;
  let element: HTMLElement;
  let store$: Store<ShoppingState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          shopping: combineReducers(shoppingReducers),
        }),
      ],
      declarations: [
        ProductListContainerComponent,
        MockComponent({
          selector: 'ish-product-list-toolbar',
          template: 'Product List Toolbar Component',
          inputs: ['itemCount', 'viewType', 'sortBy', 'sortKeys'],
        }),
        MockComponent({
          selector: 'ish-product-list',
          template: 'Product List Component',
          inputs: ['products', 'category', 'viewType', 'loadingMore'],
        }),
        MockComponent({
          selector: 'ish-product-list-paging',
          template: 'Product List Paging Component',
          inputs: ['currentPage', 'pageIndices', 'pageUrl'],
        }),
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
    store$.dispatch(new SetEndlessScrollingPageSize(1));
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
      store$.dispatch(new SetEndlessScrollingPageSize(1));
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
