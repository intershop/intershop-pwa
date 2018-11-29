import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store, StoreModule, combineReducers } from '@ngrx/store';

import { SearchProductsSuccess } from 'ish-core/store/shopping/search';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { SetPagingInfo } from 'ish-core/store/shopping/viewconf';
import { MockComponent } from '../../utils/dev/mock.component';

import { SearchPageContainerComponent } from './search-page.container';

describe('Search Page Container', () => {
  let component: SearchPageContainerComponent;
  let fixture: ComponentFixture<SearchPageContainerComponent>;
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
        MockComponent({
          selector: 'ish-product-list-paging',
          template: 'Product List Paging Component',
          inputs: ['currentPage', 'canRequestMore', 'pageIndices', 'pageUrl'],
        }),
        MockComponent({
          selector: 'ish-search-no-result',
          template: 'Search No Result Component',
          inputs: ['searchTerm'],
        }),
        MockComponent({
          selector: 'ish-search-result',
          template: 'Search Result Component',
          inputs: ['searchTerm', 'products', 'totalItems', 'viewType', 'sortBy', 'sortKeys', 'loadingMore'],
        }),
        MockComponent({ selector: 'ish-breadcrumb', template: 'Breadcrumb Component', inputs: ['searchTerm'] }),
        MockComponent({ selector: 'ish-loading', template: 'Loading Component' }),
        SearchPageContainerComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    store$ = TestBed.get(Store);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render search no result component if search has no results', () => {
    const newProducts = [];
    store$.dispatch(new SearchProductsSuccess('search'));
    store$.dispatch(new SetPagingInfo({ newProducts, currentPage: 0, totalItems: newProducts.length }));
    fixture.detectChanges();
    expect(element.querySelector('ish-search-no-result')).toBeTruthy();
    expect(element.querySelector('ish-search-result')).toBeFalsy();
  });

  it('should render search result component if search has results', () => {
    const newProducts = ['testSKU1', 'testSKU2'];
    store$.dispatch(new SearchProductsSuccess('search'));
    store$.dispatch(new SetPagingInfo({ newProducts, currentPage: 0, totalItems: newProducts.length }));
    fixture.detectChanges();
    expect(element.querySelector('ish-search-result')).toBeTruthy();
    expect(element.querySelector('ish-search-no-result')).toBeFalsy();
  });
});
