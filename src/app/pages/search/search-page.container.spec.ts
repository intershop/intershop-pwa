import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';

import { SetProductListingPages } from 'ish-core/store/shopping/product-listing';
import { SelectSearchTerm } from 'ish-core/store/shopping/search';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { BreadcrumbComponent } from 'ish-shared/common/components/breadcrumb/breadcrumb.component';

import { SearchNoResultComponent } from './components/search-no-result/search-no-result.component';
import { SearchResultComponent } from './components/search-result/search-result.component';
import { SearchPageContainerComponent } from './search-page.container';

describe('Search Page Container', () => {
  let component: SearchPageContainerComponent;
  let fixture: ComponentFixture<SearchPageContainerComponent>;
  let element: HTMLElement;
  let store$: Store<{}>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        StoreModule.forRoot({
          shopping: combineReducers(shoppingReducers),
        }),
      ],
      declarations: [
        MockComponent(BreadcrumbComponent),
        MockComponent(SearchNoResultComponent),
        MockComponent(SearchResultComponent),
        SearchPageContainerComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    store$ = TestBed.get(Store);
    const router: Router = TestBed.get(Router);
    router.initialNavigation();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render search no result component if search has no results', () => {
    const newProducts = [];
    store$.dispatch(new SelectSearchTerm({ searchTerm: 'search' }));
    store$.dispatch(
      new SetProductListingPages({
        id: { type: 'search', value: 'search' },
        itemCount: newProducts.length,
        sortKeys: [],
        1: newProducts,
      })
    );
    fixture.detectChanges();
    expect(element.querySelector('ish-search-no-result')).toBeTruthy();
    expect(element.querySelector('ish-search-result')).toBeFalsy();
  });

  it('should render search result component if search has results', () => {
    const newProducts = ['testSKU1', 'testSKU2'];
    store$.dispatch(new SelectSearchTerm({ searchTerm: 'search' }));
    store$.dispatch(
      new SetProductListingPages({
        id: { type: 'search', value: 'search' },
        itemCount: newProducts.length,
        sortKeys: [],
        1: newProducts,
      })
    );
    fixture.detectChanges();
    expect(element.querySelector('ish-search-no-result')).toBeFalsy();
    expect(element.querySelector('ish-search-result')).toBeTruthy();
  });
});
