import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { MockComponent } from '../../../utils/dev/mock.component';
import { SearchProductsSuccess } from '../../store/search/search.actions';
import { ShoppingState } from '../../store/shopping.state';
import { shoppingReducers } from '../../store/shopping.system';
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
          inputs: ['searchTerm', 'products', 'totalItems', 'viewType', 'sortBy', 'sortKeys'],
        }),
        MockComponent({
          selector: 'ish-search-no-result',
          template: 'Search No Result Component',
          inputs: ['searchTerm'],
        }),
        MockComponent({ selector: 'ish-loading-spinner', template: 'ish-loading-spinner' }),
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
    const products = [];
    store$.dispatch(new SearchProductsSuccess({ searchTerm: 'search', products }));
    fixture.detectChanges();
    expect(element.querySelector('ish-search-no-result')).toBeTruthy();
    expect(element.querySelector('ish-search-result')).toBeFalsy();
  });

  it('should render search result component if search has results', () => {
    const products = ['testSKU1', 'testSKU2'];
    store$.dispatch(new SearchProductsSuccess({ searchTerm: 'search', products }));
    fixture.detectChanges();
    expect(element.querySelector('ish-search-result')).toBeTruthy();
    expect(element.querySelector('ish-search-no-result')).toBeFalsy();
  });
});
