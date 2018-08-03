import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { MockComponent } from '../../../utils/dev/mock.component';
import { SearchProductsSuccess } from '../../store/search';
import { ShoppingState } from '../../store/shopping.state';
import { shoppingReducers } from '../../store/shopping.system';
import { SetPagingInfo } from '../../store/viewconf';
import { SearchPageContainerComponent } from './search-page.container';

describe('Search Page Container', () => {
  let component: SearchPageContainerComponent;
  let fixture: ComponentFixture<SearchPageContainerComponent>;
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
        SearchPageContainerComponent,
        MockComponent({ selector: 'ish-breadcrumb', template: 'Breadcrumb Component', inputs: ['searchTerm'] }),
        MockComponent({
          selector: 'ish-search-result',
          template: 'Search Result Component',
          inputs: ['searchTerm', 'products', 'totalItems', 'viewType', 'sortBy', 'sortKeys', 'loadingMore'],
        }),
        MockComponent({
          selector: 'ish-search-no-result',
          template: 'Search No Result Component',
          inputs: ['searchTerm'],
        }),
        MockComponent({ selector: 'ish-loading', template: 'Loading Component' }),
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
