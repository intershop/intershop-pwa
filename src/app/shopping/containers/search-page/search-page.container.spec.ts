import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { combineReducers, StoreModule } from '@ngrx/store';
import { MockComponent } from '../../../utils/dev/mock.component';
import { shoppingReducers } from '../../store/shopping.system';
import { SearchPageContainerComponent } from './search-page.container';

describe('Search Page Container', () => {
  let component: SearchPageContainerComponent;
  let fixture: ComponentFixture<SearchPageContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          shopping: combineReducers(shoppingReducers)
        })
      ],
      declarations: [
        SearchPageContainerComponent,
        MockComponent({ selector: 'ish-breadcrumb', template: 'Breadcrumb Component', inputs: ['searchTerm'] }),
        MockComponent({ selector: 'ish-search-page', template: 'Search Page Component', inputs: ['searchTerm', 'products', 'totalItems', 'viewType', 'sortBy', 'sortKeys'] }),
        MockComponent({ selector: 'ish-search-no-result', template: 'Search No Result Component', inputs: ['searchTerm'] }),
        MockComponent({ selector: 'ish-loading', template: 'ish-loading', inputs: ['searchLoading'] }),
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
